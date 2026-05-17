import { test, expect } from '@playwright/test';

// Cara jalankan:
// Semua browser:  npx playwright test AI-QA/tests/regist.spec.js --headed
// 1 browser saja: npx playwright test AI-QA/tests/regist.spec.js --headed --project=chromium
// Urut/tidak paralel: npx playwright test AI-QA/tests/regist.spec.js --headed --project=chromium --workers=1

// ─────────────────────────────────────────────
// 🛠️ HELPER: Disable HTML5 native browser validation
// ─────────────────────────────────────────────
async function disableHTML5Validation(page) {
  await page.evaluate(() => {
    const form = document.querySelector('form');
    if (form) form.setAttribute('novalidate', 'true');
    document.querySelectorAll('input[required], input[type="email"]').forEach(el => {
      el.removeAttribute('required');
      el.removeAttribute('type');
    });
  });
}

// ─────────────────────────────────────────────
// 🛠️ HELPER: Tunggu navigasi / response selesai setelah submit
// ─────────────────────────────────────────────
async function submitAndWait(page) {
  await Promise.all([
    page.waitForLoadState('networkidle'), // tunggu semua request selesai
    page.click('input[value="Register"]'),
  ]);
}

test.describe('Register Feature - QA Automation', () => {

  // ─────────────────────────────────────────────
  // ✅ POSITIVE TEST CASE
  // ─────────────────────────────────────────────

  // REG-001: Register Success (Valid Data)
  test('REG-001 - Register Success (Valid Data)', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle', // tunggu halaman benar-benar selesai load
    });

    console.log('🧾 Step 2: Generate unique email');
    const email = `silvi_${Date.now()}@test.com`;
    console.log(`📧 Email used: ${email}`);

    console.log('✍️ Step 3: Fill registration form');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', email);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('📸 Step 4: Screenshot before submit');
    await page.screenshot({ path: 'screenshots/reg_before_submit.png', fullPage: true });

    console.log('🚀 Step 5: Click register & tunggu response selesai');
    await submitAndWait(page);

    console.log('📸 Step 6: Screenshot after submit');
    await page.screenshot({ path: 'screenshots/reg_after_submit.png', fullPage: true });

    console.log('✅ Step 7: Validate success message');
    // Tambah timeout 10 detik untuk Firefox yang lebih lambat
    await expect(page.getByText('Your registration completed')).toBeVisible({ timeout: 10000 });

    console.log('🎉 TEST PASSED: Register Success');
  });


  // ─────────────────────────────────────────────
  // ❌ NEGATIVE TEST CASES
  // ─────────────────────────────────────────────

  // REG-002: Register Invalid (Empty Fields)
