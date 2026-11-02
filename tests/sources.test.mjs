import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {validateSources} from '../src/sources.mjs';
const sources=JSON.parse(readFileSync('content/sources.json'));const data=JSON.parse(readFileSync('content/policies.json'));
test('unknown source references and unsafe citation links are rejected',()=>{
 const bad=structuredClone(data);bad.PL[0].sourceRefs=['missing'];assert.throws(()=>validateSources(bad,sources),/unknown source/);
 const unsafe=structuredClone(sources);unsafe.campaign.url='javascript:alert(1)';assert.throws(()=>validateSources(data,unsafe),/unsafe/);
});
test('enhanced citation HTML also appears in the initial response',()=>{
 const context={window:{}};vm.runInNewContext(readFileSync('assets/js/policies.js','utf8'),context);
 const html=readFileSync('index.html','utf8');assert.equal(Object.keys(context.window.POLICY_CITATIONS).length,23);
 for(const citation of Object.values(context.window.POLICY_CITATIONS))assert.ok(html.includes(citation));
});

test('public video metadata contains no undated view counts',()=>{assert.doesNotMatch(readFileSync('index.html','utf8'),/[0-9,]+ 次觀看/)});

test('review statuses and calendar dates are validated for sources and policies',()=>{
 for(const date of ['2026-02-29','2026-04-31','2026-13-01','2026-00-10','bad',undefined]){
  const source=structuredClone(sources);source.campaign.reviewed=date;
  assert.throws(()=>validateSources(data,source),/date/);
  const policy=structuredClone(data);policy.PL[0].reviewed=date;
  assert.throws(()=>validateSources(policy,sources),/date/);
 }
 const source=structuredClone(sources);source.campaign.verification='invented';assert.throws(()=>validateSources(data,source),/verification/);
 for(const entity of ['source','policy']){
  const ss=structuredClone(sources),dd=structuredClone(data),record=entity==='source'?ss.campaign:dd.PL[0];
  record.verification='reviewed';record.reviewed=null;assert.throws(()=>validateSources(dd,ss),/review date required/);
 }
 const valid=structuredClone(data);valid.PL[0].verification='reviewed';valid.PL[0].reviewed='2024-02-29';validateSources(valid,sources);
});

test('status enums reject inherited names and partial policy reviews keep dates empty',()=>{
 for(const status of ['toString','__proto__','unknown']){
  const ss=structuredClone(sources);ss.campaign.status=status;assert.throws(()=>validateSources(data,ss),/source/);
  const dd=structuredClone(data);dd.PL[0].status=status;assert.throws(()=>validateSources(dd,sources),/status/);
 }
 const dd=structuredClone(data);dd.PL[0].verification='partial';dd.PL[0].reviewed='2026-11-01';assert.throws(()=>validateSources(dd,sources),/complete policy review/);
});
