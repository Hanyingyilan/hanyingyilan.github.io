import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate} from '../scripts/build.mjs';
const data=JSON.parse(readFileSync('content/policies.json'));
test('23 policies have valid unique identities',()=>{validate(data);assert.equal(data.PL.length,23)});
test('duplicate IDs are rejected',()=>{const d=structuredClone(data);d.PL.push(d.PL[0]);assert.throws(()=>validate(d),/duplicate/)});
test('unknown categories are rejected',()=>{const d=structuredClone(data);d.PL[0].p='missing';assert.throws(()=>validate(d),/category/)});
