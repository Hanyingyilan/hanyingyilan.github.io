import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inspectHTML} from '../scripts/check-http.mjs';
import {loadPolicies} from '../scripts/build.mjs';
const html=readFileSync('index.html','utf8'),data=loadPolicies(),sources=JSON.parse(readFileSync('content/sources.json','utf8'));
test('non-JavaScript response checker requires every policy and original content',()=>{
 assert.deepEqual(inspectHTML(html,data,sources),{policies:23,sources:11});
 assert.throws(()=>inspectHTML(html.replace(/<article class="pcard" id="policy-[\s\S]*?<\/article>/,''),data,sources),/23 policy/);
 assert.throws(()=>inspectHTML(html.replace(/<p class="meta">出處：[\s\S]*?<\/p>/,''),data,sources),/missing content/);
});
test('non-JavaScript response checker rejects missing citations and source details',()=>{
 assert.throws(()=>inspectHTML(html.replace(/href="#source-[^"]+"/,'href="#removed"'),data,sources),/missing citation/);
 assert.throws(()=>inspectHTML(html.replace(/<li id="source-[\s\S]*?<\/li>/,''),data,sources),/missing source/);
});

test('HTTP checker rejects missing text heading, duplicate canonical, wrong OG and anchors',()=>{
 for(const [bad,pattern] of [
  [html.replace(/<h1[\s\S]*?<\/h1>/,''),/H1/],
  [html.replace('</head>','<link rel="canonical" href="https://example.com/"></head>'),/canonical/],
  [html.replace(/property="og:url" content="[^"]+"/,'property="og:url" content="https://example.com/"'),/og:url/],
  [html.replace('id="six-intl"','id="removed"'),/category anchor/]
 ])assert.throws(()=>inspectHTML(bad,data,sources),pattern);
});

import {createServer} from 'node:http';
import {checkHTTP} from '../scripts/check-http.mjs';
test('published HTTP mode rejects missing assets, leaked sources and soft 404s',async()=>{
 const manifest=JSON.parse(readFileSync('content/publishing.json','utf8'));
 let missing=null,leak=null;
 const server=createServer((req,res)=>{
  const path=new URL(req.url,'http://test/').pathname.slice(1)||'index.html';
  const exists=manifest.public.includes(path)&&path!==missing;
  res.statusCode=exists||path===leak?200:404;
  res.end(exists?readFileSync(path):'not found');
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}/`;
 try{
  const result=await checkHTTP(base,{published:true});assert.equal(result.mode,'published');
  missing='assets/js/app.js';await assert.rejects(checkHTTP(base,{published:true}),/published HTTP status/);missing=null;
  for(leak of ['src/app.js','preview-a.html','p1-unknown-path-404'])await assert.rejects(checkHTTP(base,{published:true}),/published HTTP status/);
 }finally{await new Promise(resolve=>server.close(resolve))}
});
