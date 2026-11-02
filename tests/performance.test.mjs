import test from 'node:test';
import assert from 'node:assert/strict';
import {parseOptions,summarizeRequests} from '../scripts/measure-performance.mjs';
test('performance CLI preserves positional output and validates measurement options',()=>{
 assert.deepEqual(parseOptions(['report.json']),{output:'report.json',baseURL:'http://127.0.0.1:8123/',external:'blocked',runs:3});
 assert.deepEqual(parseOptions(['--base-url','https://example.com/','--external=live','--runs','2','--output','r.json']),{output:'r.json',baseURL:'https://example.com/',external:'live',runs:2});
 for(const args of [[],['r.json','--external=bad'],['r.json','--runs','0'],['r.json','--runs','1.5'],['r.json','--unknown'],['r.json','--base-url','file:///tmp/']])assert.throws(()=>parseOptions(args));
});
test('network summaries separate origins, failures and unfinished requests',()=>{
 const summary=summarizeRequests([{url:'https://a.test/a',bytes:40,status:200,finished:true},{url:'https://b.test/b',bytes:3,error:'blocked',finished:true},{url:'https://a.test/c',bytes:2,finished:false}]);
 assert.deepEqual(summary.bytesByOrigin,{'https://a.test':42,'https://b.test':3});
 assert.equal(summary.bytes,45);assert.equal(summary.failures.length,1);assert.equal(summary.pending.length,1);
});

test('network phase summaries do not change when a pending request finishes later',()=>{
 const request={url:'https://a.test/slow',bytes:0,finished:false};
 const startup=summarizeRequests([request]);
 request.bytes=100;request.finished=true;request.completedPhase='scroll';
 assert.equal(startup.pending[0].finished,false);assert.equal(startup.pending[0].bytes,0);
});
