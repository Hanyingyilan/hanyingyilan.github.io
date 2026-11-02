import test from 'node:test';
import assert from 'node:assert/strict';
import {generate,loadPolicies,validateHTML} from '../scripts/build.mjs';
const data=loadPolicies();
const keys=['intl','traffic','city','tour','resil','welfare'];
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
test('six static category pages contain exact policies, local citations and ordinary navigation',()=>{
 const out=generate();
 for(const key of keys){
  const path=`policies/${key}.html`,html=out[path];assert.ok(html,`missing ${path}`);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  for(const p of data.PL){
   assert.equal(html.includes(`id="policy-${p.id}"`),p.p===key);
   if(p.p===key){for(const text of [p.t,p.ref,...p.body])assert.ok(html.includes(esc(text)));
    for(const id of p.sourceRefs)assert.ok(html.includes(`id="source-${id}"`));}
  }
  assert.ok(html.includes('href="../#policy-overview"'));
  for(const other of keys)assert.ok(html.includes(`href="${other}.html"`));
  assert.ok(out['index.html'].includes(`href="${path}"`));
  validateHTML(html,out,path);
 }
});
test('every page has aligned metadata and minimal factual JSON-LD',()=>{
 const out=generate();
 const titles=new Set();
 for(const path of ['index.html',...keys.map(k=>`policies/${k}.html`)]){
  const html=out[path];assert.ok(html);
  const canonical='https://hanyingyilan.github.io/'+(path==='index.html'?'':path);
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
  assert.ok(html.includes(`property="og:url" content="${canonical}"`));
  const title=html.match(/<title>(.*?)<\/title>/)[1];titles.add(title);
  assert.ok(html.includes(`name="twitter:title" content="${title}"`));
  const description=html.match(/name="description" content="([^"]+)"/)[1];
  assert.ok(html.includes(`name="twitter:description" content="${description}"`));
  assert.ok(html.includes(`property="og:description" content="${description}"`));
  assert.match(html,/rel="icon" href="(?:\.\.\/)?assets\/images\/site-icon\.png" type="image\/png" sizes="96x96"/);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema['@context'],'https://schema.org');
  const page=schema['@graph'].find(x=>x['@type']==='WebPage');
  assert.equal(page.url,canonical);assert.equal(page.name,title);assert.equal(page.inLanguage,'zh-Hant');
  assert.equal(page.isPartOf['@id'],'https://hanyingyilan.github.io/#website');
  assert.doesNotMatch(JSON.stringify(schema),/sameAs|dateModified|Person|Organization/);
 }
 assert.equal(titles.size,7);
});
