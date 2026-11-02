import {renderAnalytics} from '../src/analytics.mjs';
import {validateSources,citation,sourceList} from '../src/sources.mjs';
import {HtmlValidate} from 'html-validate';
import {join} from 'node:path';
import {RATES,PROVENANCE,calculateBenefits,DEFAULT_COUNTS,MAX_MONTHS} from '../src/calculator.mjs';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
export function validate(data){
 const ids=new Set();
 for(const p of data.PL){
  if(ids.has(p.id))throw Error(`duplicate policy: ${p.id}`);ids.add(p.id);
  if(!['edm','news'].includes(p.src))throw Error(`unknown source classification: ${p.src}`);
  if(!data.PIL[p.p])throw Error(`unknown category: ${p.p}`);
  if(!p.t||!p.ref||!Array.isArray(p.body)||!p.body.length)throw Error(`incomplete policy: ${p.id}`);
 }
}
const htmlValidator=new HtmlValidate({rules:{'close-order':'error','no-implicit-close':'error'}});
export function validateHTML(html, outputs={}) {
 const report=htmlValidator.validateStringSync(html);
 if(!report.valid)throw Error('HTML syntax: '+report.results.flatMap(r=>r.messages.map(m=>m.message)).join('; '));
 const attrs=(name)=>[...html.matchAll(new RegExp('\\b(?:'+name+')=(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))','g'))].map(m=>m[1]??m[2]??m[3]);
 const ids=attrs('id');
 if(new Set(ids).size!==ids.length)throw Error('duplicate DOM ID');
 for(const value of attrs('src|poster|href')) {
  const path=value.split(/[?#]/)[0];if(path&&!path.includes(':')&&!outputs[path]&&!existsSync(path))throw Error(`missing asset: ${path}`);
 }
 for(const value of attrs('href'))if(value.startsWith('#')&&!ids.includes(value.slice(1))&&!/^#six-(intl|traffic|city|tour|resil|welfare)$/.test(value))throw Error(`missing fragment: ${value}`);
}
const escape=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderOverview(data,sources){
 return '<section id="policy-overview"><div class="wrap"><h2>完整政見與出處</h2>'+Object.entries(data.PIL).filter(([k])=>k!=='gov').map(([key,pillar])=>`<section id="six-${key}"><h3>${escape(pillar.n)}</h3><div class="cards">${data.PL.filter(p=>p.p===key).map(p=>`<article class="pcard" id="policy-${p.id}"><div class="bd"><h4>${escape(p.t)}</h4><ul>${p.body.map(b=>`<li>${escape(b)}</li>`).join('')}</ul><p class="meta">出處：${escape(p.ref)}</p>${citation(p,sources)}${p.go?`<a href="#${p.go}">查看相關互動</a>`:''}</div></article>`).join('')}</div></section>`).join('')+'</div></section>';
}
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
 const sources=JSON.parse(readFileSync('content/sources.json','utf8'));validateSources(data,sources);

 const site=JSON.parse(readFileSync('content/site.json','utf8'));
 if(new URL(site.url).href!==site.url||new URL(site.url).pathname!=='/'||new URL(site.url).search||new URL(site.url).hash)throw Error('invalid production root');
 const analytics=existsSync('content/analytics.json')?JSON.parse(readFileSync('content/analytics.json','utf8')):null;
 const html=resolveRates(readFileSync('src/index.template.html','utf8')).replace('{{ANALYTICS}}',renderAnalytics(analytics,site.url)).replace('{{POLICY_OVERVIEW}}',renderOverview(data,sources)).replace('{{SOURCE_REGISTRY}}',sourceList(sources)).replaceAll('{{DEFAULT_TOTAL}}',calculateBenefits(DEFAULT_COUNTS,MAX_MONTHS).total.toLocaleString('en-US')).replaceAll('{{SITE_URL}}',site.url).replace('{{CALCULATOR_SOURCE}}',`<p class="fine">${PROVENANCE.status}。依 <a href="${PROVENANCE.sourceURL}">${PROVENANCE.sourceDate} 報導的提案金額</a>；來源查閱：${PROVENANCE.checkedDate}。提案與現行給付不同，實際資格及金額請見<a href="${escape(PROVENANCE.currentURL)}">宜蘭市公所公告</a>。</p>`);
 const outputs={'index.html':html,'assets/site.css':readFileSync('src/site.css','utf8'),'assets/js/app.js':readFileSync('src/app.js','utf8'),'assets/js/optional.js':readFileSync('src/optional.js','utf8'),'assets/js/policies.js':'window.SITE_URL = '+JSON.stringify(site.url)+';\nwindow.POLICY_DATA = '+JSON.stringify(data).replace(/</g,'\\u003c')+';\nwindow.POLICY_CITATIONS = '+JSON.stringify(Object.fromEntries(data.PL.map(p=>[p.id,citation(p,sources)]))).replace(/</g,'\\u003c')+';\n'};
 outputs['assets/js/calculator.js']=readFileSync('src/calculator.mjs','utf8').replace(/^export /gm,'');
 const publishing=JSON.parse(readFileSync('content/publishing.json','utf8'));
 outputs['robots.txt']='User-agent: *\nAllow: /\n\nSitemap: '+site.url+'sitemap.xml\n';
 outputs['sitemap.xml']='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+site.url+'</loc></url></urlset>\n';
 outputs['_config.yml']='# Generated by scripts/build.mjs; GitHub Pages legacy Jekyll publishing.\ntheme: null\nexclude:\n'+publishing.excluded.map(f=>'  - '+JSON.stringify(f)).join('\n')+'\n';
 validatePublishing(execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean),publishing);
 for(const path of publishing.public)if(!outputs[path]&&!existsSync(path))throw Error(`missing public file: ${path}`);
 for(const path of Object.keys(outputs))if(path!=='_config.yml'&&!publishing.public.includes(path))throw Error(`output not public: ${path}`);
 validateHTML(html,outputs);
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
