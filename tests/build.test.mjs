import test from 'node:test';
import assert from 'node:assert/strict';
import {validateHTML} from '../scripts/build.mjs';
test('missing local assets rejected',()=>assert.throws(()=>validateHTML('<img src="absent.jpg">',{}),/missing asset/));
test('duplicate DOM IDs rejected',()=>assert.throws(()=>validateHTML('<p id="same"></p><p id="same"></p>',{}),/duplicate DOM/));
test('missing fragment rejected',()=>assert.throws(()=>validateHTML('<a href="#missing">link</a>',{}),/fragment/));
import {build,generate,writeOutputs} from '../scripts/build.mjs';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import vm from 'node:vm';
test('deterministic output and stale fixture detection for every artifact',()=>{
 build(true);const outputs=generate();assert.deepEqual(generate(),outputs);
 const root=mkdtempSync(join(tmpdir(),'policy-build-'));
 try{writeOutputs(outputs,false,root);writeOutputs(outputs,true,root);
 for(const path of Object.keys(outputs)){writeFileSync(join(root,path),outputs[path]+'stale');assert.throws(()=>writeOutputs(outputs,true,root),/stale output/);writeFileSync(join(root,path),outputs[path]);}
 }finally{rmSync(root,{recursive:true,force:true})}
});
test('all public scripts parse',()=>{
 for(const f of ['assets/js/app.js','assets/js/policies.js','assets/js/optional.js','assets/js/calculator.js'])new vm.Script(readFileSync(f,'utf8'),{filename:f});
 for(const f of ['index.html'])for(const m of readFileSync(f,'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:f});
});
test('real HTML validation rejects malformed nesting and handles single quotes',()=>{
 assert.throws(()=>validateHTML('<html><body><div><span></div>',{}),/HTML syntax/);
 assert.throws(()=>validateHTML("<img src='missing-local.jpg'>",{}),/missing asset/);
 assert.throws(()=>validateHTML("<p id='duplicate'></p><p id='duplicate'></p>",{}),/duplicate DOM/);
});
