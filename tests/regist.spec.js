import { test, expect } from '@playwright/test';
//npx playwright test AI-QA/tests/regist.spec.js --headed
test.describe('Register Feature - QA Automation', () => {

  // ─────────────────────────────────────────────
  // ✅ POSITIVE TEST CASE
  // ─────────────────────────────────────────────

  // REG-001: Register Success (Valid Data)
  test('REG-001 - Register Success (Valid Data)', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

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

    console.log('🚀 Step 5: Click register button');
    await page.click('input[value="Register"]');

    console.log('📸 Step 6: Screenshot after submit');
    await page.screenshot({ path: 'screenshots/reg_after_submit.png', fullPage: true });

    console.log('✅ Step 7: Validate success message');
    await expect(page.getByText('Your registration completed')).toBeVisible();

    console.log('🎉 TEST PASSED: Register Success');
  });


  // ─────────────────────────────────────────────
  // ❌ NEGATIVE TEST CASES
  // ─────────────────────────────────────────────

  // REG-002: Register Invalid (Empty Fields)
  test('REG-002 - Register Invalid (Empty Fields)', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

    console.log('📸 Step 2: Screenshot empty form');
    await page.screenshot({ path: 'screenshots/reg_empty_form.png', fullPage: true });

    console.log('🚀 Step 3: Click register without input');
    await page.click('input[value="Register"]');

    console.log('🔍 Step 4: Validate error messages');
    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible();

    console.log('📸 Step 5: Screenshot error state');
    await page.screenshot({ path: 'screenshots/reg_empty_error.png', fullPage: true });

    console.log('❌ TEST PASSED: Validation error shown for empty fields');
  });

  // REG-003: Register Invalid Email Format
  test('REG-003 - Register Invalid Email Format', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

    console.log('✍️ Step 2: Fill form with invalid email format');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', 'invalid-email');
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🚀 Step 3: Submit form');
    await page.click('input[value="Register"]');

    console.log('📸 Step 4: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_invalid_email.png', fullPage: true });

    console.log('🔍 Step 5: Validate error message');
    await expect(page.locator('text=Wrong email')).toBeVisible();

    console.log('❌ TEST PASSED: Invalid email format detected');
  });

  // REG-004: Password Mismatch
  test('REG-004 - Password Mismatch', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

    console.log('✍️ Step 2: Fill form with mismatched passwords');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Wrong1234!');

    console.log('🚀 Step 3: Submit form');
    await page.click('input[value="Register"]');

    console.log('📸 Step 4: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_password_mismatch.png', fullPage: true });

    console.log('🔍 Step 5: Validate mismatch error');
    await expect(
      page.getByText('The password and confirmation password do not match')
    ).toBeVisible();

    console.log('❌ TEST PASSED: Password mismatch detected');
  });

  // REG-005: Password Too Short (below minimum length)
  test('REG-005 - Password Too Short', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

    console.log('✍️ Step 2: Fill form with short password (< 6 chars)');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', '123');
    await page.fill('#ConfirmPassword', '123');

    console.log('🚀 Step 3: Submit form');
    await page.click('input[value="Register"]');

    console.log('📸 Step 4: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_short_password.png', fullPage: true });

    console.log('🔍 Step 5: Validate password length error');
    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible();

    console.log('❌ TEST PASSED: Short password rejected');
  });

  // REG-006: First Name Missing
  test('REG-006 - First Name Empty', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

    console.log('✍️ Step 2: Fill form without First Name');
    await page.fill('#FirstName', '');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🚀 Step 3: Submit form');
    await page.click('input[value="Register"]');

    console.log('📸 Step 4: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_no_firstname.png', fullPage: true });

    console.log('🔍 Step 5: Validate First Name required error');
    await expect(
      page.locator('.field-validation-error')
    ).toBeVisible();

    console.log('❌ TEST PASSED: First Name required validation triggered');
  });

  // REG-007: Last Name Missing
  test('REG-007 - Last Name Empty', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

    console.log('✍️ Step 2: Fill form without Last Name');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', '');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🚀 Step 3: Submit form');
    await page.click('input[value="Register"]');

    console.log('📸 Step 4: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_no_lastname.png', fullPage: true });

    console.log('🔍 Step 5: Validate Last Name required error');
    await expect(
      page.locator('.field-validation-error')
    ).toBeVisible();

    console.log('❌ TEST PASSED: Last Name required validation triggered');
  });

  // REG-008: Duplicate Email Already Registered
  test('REG-008 - Duplicate Email Already Registered', async ({ page }) => {

    console.log('🚀 Step 1: Open register page and register first time');
    await page.goto('https://demowebshop.tricentis.com/register');

    const duplicateEmail = `silvi_dup_${Date.now()}@test.com`;

    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', duplicateEmail);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');
    await page.click('input[value="Register"]');

    console.log('🔁 Step 2: Navigate back and try same email again');
    await page.goto('https://demowebshop.tricentis.com/register');

    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', duplicateEmail);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');
    await page.click('input[value="Register"]');

    console.log('📸 Step 3: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_duplicate_email.png', fullPage: true });

    console.log('🔍 Step 4: Validate duplicate email error');
    await expect(
      page.locator('.validation-summary-errors, .field-validation-error')
    ).toBeVisible();

    console.log('❌ TEST PASSED: Duplicate email rejected');
  });

  // REG-009: Email With Spaces (invalid format)
  test('REG-009 - Email With Spaces', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

    console.log('✍️ Step 2: Fill email field with spaces');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', 'silvi test@test.com');
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🚀 Step 3: Submit form');
    await page.click('input[value="Register"]');

    console.log('📸 Step 4: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_email_spaces.png', fullPage: true });

    console.log('🔍 Step 5: Validate email format error');
    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible();

    console.log('❌ TEST PASSED: Email with spaces rejected');
  });

  // REG-010: Confirm Password Left Empty
  test('REG-010 - Confirm Password Empty', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

    console.log('✍️ Step 2: Fill form but leave Confirm Password empty');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', '');

    console.log('🚀 Step 3: Submit form');
    await page.click('input[value="Register"]');

    console.log('📸 Step 4: Screenshot error');
    await page.screenshot({ path: 'screenshots/reg_no_confirm_password.png', fullPage: true });

    console.log('🔍 Step 5: Validate confirm password error');
    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible();

    console.log('❌ TEST PASSED: Empty Confirm Password validation triggered');
  });

  // REG-011: XSS Injection in Name Field (Security Test)
  test('REG-011 - XSS Injection in Name Field (Security)', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

    const xssPayload = '<script>alert("XSS")</script>';

    console.log('✍️ Step 2: Fill First Name with XSS payload');
    await page.fill('#FirstName', xssPayload);
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    let alertFired = false;
    page.on('dialog', async (dialog) => {
      alertFired = true;
      await dialog.dismiss();
    });

    console.log('🚀 Step 3: Submit form');
    await page.click('input[value="Register"]');

    console.log('📸 Step 4: Screenshot result');
    await page.screenshot({ path: 'screenshots/reg_xss_injection.png', fullPage: true });

    await page.waitForTimeout(2000);

    console.log('🔍 Step 5: Validate XSS was NOT executed');
    expect(alertFired).toBe(false);

    console.log('🛡️ TEST PASSED: XSS payload not executed — input is sanitized');
  });

  // REG-012: SQL Injection in Email Field (Security Test)
  test('REG-012 - SQL Injection in Email Field (Security)', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

    const sqlPayload = `' OR '1'='1' --`;

    console.log('✍️ Step 2: Fill Email with SQL injection payload');
    await page.fill('#FirstName', 'Silvi');
    await page.fill('#LastName', 'Test');
    await page.fill('#Email', sqlPayload);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🚀 Step 3: Submit form');
    await page.click('input[value="Register"]');

    console.log('📸 Step 4: Screenshot result');
    await page.screenshot({ path: 'screenshots/reg_sql_injection.png', fullPage: true });

    console.log('🔍 Step 5: Validate no DB/SQL error exposed in page');
    const pageContent = await page.content();
    const hasSqlError =
      pageContent.toLowerCase().includes('sql') ||
      pageContent.toLowerCase().includes('syntax error') ||
      pageContent.toLowerCase().includes('unclosed quotation');

    expect(hasSqlError).toBe(false);

    await expect(
      page.locator('.field-validation-error, .validation-summary-errors')
    ).toBeVisible();

    console.log('🛡️ TEST PASSED: SQL injection did not expose DB error — handled safely');
  });

  // REG-013: Very Long Input in Name Fields (Boundary Test)
  test('REG-013 - Very Long Input in Name Fields (Boundary)', async ({ page }) => {

    console.log('🚀 Step 1: Open register page');
    await page.goto('https://demowebshop.tricentis.com/register');

    const longString = 'A'.repeat(300);

    console.log('✍️ Step 2: Fill First Name and Last Name with 300 characters');
    await page.fill('#FirstName', longString);
    await page.fill('#LastName', longString);
    await page.fill('#Email', `silvi_${Date.now()}@test.com`);
    await page.fill('#Password', 'Test1234!');
    await page.fill('#ConfirmPassword', 'Test1234!');

    console.log('🚀 Step 3: Submit form');
    await page.click('input[value="Register"]');

    console.log('📸 Step 4: Screenshot result');
    await page.screenshot({ path: 'screenshots/reg_long_input.png', fullPage: true });

    console.log('🔍 Step 5: Validate — page should handle gracefully (no crash/500 error)');
    const url = page.url();
    const pageContent = await page.content();
    const hasServerError =
      pageContent.includes('500') ||
      pageContent.toLowerCase().includes('server error') ||
      pageContent.toLowerCase().includes('exception');

    expect(hasServerError).toBe(false);

    console.log('⚠️ TEST PASSED: Long input handled gracefully — no server crash');
  });

});