test('REG-002 - Register Invalid (Empty Fields)', async ({ page }) => {

  console.log('🚀 Step 1: Open register page');
  await page.goto('https://demowebshop.tricentis.com/register', {
    waitUntil: 'networkidle',
  });

  console.log('🔧 Step 2: Disable HTML5 native validation');
  await disableHTML5Validation(page);

  console.log('🚀 Step 3: Submit form kosong');
  await page.click('input[value="Register"]');

  // ✅ TUNGGU DULU 3 DETIK biar DOM update
  await page.waitForTimeout(3000);

  // 🔍 DEBUG: Print semua class yang ada di halaman setelah submit
  const allClasses = await page.evaluate(() => {
    return [...document.querySelectorAll('[class]')]
      .map(el => el.className)
      .filter(c => c.toLowerCase().includes('error') || c.toLowerCase().includes('valid'))
      .join('\n');
  });
  console.log('🧪 Classes found:', allClasses);

  // 🔍 DEBUG: Print inner text semua elemen yang kemungkinan error
  const errorTexts = await page.evaluate(() => {
    return [...document.querySelectorAll('span, div, li, p')]
      .filter(el => el.innerText && el.innerText.trim().length > 0)
      .filter(el => 
        el.className.toLowerCase().includes('error') || 
        el.className.toLowerCase().includes('valid') ||
        el.innerText.toLowerCase().includes('required') ||
        el.innerText.toLowerCase().includes('field')
      )
      .map(el => `[${el.className}]: ${el.innerText.trim()}`)
      .join('\n');
  });
  console.log('🧪 Error elements found:\n', errorTexts);

  // Screenshot untuk lihat visual
  await page.screenshot({ path: 'screenshots/reg_debug_empty.png', fullPage: true });

  console.log('⏸️ Cek terminal output di atas, lalu lihat screenshot reg_debug_empty.png');
});

  // REG-003: Register Invalid Email Format
  test('REG-003 - Register Invalid Email Format', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    console.log('✍️ Step 2: Fill form with invalid email format');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', 'invalid-email');
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🔧 Step 3: Disable HTML5 email validation');
    await disableHTML5Validation(page);

    console.log('🚀 Step 4: Submit & tunggu response');
    await submitAndWait(page);

    console.log('📸 Step 5: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_invalid_email.png', fullPage: true });

    console.log('🔍 Step 6: Validate error message');
    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible({ timeout: 10000 });

    console.log('❌ TEST PASSED: Invalid email format detected');
  });

  // REG-004: Password Mismatch
  test('REG-004 - Password Mismatch', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    console.log('✍️ Step 2: Fill form with mismatched passwords');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Wrong1234!');

    console.log('🚀 Step 3: Submit & tunggu response');
    await submitAndWait(page);

    console.log('📸 Step 4: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_password_mismatch.png', fullPage: true });

    console.log('🔍 Step 5: Validate mismatch error');
    await expect(
      page.getByText('The password and confirmation password do not match')
    ).toBeVisible({ timeout: 10000 });

    console.log('❌ TEST PASSED: Password mismatch detected');
  });

  // REG-005: Password Too Short
  test('REG-005 - Password Too Short', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    console.log('✍️ Step 2: Fill form with short password (< 6 chars)');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', '123');
    await page.fill('#ConfirmPassword', '123');

    console.log('🚀 Step 3: Submit & tunggu response');
    await submitAndWait(page);

    console.log('📸 Step 4: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_short_password.png', fullPage: true });

    console.log('🔍 Step 5: Validate password length error');
    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible({ timeout: 10000 });

    console.log('❌ TEST PASSED: Short password rejected');
  });

  // REG-006: First Name Empty
  test('REG-006 - First Name Empty', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    console.log('✍️ Step 2: Fill form tanpa First Name');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🔧 Step 3: Disable HTML5 native validation');
    await disableHTML5Validation(page);

    console.log('🚀 Step 4: Submit & tunggu response');
    await submitAndWait(page);

    console.log('📸 Step 5: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_no_firstname.png', fullPage: true });

    console.log('🔍 Step 6: Validate First Name required error');
    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible({ timeout: 10000 });

    console.log('❌ TEST PASSED: First Name required validation triggered');
  });

  // REG-007: Last Name Empty
  test('REG-007 - Last Name Empty', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    console.log('✍️ Step 2: Fill form tanpa Last Name');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🔧 Step 3: Disable HTML5 native validation');
    await disableHTML5Validation(page);

    console.log('🚀 Step 4: Submit & tunggu response');
    await submitAndWait(page);

    console.log('📸 Step 5: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_no_lastname.png', fullPage: true });

    console.log('🔍 Step 6: Validate Last Name required error');
    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible({ timeout: 10000 });

    console.log('❌ TEST PASSED: Last Name required validation triggered');
  });

  // REG-008: Duplicate Email
  test('REG-008 - Duplicate Email Already Registered', async ({ page }) => {

    console.log('🚀 Step 1: Register pertama dengan email unik');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    const duplicateEmail = `silvi_dup_${Date.now()}@test.com`;

    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', duplicateEmail);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');
    await submitAndWait(page);

    // Pastikan registrasi pertama berhasil sebelum lanjut
    await expect(page.getByText('Your registration completed')).toBeVisible({ timeout: 10000 });

    console.log('🔁 Step 2: Coba register dengan email yang sama');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', duplicateEmail);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');
    await submitAndWait(page);

    console.log('📸 Step 3: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_duplicate_email.png', fullPage: true });

    console.log('🔍 Step 4: Validate duplicate email error');
    await expect(
      page.locator('.validation-summary-errors, .field-validation-error')
    ).toBeVisible({ timeout: 10000 });

    console.log('❌ TEST PASSED: Duplicate email rejected');
  });

  // REG-009: Email With Spaces
  test('REG-009 - Email With Spaces', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    console.log('🔧 Step 2: Disable HTML5 validation SEBELUM isi field');
    await disableHTML5Validation(page);

    console.log('✍️ Step 3: Fill email dengan spasi');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', 'silvi test@test.com');
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🚀 Step 4: Submit & tunggu response');
    await submitAndWait(page);

    console.log('📸 Step 5: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_email_spaces.png', fullPage: true });

    console.log('🔍 Step 6: Validate email format error');
    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible({ timeout: 10000 });

    console.log('❌ TEST PASSED: Email with spaces rejected');
  });

  // REG-010: Confirm Password Empty
  test('REG-010 - Confirm Password Empty', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    console.log('✍️ Step 2: Fill form tanpa Confirm Password');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');

    console.log('🔧 Step 3: Disable HTML5 native validation');
    await disableHTML5Validation(page);

    console.log('🚀 Step 4: Submit & tunggu response');
    await submitAndWait(page);

    console.log('📸 Step 5: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_no_confirm_password.png', fullPage: true });

    console.log('🔍 Step 6: Validate confirm password error');
    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible({ timeout: 10000 });

    console.log('❌ TEST PASSED: Empty Confirm Password validation triggered');
  });

  // REG-011: XSS Injection in Name Field
  test('REG-011 - XSS Injection in Name Field (Security)', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    const xssPayload = '<script>alert("XSS")</script>';
    let alertFired = false;

    page.on('dialog', async (dialog) => {
      alertFired = true;
      await dialog.dismiss();
    });

    console.log('✍️ Step 2: Fill First Name dengan XSS payload');
    await page.fill('#FirstName', xssPayload);
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🚀 Step 3: Submit & tunggu response');
    await submitAndWait(page);

    console.log('📸 Step 4: Screenshot result');
    await page.screenshot({ path: 'screenshots/reg_xss_injection.png', fullPage: true });

    console.log('🔍 Step 5: Validate XSS was NOT executed');
    expect(alertFired).toBe(false);

    console.log('🛡️ TEST PASSED: XSS payload not executed — input is sanitized');
  });

  // REG-012: SQL Injection in Email Field
  test('REG-012 - SQL Injection in Email Field (Security)', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    const sqlPayload = `' OR '1'='1' --`;

    console.log('🔧 Step 2: Disable HTML5 validation SEBELUM isi field');
    await disableHTML5Validation(page);

    console.log('✍️ Step 3: Fill Email dengan SQL injection payload');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', sqlPayload);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🚀 Step 4: Submit & tunggu response');
    await submitAndWait(page);

    console.log('📸 Step 5: Screenshot result');
    await page.screenshot({ path: 'screenshots/reg_sql_injection.png', fullPage: true });

    console.log('🔍 Step 6: Validate tidak ada DB/SQL error di halaman');
    const pageContent = await page.content();
    const hasSqlError =
      pageContent.toLowerCase().includes('sql') ||
      pageContent.toLowerCase().includes('syntax error') ||
      pageContent.toLowerCase().includes('unclosed quotation');

    expect(hasSqlError).toBe(false);

    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible({ timeout: 10000 });

    console.log('🛡️ TEST PASSED: SQL injection tidak expose DB error');
  });

  // REG-013: Very Long Input (Boundary Test)
  test('REG-013 - Very Long Input in Name Fields (Boundary)', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register', {
      waitUntil: 'networkidle',
    });

    const longString = 'A'.repeat(300);

    console.log('✍️ Step 2: Fill First & Last Name dengan 300 karakter');
    await page.fill('#FirstName', longString);
    await page.fill('#LastName', longString);
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🚀 Step 3: Submit & tunggu response');
    await submitAndWait(page);

    console.log('📸 Step 4: Screenshot result');
    await page.screenshot({ path: 'screenshots/reg_long_input.png', fullPage: true });

    console.log('🔍 Step 5: Validate tidak ada server crash / 500 error');
    const pageContent = await page.content();
    const hasServerError =
      pageContent.includes('500') ||
      pageContent.toLowerCase().includes('server error') ||
      pageContent.toLowerCase().includes('exception');

    expect(hasServerError).toBe(false);

    console.log('⚠️ TEST PASSED: Long input handled gracefully — no server crash');
  });

});