import test from 'node:test';
import assert from 'node:assert/strict';
import {parseOptions,summarizeRequests,createRequestRecorder} from '../scripts/measure-performance.mjs';
test('performance CLI preserves positional output and validates measurement options',()=>{
 assert.deepEqual(parseOptions(['report.json']),{output:'report.json',baseURL:'http://127.0.0.1:8123/',external:'blocked',runs:3,scrollWaitMs:8000});
 assert.deepEqual(parseOptions(['--base-url','https://example.com/','--external=live','--runs','2','--output','r.json']),{output:'r.json',baseURL:'https://example.com/',external:'live',runs:2,scrollWaitMs:8000});
 assert.equal(parseOptions(['r.json','--scroll-wait-ms=30000']).scrollWaitMs,30000);
 for(const args of [[],['r.json','--external=bad'],['r.json','--runs','0'],['r.json','--runs','1.5'],['r.json','--scroll-wait-ms','-1'],['r.json','--scroll-wait-ms','1.5'],['r.json','--unknown'],['r.json','--base-url','file:///tmp/']])assert.throws(()=>parseOptions(args));
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

test('iframe navigation completion follows its request across CDP sessions without duplicate bytes',()=>{
 const recorder=createRequestRecorder('https://site.test/');
 recorder.record('Network.requestWillBeSent',{requestId:'navigation',request:{url:'https://video.test/player?token=private'},type:'Document'},'page','scroll');
 recorder.record('Network.responseReceived',{requestId:'navigation',response:{status:200,mimeType:'text/html'}},'page','scroll');
 recorder.record('Network.requestWillBeSent',{requestId:'navigation',request:{url:'https://video.test/player?token=private'},type:'Document'},'iframe','scroll');
 recorder.record('Network.loadingFinished',{requestId:'navigation',encodedDataLength:1350},'iframe','scroll');
 assert.equal(recorder.requests.length,1);
 assert.equal(recorder.requests[0].finished,true);
 assert.equal(recorder.requests[0].bytes,1350);
 assert.equal(recorder.requests[0].url,'https://video.test/player');
 assert.equal(summarizeRequests(recorder.requests).pending.length,0);
});

test('redirects retain both transfers and failed iframe resources finish in their phase',()=>{
 const recorder=createRequestRecorder('https://site.test/');
 recorder.record('Network.requestWillBeSent',{requestId:'r',request:{url:'https://site.test/redirect'},type:'Document'},'page','startup');
 recorder.record('Network.requestWillBeSent',{requestId:'r',request:{url:'https://site.test/final'},type:'Document',redirectResponse:{status:302,encodedDataLength:50}},'page','startup');
 recorder.record('Network.loadingFinished',{requestId:'r',encodedDataLength:150},'page','scroll');
 recorder.record('Network.requestWillBeSent',{requestId:'failed',request:{url:'https://video.test/asset?secret=x'},type:'Script'},'iframe','scroll');
 recorder.record('Network.loadingFailed',{requestId:'failed',errorText:'net::ERR_BLOCKED_BY_CLIENT'},'iframe','scroll');
 assert.equal(summarizeRequests(recorder.requests).bytes,200);
 assert.equal(recorder.requests[0].status,302);
 assert.equal(recorder.requests[1].completedPhase,'scroll');
 assert.equal(recorder.requests[2].finished,true);
 assert.equal(recorder.requests[2].error,'net::ERR_BLOCKED_BY_CLIENT');
 assert.equal(recorder.requests[2].url,'https://video.test/asset');
});


test('network reports exclude in-memory data URLs',()=>{
 const recorder=createRequestRecorder('https://site.test/');
 recorder.record('Network.requestWillBeSent',{requestId:'memory',request:{url:'data:text/plain,private-content'},type:'Document'},'iframe','scroll');
 recorder.record('Network.loadingFinished',{requestId:'memory',encodedDataLength:500},'iframe','scroll');
 assert.deepEqual(recorder.requests,[]);
});
