// Serial mobile lab; reports are synthetic observations, never field CWV.
import {chromium} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

export function parseOptions(args){
 const options={output:null,baseURL:'http://127.0.0.1:8123/',external:'blocked',runs:3};
 const keys={'--base-url':'baseURL','--external':'external','--runs':'runs','--output':'output'};
 for(let i=0;i<args.length;i++){
  const [flag,...inline]=args[i].split('=');
  if(keys[flag]){const value=inline.length?inline.join('='):args[++i];if(!value||value.startsWith('--'))throw Error(`Missing ${flag}`);options[keys[flag]]=value;}
  else if(!args[i].startsWith('-')&&!options.output)options.output=args[i];
  else throw Error(`Unknown argument: ${args[i]}`);
 }
 options.runs=Number(options.runs);
 if(!options.output||!['blocked','live'].includes(options.external)||!Number.isInteger(options.runs)||options.runs<1)throw Error('Usage: measure-performance.mjs [OUTPUT] [--base-url URL] [--external=blocked|live] [--runs N] [--output PATH]');
 if(!['http:','https:'].includes(new URL(options.baseURL).protocol))throw Error('HTTP base URL required');
 return options;
}
export function summarizeRequests(requests){
 requests=structuredClone(requests);
 const bytesByOrigin={};
 for(const r of requests){const origin=new URL(r.url).origin;bytesByOrigin[origin]=(bytesByOrigin[origin]||0)+r.bytes;}
 return {count:requests.length,bytes:requests.reduce((n,r)=>n+r.bytes,0),bytesByOrigin,failures:requests.filter(r=>r.error||r.status>=400),pending:requests.filter(r=>!r.finished)};
}
async function measure(browser,options,reducedMotion,run){
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,reducedMotion});
 try{
  const page=await context.newPage(),cdp=await context.newCDPSession(page);
  await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1600000/8,uploadThroughput:750000/8});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Performance.enable');
  let phase='startup';const requests=[],active=new Map(),browserFailures=[];
  cdp.on('Network.requestWillBeSent',e=>{
   const previous=active.get(e.requestId);if(previous&&e.redirectResponse){previous.status=e.redirectResponse.status;previous.bytes=e.redirectResponse.encodedDataLength;previous.finished=true;}
   const record={url:e.request.url,type:e.type,phase,bytes:0,finished:false};requests.push(record);active.set(e.requestId,record);
  });
  cdp.on('Network.responseReceived',e=>{const r=active.get(e.requestId);if(r){r.status=e.response.status;r.mimeType=e.response.mimeType;}});
  cdp.on('Network.loadingFinished',e=>{const r=active.get(e.requestId);if(r){r.bytes=e.encodedDataLength;r.finished=true;r.completedPhase=phase;}});
  cdp.on('Network.loadingFailed',e=>{const r=active.get(e.requestId);if(r){r.error=e.errorText;r.finished=true;r.completedPhase=phase;}});
  page.on('requestfailed',r=>browserFailures.push({url:r.url(),phase,error:r.failure()?.errorText}));
  if(options.external==='blocked')await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(options.baseURL).origin?r.continue():r.abort());
  await page.addInitScript(()=>{
   window.lab={phase:'startup',lcpMs:null,cls:0,longTasks:[],shifts:[]};let start=0,last=0,total=0;
   new PerformanceObserver(list=>{for(const e of list.getEntries())window.lab.lcpMs=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
   new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){
    if(e.startTime-last>1000||e.startTime-start>5000){start=e.startTime;total=0}last=e.startTime;total+=e.value;window.lab.cls=Math.max(window.lab.cls,total);
    window.lab.shifts.push({phase:window.lab.phase,time:e.startTime,value:e.value,sources:(e.sources||[]).map(s=>({node:s.node?`${s.node.nodeName}${s.node.id?"#"+s.node.id:""}${s.node.className?"."+String(s.node.className):""}`:null,previous:s.previousRect.toJSON(),current:s.currentRect.toJSON()}))});
   }}).observe({type:'layout-shift',buffered:true});
   new PerformanceObserver(list=>{for(const e of list.getEntries())window.lab.longTasks.push({phase:window.lab.phase,time:e.startTime,duration:e.duration})}).observe({type:'longtask',buffered:true});
  });
  const metrics=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
  const snapshot=async()=>({lab:await page.evaluate(()=>structuredClone(window.lab)),network:summarizeRequests(requests),requests:structuredClone(requests),metrics:await metrics(),fonts:await page.evaluate(()=>({status:document.fonts.status,faces:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight}))}))});
  await page.goto(options.baseURL,{waitUntil:'load',timeout:60000});await page.waitForTimeout(8000);
  const startup=await snapshot();
  phase='scroll';await page.evaluate(()=>{window.lab.phase='scroll'});
  for(const iframe of await page.locator('.vcard iframe').all()){await iframe.scrollIntoViewIfNeeded();await page.waitForTimeout(150)}
  await page.waitForTimeout(8000);
  const final=await snapshot();
  await cdp.send('DOM.enable');await cdp.send('CSS.enable');
  const {root}=await cdp.send('DOM.getDocument');const renderedFonts={};
  for(const selector of ['h1','.sub']){const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});if(nodeId)renderedFonts[selector]=(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;}
  const phaseResult=(s,previous)=>({lcpMs:s.lab.lcpMs,cls:s.lab.cls,longTaskMs:s.lab.longTasks.filter(e=>e.phase===(previous?'scroll':'startup')).reduce((n,e)=>n+e.duration,0),taskMs:(s.metrics.TaskDuration-(previous?.metrics.TaskDuration||0))*1000,scriptMs:(s.metrics.ScriptDuration-(previous?.metrics.ScriptDuration||0))*1000,shifts:s.lab.shifts.filter(e=>e.phase===(previous?'scroll':'startup')),fonts:s.fonts});
  return {run,reducedMotion,startup:{...phaseResult(startup),network:startup.network,requests:startup.requests},scroll:{...phaseResult(final,startup),network:summarizeRequests(final.requests.filter(r=>r.phase==='scroll')),requests:final.requests.filter(r=>r.phase==='scroll'),startupRequestsAfterScroll:final.requests.filter(r=>r.phase==='startup')},renderedFonts,browserFailures};
 }finally{await context.close()}
}
export async function measurePerformance(options){
 const browser=await chromium.launch(),runs=[];
 try{
  for(const reducedMotion of ['reduce','no-preference'])for(let run=1;run<=options.runs;run++){
   const result=await measure(browser,options,reducedMotion,run);runs.push(result);
   console.log(JSON.stringify({run,reducedMotion,lcpMs:result.startup.lcpMs,cls:result.startup.cls,bytes:result.startup.network.bytes,scrollFailures:result.scroll.network.failures.length}));
  }
  const report={date:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),productDiff:execFileSync('git',['diff','--','src','assets','index.html'],{encoding:'utf8'}),node:process.version,browser:browser.version(),options,conditions:{viewport:'390x844 DPR3 mobile touch',network:'1.6 Mbps down / 750 kbps up / 150ms latency',cpuSlowdown:4,startupWindow:'load + 8 seconds',scrollWindow:'150ms per iframe + 8 seconds',cache:'disabled; new context each run'},limitations:['CDP network/CPU metrics cover the page target; out-of-process cross-origin iframe transfers/CPU can be missing. Browser failures supplement but do not measure missing bytes.','Transfer bytes count completed requests, grouped by initiation phase; startupRequestsAfterScroll includes late startup completions. In-flight transfer bytes are not totals.','CLS is cumulative maximum session-window score, with phase-specific shift sources. Scroll LCP is not a new navigation metric.','Fonts are sampled after scroll; loaded faces do not prove all glyphs use that face; renderedFonts samples actual h1/sub glyph fonts.','Lab long tasks are not Lighthouse TBT or field INP. No field CWV or score.'],runs};
  writeFileSync(options.output,JSON.stringify(report,null,2)+'\n');return report;
 }finally{await browser.close()}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await measurePerformance(parseOptions(process.argv.slice(2)));
