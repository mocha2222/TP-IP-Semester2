import { test, expect } from '@playwright/test';

/*
Challenge 1
Locked User
*/

test('locked user cannot login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  await page.getByRole('button', { name: /login/i }).click();

  await expect(
    page.locator('[data-test="error"]')
  ).toBeVisible();
});


/*
Challenge 2
Sort products Low → High
*/

test('sort products from low to high', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  await page.getByRole('button', { name: /login/i }).click();

  await page.locator('.product_sort_container')
    .selectOption('lohi');

  const firstPrice = await page
    .locator('.inventory_item_price')
    .first()
    .textContent();

  await expect(firstPrice).toContain('7.99');
});


/*
Challenge 3
Logout
*/

test('logout successfully', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  await page.getByRole('button', { name: /login/i }).click();

  await page.locator('#react-burger-menu-btn').click();

  await page.locator('#logout_sidebar_link').click();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
});