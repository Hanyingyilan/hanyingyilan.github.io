import {test,expect} from '@playwright/test';
test('alternate photos load only when selected and every photo decodes',async({page})=>{
 const hero='/assets/images/portraits/han-ying-windblown.jpg';
 const alternates=[];page.on('request',r=>{const path=new URL(r.url()).pathname;if(path.startsWith('/assets/images/portraits/')&&path.endsWith('.jpg')&&path!==hero)alternates.push(path)});
 await page.route(/^https:\/\//,r=>r.abort());await page.goto('/');
 // Advance beyond the old load + 1500ms prefetch without a wall-clock sleep.
 await page.clock.install();await page.clock.fastForward(5000);expect(alternates).toEqual([]);
 await expect(page.locator('#portraitImg')).toHaveAttribute('src',hero.slice(1));
 const photo=page.locator('#portraitImg2');
 for(let i=0;i<12;i++){
  await page.locator('#swapPhoto').click();
  await expect(photo).toBeVisible();
  await expect(photo).toHaveAttribute('src',/^assets\/images\/portraits\/han-ying-[a-z-]+\.jpg$/);
  await photo.evaluate(img=>img.decode());
  expect(await photo.evaluate(img=>img.naturalWidth)).toBeGreaterThan(0);
  await expect.poll(()=>alternates.length).toBe(i+1);
 }
 expect(new Set(alternates).size).toBe(12);
 await page.locator('#swapPhoto').click();await expect(photo).toBeHidden();
 await expect(page.locator('video')).toHaveAttribute('preload','none');await expect(page.locator('.vcard.fb .vlink')).toHaveCount(11);
});

test('optional decoration does not move the hero after initial render',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.route(/^https:\/\//,r=>r.abort());
 let release;const gate=new Promise(resolve=>{release=resolve});
 await page.route('**/assets/js/optional.js',async r=>{await gate;await r.continue()});
 const navigation=page.goto('/');
 await expect(page.locator('.lead')).toBeVisible();
 const before=await page.locator('.lead').boundingBox();
 release();await navigation;
 await expect(page.locator('#heroLetters .ch')).toHaveCount(8);
 const after=await page.locator('.lead').boundingBox();
 expect(Math.abs(after.y-before.y)).toBeLessThan(1);
});
