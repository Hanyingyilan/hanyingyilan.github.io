import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {renderAnalytics} from '../../src/analytics.mjs';
const production='https://hanyingyilan.github.io/';
const snippet=renderAnalytics({enabled:true,siteToken:'0'.repeat(32)},production);
const baseHTML=readFileSync('index.html','utf8');
async function fixture(page,url,script=snippet){
 await page.route('**/*',route=>{
  const request=route.request(),u=new URL(request.url());
  if(u.origin===new URL(url).origin){
   if(request.isNavigationRequest())return route.fulfill({contentType:'text/html',body:baseHTML.replace('</body>',script+'</body>')});
   if(u.pathname.startsWith('/assets/'))return route.fulfill({path:'.'+u.pathname});
  }
  return route.abort();
 });
}
test('disabled output makes no vendor requests, including navigation away',async({page})=>{
 const requests=[];page.on('request',r=>{if(r.url().includes('cloudflareinsights.com'))requests.push(r.url())});
 await page.goto('/?synthetic=not-collected#six-welfare');
 await page.locator('#selall').click();await page.locator('#mon').fill('7');
 await page.goto('about:blank');expect(requests).toEqual([]);
 expect(baseHTML).not.toContain('cloudflareinsights');
});
test('enabled loader refuses local and fork origins',async({page})=>{
 for(const url of ['http://127.0.0.1:8000/','https://shaoyuwa.github.io/']){
  await fixture(page,url);await page.goto(url);await expect(page.locator('#cloudflare-analytics-beacon')).toHaveCount(0);
  await page.unrouteAll();
 }
});
test('manual beacon initializes once; provider failure leaves core usable',async({page})=>{
 const requests=[];page.on('request',r=>{if(r.url().includes('cloudflareinsights.com'))requests.push(r.url())});
 await fixture(page,production,snippet+snippet);await page.goto(production);
 await expect(page.locator('#cloudflare-analytics-beacon')).toHaveCount(1);
 await expect(page.locator('#cloudflare-analytics-beacon')).toHaveAttribute('data-cf-beacon',JSON.stringify({token:'0'.repeat(32)}));
 await page.locator('#selall').click();await expect(page.locator('#cards article')).toHaveCount(19);
 await page.locator('#selnone').click();await expect(page.locator('#cards article')).toHaveCount(0);
 expect(requests).toEqual(['https://static.cloudflareinsights.com/beacon.min.js']);
});
