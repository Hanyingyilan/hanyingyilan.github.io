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
test('direct category stamps after optional initialization',async({page})=>{await page.goto('/#six-welfare');await expect(page.locator('#pcount')).toHaveText('1/6')});
test('unavailable Canvas explains both optional actions',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>HTMLCanvasElement.prototype.getContext=()=>null);await page.goto('/');await page.locator('#mkcard').click();await expect(page.locator('#toast')).toContainText('無法');await page.locator('#gameOpen').click();await expect(page.locator('#toast')).toContainText('無法');expect(errors).toEqual([]);
});
test('comparison, keyboard calculator, preferences, media and game',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 for(let i=0;i<3;i++){await page.locator('#steps button').nth(i).click();for(const id of ['tNew','tNow']){await page.locator('#'+id).click();await expect(page.locator('#'+id)).toHaveAttribute('aria-pressed','true');await expect(page.locator('#say')).not.toBeEmpty();}}
 const plus=page.getByRole('button',{name:'增加 65–79 歲長輩',exact:true});await plus.focus();await page.keyboard.press('Enter');await expect(page.locator('#o-e1')).toHaveText('2');await expect(page.locator('#calc-status')).toContainText('96,400');
 await page.locator('#mon').focus();await page.keyboard.press('Home');await expect(page.locator('#o-mon')).toHaveText('0');
 await page.locator('#sizebtn').click();await expect(page.locator('html')).toHaveClass(/big/);await page.locator('#theme').click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.locator('#theme').click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.locator('#swapPhoto').click();await expect(page.locator('#portraitImg2')).toBeVisible();
 await expect(page.locator('video')).toHaveAttribute('controls','');await expect(page.locator('.vcard.fb .vlink')).toHaveCount(11);
 await page.locator('#gameOpen').click();await expect(page.locator('#game')).toBeVisible();await page.locator('#gNow').click();await page.locator('#gthrow').click();await page.locator('#gameOpen').click();await expect(page.locator('#game')).toBeHidden();await page.locator('#gameOpen').click();await expect(page.locator('#gmsg')).toContainText('1 / 5');expect(errors).toEqual([]);
});
test('sharing success, fallback and generated image download',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async t=>{window.copiedText=t}}});Object.defineProperty(navigator,'canShare',{value:undefined});});await page.goto('/');
 await page.locator('#copyAll').click();await expect(page.locator('#copyMsg')).toHaveText('已複製連結');expect(await page.evaluate(()=>window.copiedText)).toBe('https://hanyingyilan.github.io/');
 await page.evaluate(()=>navigator.clipboard.writeText=async()=>{throw Error('denied')});await page.locator('#copyAll').click();await expect(page.locator('#copyMsg')).toContainText('請手動複製');await page.locator('#copy').click();await expect(page.locator('#copied')).toContainText('無法複製');
 await page.locator('#mkcard').click();await expect(page.locator('#cardModal')).toBeVisible();await expect(page.locator('#cShare')).toBeFocused();await page.locator('#cShare').click();await expect(page.locator('#toast')).toContainText('不能直接分享');
 const download=page.waitForEvent('download');await page.locator('#cDl').click();expect((await download).suggestedFilename()).toBe('韓瑩政見卡.png');await page.keyboard.press('Escape');await expect(page.locator('#cardModal')).toHaveCount(0);expect(errors).toEqual([]);
});
for(const width of [320,390,1280])test(`responsive visual ${width}px and blocked third parties`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.route(/https:\/\/(fonts\.|www\.facebook\.com)/,r=>r.abort());await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('unavailable')};Storage.prototype.setItem=()=>{throw Error('unavailable')};Storage.prototype.removeItem=()=>{throw Error('unavailable')};});await page.goto('/');await expect(page.locator('#policy-overview article')).toHaveCount(23);await expect(page.locator('#tiles .tile')).toHaveCount(6);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:`test-results/site-${width}.png`,fullPage:true});
 if(width===1280){await page.evaluate(()=>document.documentElement.style.zoom='2');await expect(page.locator('h1')).toBeVisible();await page.screenshot({path:'test-results/site-200-percent.png',fullPage:true});}
});
