import {test,expect} from '@playwright/test';
test('all policy citations and review limitations remain readable without scripts',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:8000/');
 const cards=page.locator('#policy-overview article');await expect(cards).toHaveCount(23);
 for(const c of await cards.all()){await expect(c.locator('.citation')).toContainText('候選人提案');await expect(c.locator('.citation a').first()).toHaveAttribute('href',/^#source-/);}
 await expect(page.locator('#source-current-elder')).toContainText('現行公告');await expect(page.locator('#policy-ct-play .citation')).toContainText('待查證');await context.close();
});
