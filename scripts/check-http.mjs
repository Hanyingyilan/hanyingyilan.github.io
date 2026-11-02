import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {loadPolicies} from './build.mjs';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const site=JSON.parse(readFileSync('content/site.json','utf8'));
export function inspectHTML(html,data,sources){
 assert.equal(data.PL.length,23);
 const articles=[...html.matchAll(/<article\b[^>]*id="policy-([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];
 assert.equal(articles.length,23,'23 policy articles required');
 assert.equal(new Set(articles.map(a=>a[1])).size,23,'unique policy articles required');
 for(const p of data.PL){
  const article=articles.find(a=>a[1]===p.id)?.[2];assert.ok(article,`missing policy ${p.id}`);
  for(const text of [p.t,...p.body,p.ref])assert.ok(article.includes(esc(text)),`missing content ${p.id}: ${text}`);
  assert.ok(article.includes('候選人提案'),`missing proposal status ${p.id}`);
  assert.match(article,/內容審查：|完整內容尚待審查/);
  for(const id of p.sourceRefs)assert.ok(article.includes(`href="#source-${id}"`),`missing citation ${p.id}: ${id}`);
 }
 for(const [id,s] of Object.entries(sources)){
  const item=html.match(new RegExp(`<li id="source-${id}">([\\s\\S]*?)<\\/li>`))?.[1];assert.ok(item,`missing source ${id}`);
  for(const text of [s.title,s.published||'未確認',s.reviewed||'尚未完成',s.note])assert.ok(item.includes(esc(text)),`missing source detail ${id}`);
  if(s.url)assert.ok(item.includes(`href="${esc(s.url)}"`),`missing source URL ${id}`);
  assert.match(item,/候選人提案|現行公告（依公告日期）|狀態待查證/);
 }
 const headings=[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
 assert.equal(headings.length,1,'one text H1 required');
 assert.match(headings[0][1].replace(/<[^>]+>/g,''),/韓瑩/,'text H1 names 韓瑩');
 const canonicals=[...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)];
 assert.equal(canonicals.length,1,'one canonical required');
 assert.ok(canonicals[0][0].includes(`href="${site.url}"`),'production canonical');
 for(const key of ['url','title','description','image','type','site_name','locale']){
  const tags=[...html.matchAll(new RegExp(`<meta\\b[^>]*property="og:${key}"[^>]*content="([^"]+)"[^>]*>`,'g'))];
  assert.equal(tags.length,1,`one og:${key} required`);
  if(key==='url')assert.equal(tags[0][1],site.url,'production og:url');
  if(key==='image')assert.equal(new URL(tags[0][1]).origin,new URL(site.url).origin,'production og:image');
 }
 for(const category of Object.keys(data.PIL).filter(k=>k!=='gov'))assert.equal([...html.matchAll(new RegExp(`id="six-${category}"`,'g'))].length,1,`category anchor ${category}`);
 assert.ok(html.includes('發布單位：韓瑩市長候選人辦公室'));
 return {policies:articles.length,sources:Object.keys(sources).length};
}
export async function checkHTTP(base,{published=false}={}){
 const data=loadPolicies(),sources=JSON.parse(readFileSync('content/sources.json','utf8'));
 const results=[];
 for(const path of ['', 'index.html','?utm_source=crawl-check','robots.txt','sitemap.xml']){
  const url=new URL(path,base),res=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});
  assert.equal(res.status,200,`${url} HTTP status`);const html=await res.text();
  let coverage;
  if(path==='robots.txt'){assert.match(html,/User-agent: \*\s+Allow: \//);assert.ok(html.includes('Sitemap: '+site.url+'sitemap.xml'));}
  else if(path==='sitemap.xml')assert.deepEqual([...html.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),[site.url]);
  else coverage=inspectHTML(html,data,sources);
  results.push({url:String(url),status:res.status,...coverage});
 }
 if(published){
  const manifest=JSON.parse(readFileSync('content/publishing.json','utf8'));
  const absent=['preview-a.html','preview-b.html','preview-c.html','src/app.js','content/policies.json','docs/CONTENT.md','package.json','scripts/build.mjs','tests/http.test.mjs','_config.yml','p1-unknown-path-404'];
  for(const [paths,status] of [[manifest.public,200],[absent,404]])for(const path of paths){
   const url=new URL(path,base),res=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});
   await res.body?.cancel();
   assert.equal(res.status,status,`${url} published HTTP status`);
   results.push({url:String(url),status:res.status});
  }
 }
 return {checkedAt:new Date().toISOString(),mode:published?'published':'local',results};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const args=process.argv.slice(2),published=args.includes('--published'),urls=args.filter(a=>a!=='--published');
 if(urls.length!==1||urls[0].startsWith('--'))throw Error('Usage: node scripts/check-http.mjs BASE_URL [--published]');
 console.log(JSON.stringify(await checkHTTP(urls[0],{published}),null,2));
}
