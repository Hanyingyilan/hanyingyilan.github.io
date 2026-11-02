import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=f=>readFileSync(f,'utf8');
test('canonical and Open Graph use clean production root',()=>{const html=read('index.html');assert.equal((html.match(/rel="canonical"/g)||[]).length,1);assert.match(html,/<link rel="canonical" href="https:\/\/hanyingyilan.github.io\/">/);assert.match(html,/<meta property="og:url" content="https:\/\/hanyingyilan.github.io\/">/)});
