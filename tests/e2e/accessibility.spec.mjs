import {test,expect} from '@playwright/test';
test('card modal contains focus, inerts background and restores opener',async({page})=>{
 await page.goto('/');await page.locator('#mkcard').click();const modal=page.getByRole('dialog');await expect(modal).toBeVisible();
 await page.locator('#cClose').focus();await page.keyboard.press('Tab');await expect(page.locator('#cShare')).toBeFocused();
 await page.keyboard.press('Shift+Tab');await expect(page.locator('#cClose')).toBeFocused();
 await page.locator('#theme').evaluate(e=>e.focus());expect(await page.evaluate(()=>document.activeElement.closest('#cardModal')!==null)).toBe(true);
 await page.keyboard.press('Escape');await expect(modal).toHaveCount(0);await expect(page.locator('#mkcard')).toBeFocused();
 await page.locator('#mkcard').click();await page.locator('#cClose').click();await expect(page.locator('#mkcard')).toBeFocused();
});
test('game does not consume Space on unrelated controls',async({page})=>{
 await page.goto('/');await page.locator('#gameOpen').click();
 for(const selector of ['#mon','#copyAll','#lineAll']){
  await page.locator(selector).focus();const canceled=await page.locator(selector).evaluate(e=>!e.dispatchEvent(new KeyboardEvent('keydown',{key:' ',code:'Space',bubbles:true,cancelable:true})));expect(canceled).toBe(false);
 }
 await page.locator('#gthrow').focus();await page.keyboard.press('Space');await expect(page.locator('#gmsg')).not.toBeEmpty();
});
test('skip navigation reaches main with visible focus and contextual controls',async({page})=>{
 await page.goto('/');await page.keyboard.press('Tab');const skip=page.getByRole('link',{name:'跳至主要內容'});await expect(skip).toBeFocused();await expect(skip).toBeVisible();await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();
 for(const group of ['65–79 歲長輩','80–89 歲長輩','90–99 歲長輩','百歲人瑞'])for(const action of ['增加','減少'])await expect(page.getByRole('button',{name:action+' '+group,exact:true})).toHaveCount(1);
});
test('large dark mobile dialog keeps controls reachable and targets below navigation',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.goto('/');await page.locator('#sizebtn').click();await page.locator('#theme').click();
 await page.getByRole('navigation').getByRole('link',{name:'來源',exact:true}).click();
 const target=await page.locator('#sources').boundingBox(),bar=await page.locator('.bar').boundingBox();expect(target.y).toBeGreaterThanOrEqual(bar.y+bar.height);
 await page.locator('#mkcard').click();await page.locator('#cClose').focus();await expect(page.locator('#cClose')).toBeInViewport();await page.screenshot({path:'test-results/modal-320-dark-large.png'});
 await page.keyboard.press('Escape');await expect(page.locator('#mkcard')).toBeFocused();
});
test('overlapping card generation leaves the newest dialog operable',async({page})=>{
 await page.addInitScript(()=>{window.cardCallbacks=[];HTMLCanvasElement.prototype.toBlob=function(callback){window.cardCallbacks.push(callback);};});
 await page.goto('/');await page.locator('#mkcard').click();await page.locator('#mkcard').click();
 await expect.poll(()=>page.evaluate(()=>window.cardCallbacks.length)).toBe(2);
 await page.evaluate(()=>{for(const callback of window.cardCallbacks)callback(new Blob(['image'],{type:'image/png'}));});
 await expect(page.getByRole('dialog')).toHaveCount(1);
 await page.locator('#cShare').click();await expect(page.locator('#cardStatus')).not.toBeEmpty();
 await page.locator('#cClose').click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('#mkcard')).toBeFocused();
});

test('filter and category keyboard activation preserves buttons, focus and Tab order',async({page})=>{
 await page.goto('/');
 for(const selector of ['#pick button','#tiles button']){
  const buttons=page.locator(selector),first=buttons.first();
  await first.evaluate(e=>{window.originalControl=e});
  await first.focus();
  for(const key of ['Enter','Space','Enter','Space']){
   await page.keyboard.press(key);await expect(first).toBeFocused();
   expect(await first.evaluate(e=>e===window.originalControl)).toBe(true);
  }
  await page.keyboard.press('Tab');await expect(buttons.nth(1)).toBeFocused();
  await page.keyboard.press('Space');await expect(buttons.nth(1)).toBeFocused();
  await page.keyboard.press('Shift+Tab');await expect(first).toBeFocused();
 }
 await page.locator('#selall').focus();await page.keyboard.press('Enter');await expect(page.locator('#selall')).toBeFocused();
 await expect(page.locator('#pick [aria-pressed="true"]')).toHaveCount(4);await expect(page.locator('#cards article')).toHaveCount(19);
 await page.locator('#selnone').focus();await page.keyboard.press('Space');await expect(page.locator('#selnone')).toBeFocused();
 await expect(page.locator('#pick [aria-pressed="true"]')).toHaveCount(0);await expect(page.locator('#cards article')).toHaveCount(0);
});

test('cleaning comparison steps retain keyboard focus on repeated activation',async({page})=>{
 await page.goto('/');const buttons=page.locator('#steps button');await buttons.first().focus();
 for(const key of ['Enter','Space']){await page.keyboard.press(key);await expect(buttons.first()).toBeFocused();}
 await page.keyboard.press('Tab');await expect(buttons.nth(1)).toBeFocused();await page.keyboard.press('Enter');await expect(buttons.nth(1)).toBeFocused();
 await expect(buttons.nth(1)).toHaveAttribute('aria-pressed','true');
});

test('mobile cleaning illustration can be scrolled with the keyboard',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.goto('/');
 const road=page.getByRole('region',{name:'清運路線示意圖，可左右捲動'});
 await expect(road).toHaveAttribute('tabindex','0');await road.focus();
 const start=await road.evaluate(e=>e.scrollLeft);await page.keyboard.press('ArrowRight');
 await expect.poll(()=>road.evaluate(e=>e.scrollLeft)).toBeGreaterThan(start);
});

test('320px large text keeps eyebrow and category cards inside the viewport',async({page})=>{
 await page.setViewportSize({width:320,height:844});await page.goto('/');await page.locator('#sizebtn').click();
 for(const selector of ['.eyebrow','#panel .pcard','#cards .pcard','.vcard']){
  for(const element of await page.locator(selector).all()){
   const rect=await element.boundingBox();expect(rect.x).toBeGreaterThanOrEqual(0);expect(rect.x+rect.width).toBeLessThanOrEqual(320);
  }
 }
});

test('keyboard category activation keeps its focus indicator in view',async({page})=>{
 await page.setViewportSize({width:320,height:844});await page.goto('/');
 const button=page.locator('#tiles button').first();await button.focus();await page.keyboard.press('Enter');await expect(button).toBeInViewport();
});
