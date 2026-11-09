import {test,expect} from '@playwright/test';
const keys=['intl','traffic','city','tour','resil','welfare'];
test.beforeEach(async({page})=>{await page.route(/https:\/\/(?!127\.0\.0\.1)/,route=>route.abort());});
test('static category navigation and citations work without JavaScript on mobile',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:700}});
 const page=await context.newPage();
 for(const key of keys){
  const response=await page.goto(`/policies/${key}.html`);expect(response.status()).toBe(200);
  await expect(page.locator('h1')).toContainText('韓瑩');await expect(page.locator('.category-nav a')).toHaveCount(6);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.reload();await expect(page.locator('h1')).toBeVisible();
 }
 await page.getByRole('link',{name:'回到完整政見總覽'}).click();
 await expect(page.locator('#policy-overview article')).toHaveCount(23);await context.close();
});
test('all exposed filters explain and preserve the 19/23 distinction',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'全選身分',exact:true}).click();
 await expect(page.locator('#cards article')).toHaveCount(19);
 await expect(page.locator('#me')).toContainText('未對應這些身分');
 await expect(page.locator('#policy-overview article')).toHaveCount(23);
});
test('failed optional stamp cannot interrupt category navigation or calculator',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.evaluate(()=>{window.policyStamp=()=>{throw Error('injected stamp failure')};});
 await page.evaluate(()=>{location.hash='#six-welfare'});
 await expect(page.locator('#panel')).toContainText('新社福');
 await expect(page.locator('#six')).toBeInViewport();
 await page.locator('[data-k=baby][data-d="1"]').click();await expect(page.locator('#tot')).toHaveText('187,200');expect(errors).toEqual([]);
});
for(const timezoneId of ['Asia/Taipei','America/Los_Angeles'])test(`countdown follows Taiwan midnight in ${timezoneId}`,async({browser})=>{
 const context=await browser.newContext({timezoneId});const page=await context.newPage();
 await page.route(/https:\/\//,route=>route.abort());
 await page.clock.install({time:new Date('2026-11-27T23:59:59+08:00')});await page.goto('/');
 await expect(page.locator('#days')).toHaveText('1');
 await page.clock.fastForward(1100);await expect(page.locator('#dtop')).toHaveText('今天是投票日');
 await expect(page.locator('#dtk')).toBeHidden();
 await page.clock.fastForward(86400000);await expect(page.locator('#dtop')).toHaveText('11/28 投票日已過');
 await context.close();
});

test('throwing Canvas API leaves later optional initialization and core usable',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=()=>{throw Error('canvas denied')};});
 await page.goto('/#six-welfare');
 await expect(page.locator('#stamps .stamp')).toHaveCount(6);
 await expect(page.locator('#pcount')).toHaveText('1/6');
 await page.locator('#gameOpen').click();await expect(page.locator('#toast')).toContainText('無法執行遊戲');
 await page.locator('#mkcard').click();await expect(page.locator('#toast')).toContainText('無法製作圖片');
 await page.locator('[data-k=baby][data-d="1"]').click();await expect(page.locator('#tot')).toHaveText('187,200');
 expect(errors).toEqual([]);
});
test('unavailable animation does not break category or ballot interactions',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.addInitScript(()=>{Element.prototype.animate=()=>{throw Error('animation denied')};});
 await page.goto('/');
 for(const key of keys)await page.locator(`[data-category=${key}]`).click();
 await expect(page.locator('#pcount')).toHaveText('6/6');
 await page.locator('#ballot').click();await expect(page.locator('#toast')).toContainText('韓瑩');
 await expect(page.locator('.cf,.kit')).toHaveCount(0);expect(errors).toEqual([]);
});
test('native share rejection leaves download, closing and calculator available',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
  Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw Error('share unavailable')}});
 });
 await page.goto('/');await page.locator('#mkcard').click();await page.locator('#cShare').click();
 await expect(page.locator('#cardStatus')).toContainText('不能直接分享');
 await expect(page.locator('#cDl')).toHaveAttribute('download','韓瑩政見卡.png');
 await page.locator('#cClose').click();await page.locator('[data-k=baby][data-d="1"]').click();
 await expect(page.locator('#tot')).toHaveText('187,200');expect(errors).toEqual([]);
});
test('countdown corrects a suspended page when visible again',async({page})=>{
 await page.clock.install({time:new Date('2026-11-27T12:00:00+08:00')});await page.goto('/');
 await expect(page.locator('#days')).toHaveText('1');
 await page.clock.setSystemTime(new Date('2026-11-29T12:00:00+08:00'));
 await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
 await expect(page.locator('#dtop')).toHaveText('11/28 投票日已過');
});
test('post-election page keeps its historical context and policy links',async({page})=>{
 await page.clock.install({time:new Date('2026-11-29T00:00:00+08:00')});await page.goto('/');
 await expect(page.locator('#election-context')).toContainText('歷史政見資料');
 await expect(page.locator('#election-context')).toContainText('不代表已實施');
 await expect(page.locator('#policy-overview article')).toHaveCount(23);
 await expect(page.locator('#policy-overview a[href="policies/welfare.html"]')).toHaveCount(1);
});
test('local video plays anonymously and loads optional text subtitles',async({page})=>{
 await page.goto('/');
 const video=page.locator('video');
 await video.evaluate(v=>{v.muted=true;v.textTracks[0].mode='showing';v.load();});
 await expect.poll(()=>video.evaluate(v=>v.readyState)).toBeGreaterThanOrEqual(1);
 expect(await video.evaluate(v=>v.duration)).toBeCloseTo(47.204,2);
 await video.evaluate(v=>v.play());
 await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(0);
 await expect.poll(()=>video.evaluate(v=>v.textTracks[0].cues?.length||0)).toBe(44);
 await video.evaluate(v=>v.pause());
});
test('video transcript is accessible without JavaScript and labels review limits',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.route(/https:\/\//,r=>r.abort());await page.goto('/');
 await page.getByText('閱讀〈為家鄉獻出勇氣〉字幕文字版',{exact:true}).click();
 await expect(page.locator('.video-transcript')).toContainText('尚待完整音訊人工複核');
 await expect(page.locator('.video-transcript li')).toHaveCount(44);
 await expect(page.locator('.video-transcript')).toContainText('謝謝大家');
 await context.close();
});
