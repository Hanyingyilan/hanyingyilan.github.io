import test from 'node:test';
import assert from 'node:assert/strict';
import {renderAnalytics} from '../src/analytics.mjs';
const origin='https://hanyingyilan.github.io/';
test('analytics defaults to no loader and rejects invalid enabled configuration',()=>{
 for(const config of [undefined,null,{enabled:false,siteToken:null}])assert.equal(renderAnalytics(config,origin),'');
 for(const config of [{},{enabled:'false'},{enabled:true},{enabled:true,siteToken:null},{enabled:true,siteToken:'fake'},{enabled:true,siteToken:'<script>'}])assert.throws(()=>renderAnalytics(config,origin),/analytics/);
 const html=renderAnalytics({enabled:true,siteToken:'0'.repeat(32)},origin);assert.match(html,/data-cf-beacon/);assert.match(html,/https:\/\/static.cloudflareinsights.com\/beacon.min.js/);
});
