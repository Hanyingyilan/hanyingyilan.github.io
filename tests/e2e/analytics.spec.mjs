import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const baseHTML=readFileSync('index.html','utf8');
test('Search Console-only site makes no analytics requests, including navigation away',async({page})=>{
 const requests=[];page.on('request',r=>{if(r.url().includes('cloudflareinsights.com'))requests.push(r.url())});
 await page.goto('/?synthetic=not-collected#six-welfare');
 await page.locator('#selall').click();await page.locator('#mon').fill('7');
 await page.goto('about:blank');expect(requests).toEqual([]);
 expect(baseHTML).not.toContain('cloudflareinsights');
});
