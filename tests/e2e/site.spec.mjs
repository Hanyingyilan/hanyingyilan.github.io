import {test,expect} from '@playwright/test';
test('categories, details, filters and deep links',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('#tiles .tile')).toHaveCount(6);
 for(let i=0;i<6;i++){await page.locator('#tiles .tile').nth(i).click();await expect(page.locator('#panel .pcard').first()).toBeVisible();}
 await page.locator('#panel [data-act=more]').first().click();await expect(page.locator('#panel .pcard ul').first()).toBeVisible();
 await page.locator('#selnone').click();await expect(page.locator('#cards .pcard')).toHaveCount(0);
 await page.locator('#selall').click();await expect(page.locator('#cards .pcard')).toHaveCount(19);
 await page.goto('/#six-welfare');await expect(page.locator('#panel')).toContainText('生育');expect(errors).toEqual([]);
});
for(const mode of ['no-js','blocked-core','blocked-optional','canvas-null'])test(`readable content with ${mode}`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:mode!=='no-js'});const page=await context.newPage();
 if(mode==='blocked-core')await page.route('**/assets/js/{app,policies}.js',r=>r.abort());
 if(mode==='blocked-optional')await page.route('**/assets/js/optional.js',r=>r.abort());
 if(mode==='canvas-null')await page.addInitScript(()=>HTMLCanvasElement.prototype.getContext=()=>null);
 await page.goto('http://127.0.0.1:8000/#six-welfare');
 await expect(page.locator('#policy-overview article')).toHaveCount(23);await expect(page.locator('h1')).toHaveText('韓瑩政見一覽');
 if(['blocked-optional','canvas-null'].includes(mode)){await expect(page.locator('#tiles .tile')).toHaveCount(6);await page.locator('#tiles .tile').first().click();await expect(page.locator('#panel')).toContainText('國際');await expect(page.locator('#tot')).toHaveText('95,200');}
 await context.close();
});
test('URL variants and shares use the canonical root',async({page})=>{
 for(const path of ['/','/index.html','/?v=6']){await page.goto(path);await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://hanyingyilan.github.io/');const url=new URL(await page.locator('#lineAll').getAttribute('href'));expect(url.searchParams.get('url')).toBe('https://hanyingyilan.github.io/');}
 await page.goto('/?v=6#six-welfare');const url=new URL(await page.locator('#panel .line').getAttribute('href'));expect(url.searchParams.get('url')).toBe('https://hanyingyilan.github.io/#six-welfare');
});
test('calculator boundaries and latest animated result',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');await expect(page.locator('#tot')).toHaveText('95,200');
 await page.evaluate(()=>document.querySelectorAll('.stepper button[data-d="-1"]').forEach(b=>{for(let i=0;i<8;i++)b.click()}));await expect(page.locator('#tot')).toHaveText('0');
 for(const key of ['baby','e1','e2','e3','e4'])await expect(page.locator('#o-'+key)).toHaveText('0');
 await page.evaluate(()=>document.querySelectorAll('.stepper button[data-d="1"]').forEach(b=>{for(let i=0;i<8;i++)b.click()}));await expect(page.locator('#tot')).toHaveText('723,200');
 for(const key of ['baby','e1','e2','e3','e4'])await expect(page.locator('#o-'+key)).toHaveText(key==='baby'?'4':'6');
 await page.locator('#mon').fill('0');await expect(page.locator('#tot')).toHaveText('435,200');
 await page.locator('#mon').fill('24');await expect(page.locator('#calc-status')).toHaveText('提案情境合計 723,200 元');
});
