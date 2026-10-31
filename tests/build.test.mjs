import test from 'node:test';
import assert from 'node:assert/strict';
import {validateHTML} from '../scripts/build.mjs';
test('missing local assets rejected',()=>assert.throws(()=>validateHTML('<img src="absent.jpg">',{}),/missing asset/));
test('duplicate DOM IDs rejected',()=>assert.throws(()=>validateHTML('<p id="same"></p><p id="same"></p>',{}),/duplicate DOM/));
test('missing fragment rejected',()=>assert.throws(()=>validateHTML('<a href="#missing">link</a>',{}),/fragment/));
import {build} from '../scripts/build.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
test('committed output is current and stale output rejected',()=>{
 build(true);const original=readFileSync('assets/js/policies.js','utf8');
 try{writeFileSync('assets/js/policies.js',original+'// stale');assert.throws(()=>build(true),/stale output/)}finally{writeFileSync('assets/js/policies.js',original)}
});
test('all public scripts parse',()=>{
 for(const f of ['assets/js/app.js','assets/js/policies.js'])new vm.Script(readFileSync(f,'utf8'),{filename:f});
 for(const f of ['index.html','preview-a.html','preview-b.html','preview-c.html'])for(const m of readFileSync(f,'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:f});
});
