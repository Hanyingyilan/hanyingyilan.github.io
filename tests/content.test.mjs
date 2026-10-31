import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate,loadPolicies} from '../scripts/build.mjs';
const data=loadPolicies();
test('23 policies have valid unique identities',()=>{validate(data);assert.equal(data.PL.length,23)});
test('duplicate IDs are rejected',()=>{const d=structuredClone(data);d.PL.push(d.PL[0]);assert.throws(()=>validate(d),/duplicate/)});
test('unknown categories are rejected',()=>{const d=structuredClone(data);d.PL[0].p='missing';assert.throws(()=>validate(d),/category/)});
test('initial HTML includes all titles, details, attribution and policy anchors',()=>{
 const html=readFileSync('index.html','utf8');
 const escape=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 for(const p of data.PL){for(const text of [p.t,p.ref,...p.body])assert.ok(html.includes(escape(text)),`${p.id}: ${text}`);assert.equal(html.split(`id="policy-${p.id}"`).length,2)}
 assert.match(html,/<h1[^>]*>[^<]*韓瑩/);
});
test('unknown source classifications rejected',()=>{const d=structuredClone(data);d.PL[0].src='nonexistent-source';assert.throws(()=>validate(d),/source/)});
import vm from 'node:vm';
test('browser data exactly matches the policy source after shared rate resolution',()=>{const context={window:{}};vm.runInNewContext(readFileSync('assets/js/policies.js','utf8'),context);assert.deepEqual(JSON.parse(JSON.stringify(context.window.POLICY_DATA)),data)});
