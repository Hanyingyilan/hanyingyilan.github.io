import {validateVideo,renderTranscript,renderVTT} from '../src/video.mjs';
import {renderAnalytics} from '../src/analytics.mjs';
import {validateSources,citation,sourceList} from '../src/sources.mjs';
import {HtmlValidate} from 'html-validate';
import {join,posix} from 'node:path';
import {renderMetadata,renderOverview,renderCategory,categoryPath} from '../src/pages.mjs';
import {RATES,PROVENANCE,calculateBenefits,DEFAULT_COUNTS,MAX_MONTHS} from '../src/calculator.mjs';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
export function validate(data){
 const ids=new Set();
 if(!data.retainedWho||typeof data.retainedWho!=='object'||Array.isArray(data.retainedWho))throw Error('missing retained filter keys');
 for(const [key,reason] of Object.entries(data.retainedWho))if(Object.hasOwn(data.WHO,key)||typeof reason!=='string'||!reason.trim())throw Error(`invalid retained filter: ${key}`);
 for(const p of data.PL){
  if(ids.has(p.id))throw Error(`duplicate policy: ${p.id}`);ids.add(p.id);
  if(!['edm','news'].includes(p.src))throw Error(`unknown source classification: ${p.src}`);
  if(!Object.hasOwn(data.PIL,p.p))throw Error(`unknown category: ${p.p}`);
  if(!p.who||typeof p.who!=='object'||Array.isArray(p.who))throw Error(`invalid filter keys: ${p.id}`);
  for(const key of Object.keys(p.who))if(!Object.hasOwn(data.WHO,key)&&!Object.hasOwn(data.retainedWho,key))throw Error(`unknown filter key: ${key}`);
  if(!p.t||!p.ref||!Array.isArray(p.body)||!p.body.length)throw Error(`incomplete policy: ${p.id}`);
 }
}
const htmlValidator=new HtmlValidate({rules:{'close-order':'error','no-implicit-close':'error'}});
export function validateHTML(html, outputs={}, pagePath='index.html') {
 const report=htmlValidator.validateStringSync(html);
 if(!report.valid)throw Error('HTML syntax: '+report.results.flatMap(r=>r.messages.map(m=>m.message)).join('; '));
 const attrs=(name)=>[...html.matchAll(new RegExp('\\b(?:'+name+')=(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))','g'))].map(m=>m[1]??m[2]??m[3]);
 const ids=attrs('id');
 if(new Set(ids).size!==ids.length)throw Error('duplicate DOM ID');
 for(const value of attrs('src|poster|href')) {
  const raw=value.split(/[?#]/)[0];
  if(raw&&!raw.includes(':')){const path=posix.normalize(posix.join(posix.dirname(pagePath),raw));const target=raw.endsWith('/')?path+'/index.html':path;
   if(!Object.hasOwn(outputs,target)&&!existsSync(target))throw Error(`missing asset: ${target}`);}
 }
 for(const value of attrs('href'))if(value.startsWith('#')&&!ids.includes(value.slice(1))&&!/^#six-(intl|traffic|city|tour|resil|welfare)$/.test(value))throw Error(`missing fragment: ${value}`);
}
const escape=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export function validatePublishing(files, manifest){
 for(const f of files)if(f!=='_config.yml'&&!manifest.public.includes(f)&&!manifest.excluded.some(x=>f===x||f.startsWith(x+'/')))throw Error(`unclassified publish file: ${f}`);
 for(const f of manifest.public)if(manifest.excluded.some(x=>f===x||f.startsWith(x+'/')))throw Error(`excluded public file: ${f}`);
}
export function resolveRates(text){
 const values={...Object.fromEntries(Object.entries(RATES).map(([k,v])=>[k,v.toLocaleString('en-US')])),birthWan:RATES.birth/10000,priorBirthWan:RATES.priorBirth/10000,e4Wan:RATES.e4/10000};
 return text.replace(/\{\{rate\.(\w+)\}\}/g,(_,k)=>{if(!(k in values))throw Error(`unknown rate: ${k}`);return values[k]});
}
export function loadPolicies(){return JSON.parse(resolveRates(readFileSync('content/policies.json','utf8')))}
export function generate(){
 const data=loadPolicies();validate(data);
 const video=JSON.parse(readFileSync('content/video.json','utf8'));validateVideo(video);
 const sources=JSON.parse(readFileSync('content/sources.json','utf8'));validateSources(data,sources);

 const site=JSON.parse(readFileSync('content/site.json','utf8'));
 if(new URL(site.url).href!==site.url||new URL(site.url).pathname!=='/'||new URL(site.url).search||new URL(site.url).hash)throw Error('invalid production root');
 const analytics=existsSync('content/analytics.json')?JSON.parse(readFileSync('content/analytics.json','utf8')):null;
 const html=resolveRates(readFileSync('src/index.template.html','utf8')).replace('{{LOCAL_VIDEO_TRANSCRIPT}}',renderTranscript(video)).replace('{{PAGE_METADATA}}',renderMetadata(site)).replace('{{ANALYTICS}}',renderAnalytics(analytics,site.url)).replace('{{POLICY_OVERVIEW}}',renderOverview(data,sources)).replace('{{SOURCE_REGISTRY}}',sourceList(sources)).replaceAll('{{DEFAULT_TOTAL}}',calculateBenefits(DEFAULT_COUNTS,MAX_MONTHS).total.toLocaleString('en-US')).replaceAll('{{SITE_URL}}',site.url).replace('{{CALCULATOR_SOURCE}}',`<p class="fine">${PROVENANCE.status}。依 <a href="${PROVENANCE.sourceURL}">${PROVENANCE.sourceDate} 報導的提案金額</a>；來源查閱：${PROVENANCE.checkedDate}。提案與現行給付不同，實際資格及金額請見<a href="${escape(PROVENANCE.currentURL)}">宜蘭市公所公告</a>。</p>`);
 const outputs={'index.html':html,'assets/site.css':readFileSync('src/site.css','utf8'),'assets/js/app.js':readFileSync('src/app.js','utf8'),'assets/js/optional.js':readFileSync('src/optional.js','utf8'),'assets/js/policies.js':'window.SITE_URL = '+JSON.stringify(site.url)+';\nwindow.POLICY_DATA = '+JSON.stringify(data).replace(/</g,'\\u003c')+';\nwindow.POLICY_CITATIONS = '+JSON.stringify(Object.fromEntries(data.PL.map(p=>[p.id,citation(p,sources)]))).replace(/</g,'\\u003c')+';\n'};
 outputs['assets/videos/courage-for-hometown.zh-Hant.vtt']=renderVTT(video);
 outputs['assets/js/calculator.js']=readFileSync('src/calculator.mjs','utf8').replace(/^export /gm,'');
 const categories=Object.keys(data.PIL);
 for(const key of categories)outputs[categoryPath(key)]=renderCategory(data,sources,site,key);
 const publishing=JSON.parse(readFileSync('content/publishing.json','utf8'));
 outputs['robots.txt']='User-agent: *\nAllow: /\n\nSitemap: '+site.url+'sitemap.xml\n';
 outputs['sitemap.xml']='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['',...categories.map(categoryPath)].map(path=>'<url><loc>'+new URL(path,site.url).href+'</loc></url>').join('')+'</urlset>\n';
 outputs['_config.yml']='# Generated by scripts/build.mjs; GitHub Pages legacy Jekyll publishing.\ntheme: null\nexclude:\n'+publishing.excluded.map(f=>'  - '+JSON.stringify(f)).join('\n')+'\n';
 validatePublishing(execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean),publishing);
 for(const path of publishing.public)if(!outputs[path]&&!existsSync(path))throw Error(`missing public file: ${path}`);
 for(const path of Object.keys(outputs))if(path!=='_config.yml'&&!publishing.public.includes(path))throw Error(`output not public: ${path}`);
 for(const [path,content] of Object.entries(outputs))if(path.endsWith('.html'))validateHTML(content,outputs,path);
 return outputs;
}
export function writeOutputs(outputs,check=false,root='.'){
 for(const [relative,text] of Object.entries(outputs)){
  const path=join(root,relative);
  if(check){if(!existsSync(path)||readFileSync(path,'utf8')!==text)throw Error(`stale output: ${relative}`)}
  else{mkdirSync(path.includes('/')?path.slice(0,path.lastIndexOf('/')):'.',{recursive:true});writeFileSync(path,text)}
 }
}
export function build(check=false){writeOutputs(generate(),check)}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)build(process.argv.includes('--check'));
