const { test, expect } = require('@playwright/test');

// create playwright test for login demo webshop with valid credentials
test('Login Page with Valid Credentials', async ({ page }) => {
  await page.goto('https://demowebshop.tricentis.com/login');
  await page.fill('#Email', 'silvi@gmail.com');
  await page.fill('#Password', '1234567890');
  await page.click('input[value="Log in"]');
  await expect(page.locator('a.account').first()).toBeVisible();  // ← baris 9, bukan 28
});

// create playwright test for login demo webshop with invalid credentials
test('Login Page with Invalid Credentials', async ({ page }) => {
  await page.goto('https://demowebshop.tricentis.com/login');
  await page.fill('#Email', 'xyzabc99999@random.com');
  await page.fill('#Password', '1234567890');
  await page.click('input[value="Log in"]');
  await expect(page.locator('.validation-summary-errors')).toBeVisible();
});


// //  create playwright test for search product demo webshop with valid keyword
// test('Search Product with Valid Keyword', async ({ page }) => {
//   await page.goto('https://demowebshop.tricentis.com/');
//   await page.fill('#small-searchterms', 'laptop');
//   await page.click('input[value="Search"]');
//   await expect(page.locator('.product-item')).toBeVisible();
// });

// create playwright test for search product demo webshop with invalid keyword
// test('Search Product with Invalid Keyword', async ({ page }) => {
//   await page.goto('https://demowebshop.tricentis.com/');
//   await page.fill('#small-searchterms', 'xyzabc99999');
//   await page.click('input[value="Search"]');
//   await expect(page.locator('.no-result')).toBeVisible();
// });

//create playwright test for add product to cart demo webshop with valid product
// test('Add Product to Cart with Valid Product', async ({ page }) => {
//   await page.goto('https://demowebshop.tricentis.com/');
//   await page.click('.product-item .product-title a'); // klik produk pertama
//   await page.click('input[value="Add to cart"]');
//   await expect(page.locator('.cart-qty')).toHaveText('1'); // pastikan qty di cart bertambah
// });

// create playwright test for add product to cart demo webshop with invalid product
// test('Add Product to Cart with Invalid Product', async ({ page }) => {
//   await page.goto('https://demowebshop.tricentis.com/');
//   await page.click('.product-item .product-title a'); // klik produk pertama
//   await page.fill('#product_attribute_1', 'invalid'); // isi atribut produk dengan nilai invalid
//   await page.click('input[value="Add to cart"]');
//   await expect(page.locator('.message-error')).toBeVisible(); // pastikan muncul pesan error
// });
