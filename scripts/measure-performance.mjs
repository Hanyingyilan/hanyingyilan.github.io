// Serial mobile lab; reports are synthetic observations, never field CWV.
import {chromium} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

export function parseOptions(args){
 const options={output:null,baseURL:'http://127.0.0.1:8123/',external:'blocked',runs:3,scrollWaitMs:8000};
 const keys={'--base-url':'baseURL','--external':'external','--runs':'runs','--output':'output','--scroll-wait-ms':'scrollWaitMs'};
 for(let i=0;i<args.length;i++){
  const [flag,...inline]=args[i].split('=');
  if(keys[flag]){const value=inline.length?inline.join('='):args[++i];if(!value||value.startsWith('--'))throw Error(`Missing ${flag}`);options[keys[flag]]=value;}
  else if(!args[i].startsWith('-')&&!options.output)options.output=args[i];
  else throw Error(`Unknown argument: ${args[i]}`);
 }
 options.runs=Number(options.runs);options.scrollWaitMs=Number(options.scrollWaitMs);
 if(!options.output||!['blocked','live'].includes(options.external)||!Number.isInteger(options.runs)||options.runs<1||!Number.isInteger(options.scrollWaitMs)||options.scrollWaitMs<0)throw Error('Usage: measure-performance.mjs [OUTPUT] [--base-url URL] [--external=blocked|live] [--runs N] [--scroll-wait-ms N] [--output PATH]');
 if(!['http:','https:'].includes(new URL(options.baseURL).protocol))throw Error('HTTP base URL required');
 return options;
}
export function summarizeRequests(requests){
 requests=structuredClone(requests);
 const bytesByOrigin={};
 for(const r of requests){const origin=new URL(r.url).origin;bytesByOrigin[origin]=(bytesByOrigin[origin]||0)+r.bytes;}
 return {count:requests.length,bytes:requests.reduce((n,r)=>n+r.bytes,0),bytesByOrigin,failures:requests.filter(r=>r.error||r.status>=400),pending:requests.filter(r=>!r.finished)};
}
// Keep external query strings (for example signed media URLs) out of shareable reports.
function reportURL(value,baseURL){
 const url=new URL(value);if(!['http:','https:'].includes(url.protocol))return url.protocol;url.username='';url.password='';url.hash='';
 if(url.origin!==new URL(baseURL).origin)url.search='';
 return url.href;
}
export function createRequestRecorder(baseURL){
 const requests=[],active=new Map();
 return {requests,record(method,event,sessionId,phase){
  const {requestId}=event;
  if(method==='Network.requestWillBeSent'){
   if(!['http:','https:'].includes(new URL(event.request.url).protocol))return;
   const previous=active.get(requestId);
   if(previous&&event.redirectResponse){previous.status=event.redirectResponse.status;previous.bytes=event.redirectResponse.encodedDataLength;previous.finished=true;previous.completedPhase=phase;}
   else if(previous)return;
   const record={url:reportURL(event.request.url,baseURL),type:event.type,phase,targetSession:sessionId,bytes:0,finished:false};
   requests.push(record);active.set(requestId,record);return;
  }
  // A navigation starts in the page session and finishes in its new OOPIF session.
  const record=active.get(requestId);if(!record)return;
  if(method==='Network.responseReceived'){record.status=event.response.status;record.mimeType=event.response.mimeType;}
  if(method==='Network.loadingFinished'){record.bytes=event.encodedDataLength;record.finished=true;record.completedPhase=phase;}
  if(method==='Network.loadingFailed'){record.error=event.errorText;record.finished=true;record.completedPhase=phase;}
 }};
}
// Playwright's page CDPSession cannot address flattened OOPIF sessions. Connect to
// this browser's ephemeral loopback endpoint; never reuse a fixed debugging port.
async function captureTargets(browser,recorder,getPhase){
 const root=await browser.newBrowserCDPSession();
 const {arguments:args}=await root.send('Browser.getBrowserCommandLine');
 const profile=args.find(arg=>arg.startsWith('--user-data-dir=')).slice('--user-data-dir='.length);
 const [port,path]=readFileSync(`${profile}/DevToolsActivePort`,'utf8').trim().split('\n');
 const socket=new WebSocket(`ws://127.0.0.1:${port}${path}`);
 await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
 let nextId=0;const pending=new Map(),setups=[],targets=[],errors=[];
 const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
  const id=++nextId;pending.set(id,{resolve,reject});
  socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
 });
 socket.onmessage=({data})=>{
  const message=JSON.parse(data);
  if(message.id){const request=pending.get(message.id);pending.delete(message.id);if(message.error)request?.reject(Error(message.error.message));else request?.resolve(message.result);return;}
  if(message.method==='Target.attachedToTarget'){
   const {sessionId,targetInfo}=message.params;targets.push({sessionId,type:targetInfo.type});
   setups.push((async()=>{
    try{
     await send('Network.enable',{},sessionId);await send('Network.setCacheDisabled',{cacheDisabled:true},sessionId);
     await send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1600000/8,uploadThroughput:750000/8},sessionId);
     await send('Emulation.setCPUThrottlingRate',{rate:4},sessionId);
     await send('Target.setAutoAttach',{autoAttach:true,waitForDebuggerOnStart:true,flatten:true,filter:[{type:'iframe'},{exclude:true}]},sessionId);
    }catch(error){errors.push({type:targetInfo.type,error:error.message});}
    finally{await send('Runtime.runIfWaitingForDebugger',{},sessionId).catch(()=>{});}
   })());
  }else if(message.method?.startsWith('Network.'))recorder.record(message.method,message.params,message.sessionId,getPhase());
 };
 await send('Target.setAutoAttach',{autoAttach:true,waitForDebuggerOnStart:true,flatten:true,filter:[{type:'page'},{type:'iframe'},{exclude:true}]});
 return {targets,errors,ready:()=>Promise.all(setups),processInfo:()=>send('SystemInfo.getProcessInfo'),close:async()=>{
  await Promise.all(setups);await send('Target.setAutoAttach',{autoAttach:false,waitForDebuggerOnStart:false,flatten:true});socket.close();await root.detach();
 }};
}
function processCPU(before,after){
 const byTypeMs={};
 for(const process of after.processInfo){const delta=(process.cpuTime-(before.processInfo.find(p=>p.id===process.id)?.cpuTime||0))*1000;byTypeMs[process.type]=(byTypeMs[process.type]||0)+delta;}
 return {byTypeMs,exitedProcesses:before.processInfo.filter(p=>!after.processInfo.some(q=>q.id===p.id)).map(p=>p.type)};
}
async function measure(browser,options,reducedMotion,run){
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,reducedMotion});
 let capture;
 try{
  let phase='startup';const recorder=createRequestRecorder(options.baseURL),requests=recorder.requests,browserFailures=[];
  capture=await captureTargets(browser,recorder,()=>phase);
  const page=await context.newPage();await capture.ready();
  const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');
  page.on('requestfailed',r=>browserFailures.push({url:reportURL(r.url(),options.baseURL),phase,error:r.failure()?.errorText}));
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
  const snapshot=async()=>({lab:await page.evaluate(()=>structuredClone(window.lab)),network:summarizeRequests(requests),requests:structuredClone(requests),metrics:await metrics(),processes:await capture.processInfo(),fonts:await page.evaluate(()=>({status:document.fonts.status,faces:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight}))}))});
  const initialProcesses=await capture.processInfo();
  await page.goto(options.baseURL,{waitUntil:'load',timeout:60000});await page.waitForTimeout(8000);
  const startup=await snapshot();
  phase='scroll';await page.evaluate(()=>{window.lab.phase='scroll'});
  for(const iframe of await page.locator('.vcard iframe').all()){await iframe.scrollIntoViewIfNeeded();await page.waitForTimeout(150)}
  await page.waitForTimeout(options.scrollWaitMs??8000);
  const final=await snapshot();
  await cdp.send('DOM.enable');await cdp.send('CSS.enable');
  const {root}=await cdp.send('DOM.getDocument');const renderedFonts={};
  for(const selector of ['h1','.sub']){const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});if(nodeId)renderedFonts[selector]=(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;}
  const phaseResult=(s,previous)=>({lcpMs:s.lab.lcpMs,cls:s.lab.cls,longTaskMs:s.lab.longTasks.filter(e=>e.phase===(previous?'scroll':'startup')).reduce((n,e)=>n+e.duration,0),taskMs:(s.metrics.TaskDuration-(previous?.metrics.TaskDuration||0))*1000,scriptMs:(s.metrics.ScriptDuration-(previous?.metrics.ScriptDuration||0))*1000,shifts:s.lab.shifts.filter(e=>e.phase===(previous?'scroll':'startup')),fonts:s.fonts});
  return {run,reducedMotion,targets:capture.targets,targetSetupErrors:capture.errors,startup:{...phaseResult(startup),browserProcessCPU:processCPU(initialProcesses,startup.processes),network:startup.network,requests:startup.requests},scroll:{...phaseResult(final,startup),browserProcessCPU:processCPU(startup.processes,final.processes),network:summarizeRequests(final.requests.filter(r=>r.phase==='scroll')),requests:final.requests.filter(r=>r.phase==='scroll'),startupRequestsAfterScroll:final.requests.filter(r=>r.phase==='startup')},renderedFonts,browserFailures};
 }finally{await context.close();if(capture)await capture.close()}
}
export async function measurePerformance(options){
 const browser=await chromium.launch({args:['--remote-debugging-port=0','--enable-automation']}),runs=[];
 try{
  for(const reducedMotion of ['reduce','no-preference'])for(let run=1;run<=options.runs;run++){
   const result=await measure(browser,options,reducedMotion,run);runs.push(result);
   console.log(JSON.stringify({run,reducedMotion,lcpMs:result.startup.lcpMs,cls:result.startup.cls,bytes:result.startup.network.bytes,scrollFailures:result.scroll.network.failures.length}));
  }
  const report={date:new Date().toISOString(),revisionScope:'commit/productDiff describe the local CLI checkout, not a remotely served deployment',commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),productDiff:execFileSync('git',['diff','--','src','assets','index.html'],{encoding:'utf8'}),node:process.version,browser:browser.version(),options,conditions:{viewport:'390x844 DPR3 mobile touch',network:'1.6 Mbps down / 750 kbps up / 150ms latency per attached target; not a shared global bottleneck',cpuSlowdown:4,scope:'Network covers page and autoattached OOPIF targets; browserProcessCPU covers the isolated browser processes, not just the page main thread',startupWindow:'load + 8 seconds',scrollWindow:`150ms per iframe + ${options.scrollWaitMs??8000}ms`,cache:'disabled; new context each run'},limitations:['Network includes attached page and OOPIF sessions; inspect targetSetupErrors and pending requests before treating completed bytes as full transfer. External request query strings are omitted from reports.','taskMs/scriptMs and long tasks remain page-main-thread observations. browserProcessCPU is a separate process CPU delta, includes renderer/background/throttle overhead, and cannot attribute cost to an individual iframe. Exited processes are reported and their final CPU may be missing.','Transfer bytes count completed requests, grouped by initiation phase; startupRequestsAfterScroll includes late startup completions. In-flight transfer bytes are not totals.','CLS is cumulative maximum session-window score, with phase-specific shift sources. Scroll LCP is not a new navigation metric.','Fonts are sampled after scroll; loaded faces do not prove all glyphs use that face; renderedFonts samples actual h1/sub glyph fonts.','Lab long tasks are not Lighthouse TBT or field INP. No field CWV or score.'],runs};
  writeFileSync(options.output,JSON.stringify(report,null,2)+'\n');return report;
 }finally{await browser.close()}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await measurePerformance(parseOptions(process.argv.slice(2)));
