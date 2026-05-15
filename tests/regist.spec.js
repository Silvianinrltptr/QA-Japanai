import { test, expect } from '@playwright/test';

test.describe('Register Feature', () => {

  test('Register New Account - Valid', async ({ page }) => {

    await page.goto('https://demowebshop.tricentis.com/register');

    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    await page.screenshot({ path: 'before-register.png', fullPage: true });

    await page.click('input[value="Register"]');

    await page.screenshot({ path: 'after-register.png', fullPage: true });

    await expect(page.getByText('Your registration completed')).toBeVisible();
  });

  test('Register New Account - Invalid', async ({ page }) => {

    await page.goto('https://demowebshop.tricentis.com/register');

    await page.fill('#FirstName', '');
    await page.fill('#LastName', '');
    await page.fill('#Email', '');
    await page.fill('#Password', '123');
    await page.fill('#ConfirmPassword', '123');

    await page.click('input[value="Register"]');

    await page.screenshot({ path: 'register-error.png', fullPage: true });

    await expect(page.getByText('First name is required')).toBeVisible();
  });

});