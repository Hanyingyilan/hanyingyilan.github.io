import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

export function checkPublishedFiles(root,manifest=JSON.parse(readFileSync('content/publishing.json','utf8'))){
 const files=[];
 function walk(dir,prefix=''){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
   const relative=prefix+entry.name;
   if(entry.isDirectory())walk(join(dir,entry.name),relative+'/');
   else {assert.ok(entry.isFile(),`unexpected non-file: ${relative}`);files.push(relative)}
  }
 }
 walk(root);
 const missing=manifest.public.filter(f=>!files.includes(f));
 const unexpected=files.filter(f=>!manifest.public.includes(f));
 assert.equal(missing.length,0,`missing public files: ${missing.join(', ')}`);
 assert.equal(unexpected.length,0,`unexpected published files: ${unexpected.join(', ')}`);
 return {files:files.length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(!process.argv[2])throw Error('Usage: node scripts/check-published.mjs OUTPUT_DIRECTORY');
 console.log(JSON.stringify(checkPublishedFiles(process.argv[2])));
}
