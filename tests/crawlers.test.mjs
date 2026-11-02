import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('sitemap contains only clean root; robots allow public resources',()=>{
 const sitemap=readFileSync('sitemap.xml','utf8');assert.match(sitemap,/<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),['https://hanyingyilan.github.io/']);
 const robots=readFileSync('robots.txt','utf8');assert.match(robots,/Sitemap: https:\/\/hanyingyilan.github.io\/sitemap.xml/);assert.doesNotMatch(robots,/Disallow: \/assets/);
});
import {validatePublishing} from '../scripts/build.mjs';
test('publishing manifest rejects unknown and overlapping files',()=>{
 const m=JSON.parse(readFileSync('content/publishing.json'));
 assert.throws(()=>validatePublishing(['unexpected-private.txt'],m),/unclassified/);
 assert.throws(()=>validatePublishing([],{public:['src/app.js'],excluded:['src']}),/excluded public/);
 const config=readFileSync('_config.yml','utf8');for(const name of m.excluded)assert.ok(config.includes(JSON.stringify(name)));
});
