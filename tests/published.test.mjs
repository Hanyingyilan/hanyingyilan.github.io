import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {checkPublishedFiles} from '../scripts/check-published.mjs';
test('published artifact requires exact public file set, rejecting missing and leaked files',()=>{
 const root=mkdtempSync(join(tmpdir(),'published-'));
 try{
  mkdirSync(join(root,'assets'));writeFileSync(join(root,'index.html'),'page');
  const manifest={public:['index.html','assets/app.js']};
  assert.throws(()=>checkPublishedFiles(root,manifest),/missing.*assets\/app.js/);
  writeFileSync(join(root,'assets/app.js'),'script');assert.equal(checkPublishedFiles(root,manifest).files,2);
  writeFileSync(join(root,'private.txt'),'private');assert.throws(()=>checkPublishedFiles(root,manifest),/unexpected.*private.txt/);
 }finally{rmSync(root,{recursive:true,force:true})}
});
