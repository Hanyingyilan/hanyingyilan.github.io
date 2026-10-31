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
