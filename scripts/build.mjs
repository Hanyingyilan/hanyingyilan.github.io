import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
export function validate(data){
 const ids=new Set();
 for(const p of data.PL){
  if(ids.has(p.id))throw Error(`duplicate policy: ${p.id}`);ids.add(p.id);
  if(!data.PIL[p.p])throw Error(`unknown category: ${p.p}`);
  if(!p.t||!p.ref||!Array.isArray(p.body)||!p.body.length)throw Error(`incomplete policy: ${p.id}`);
 }
}
export function validateHTML(html, outputs={}) {
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)throw Error('duplicate DOM ID');
 for(const m of html.matchAll(/(?:src|poster|href)="([^"?#]+)[^"]*"/g)) {
  const path=m[1];if(!path.includes(':')&&!outputs[path]&&!existsSync(path))throw Error(`missing asset: ${path}`);
 }
 for(const m of html.matchAll(/href="#([^"]+)"/g))if(!ids.includes(m[1])&&!/^six-(intl|traffic|city|tour|resil|welfare)$/.test(m[1]))throw Error(`missing fragment: ${m[1]}`);
}
const escape=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderOverview(data){
 return '<section id="policy-overview"><div class="wrap"><h2>完整政見與出處</h2>'+Object.entries(data.PIL).filter(([k])=>k!=='gov').map(([key,pillar])=>`<section id="six-${key}"><h3>${escape(pillar.n)}</h3><div class="cards">${data.PL.filter(p=>p.p===key).map(p=>`<article class="pcard" id="policy-${p.id}"><div class="bd"><h4>${escape(p.t)}</h4><ul>${p.body.map(b=>`<li>${escape(b)}</li>`).join('')}</ul><p class="meta">出處：${escape(p.ref)}</p>${p.go?`<a href="#${p.go}">查看相關互動</a>`:''}</div></article>`).join('')}</div></section>`).join('')+'</div></section>';
}
export function build(check=false){
 const data=JSON.parse(readFileSync('content/policies.json','utf8'));validate(data);
 const html=readFileSync('src/index.template.html','utf8').replace('{{POLICY_OVERVIEW}}',renderOverview(data));
 const outputs={'index.html':html,'assets/site.css':readFileSync('src/site.css','utf8'),'assets/js/app.js':readFileSync('src/app.js','utf8'),'assets/js/optional.js':readFileSync('src/optional.js','utf8'),'assets/js/policies.js':'window.POLICY_DATA = '+JSON.stringify(data).replace(/</g,'\\u003c')+';\n'};
 validateHTML(html,outputs);
 for(const [path,text] of Object.entries(outputs)){
  if(check){if(!existsSync(path)||readFileSync(path,'utf8')!==text)throw Error(`stale output: ${path}`)}
  else{mkdirSync(path.includes('/')?path.slice(0,path.lastIndexOf('/')):'.',{recursive:true});writeFileSync(path,text)}
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)build(process.argv.includes('--check'));
