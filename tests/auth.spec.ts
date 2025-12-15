import { test, expect } from "../fixtures";

test.describe('Authentication Tests', () => {

  // Covers E2E-001
  //   test('E2E-001: Full User Registration Flow', async ({ page }) => {
  //     await pm.registerUser(randomEmail, randomEmail);
  //     await expect(page).toHaveTitle(/Signup/);
  //     await expect(pm.inputPassword()).toBeVisible();

  //     await pm.fillAccountDetails(password);
  //     await pm.fillAddressDetails();

  //     // Updated to use PageManager locator
  //     await expect(pm.h2AccountCreated()).toBeVisible();
  //     await pm.btnContinue().click();

  //     // Updated to use PageManager locator for dynamic text
  //     await expect(pm.txtLoggedInUser(randomEmail)).toBeVisible();
  //     await pm.linkLogout().click();
  //   });

  // Covers E2E-004
  test('E2E-004: Negative Registration (Existing Email)', async ({ pm }) => {
    // Attempt to register with the same email used in E2E-001 (or previous runs)
    await pm.registerUser('Duplicate User', 'johndoesecond@johndoe.com'); // Or use randomEmail if you want to test strict duplication of the specific user

    // Updated to use PageManager locator
    await expect(pm.msgSignupError()).toContainText('Email Address already exist!');
  });

  // Covers LOG-001, LOG-002, E2E-005
  test('LOG-001: Login with Valid Credentials', async ({ pm }) => {
    await pm.loginUser(pm.credentials.registeredEmail, pm.credentials.registeredPassword);
    await expect(pm.txtLoggedInAs()).toBeVisible();
    await expect(pm.txtLoggedInUser(pm.credentials.registeredUserNames)).toBeVisible();
  });

  // Covers LOG-002
  test('LOG-002: Logout User', async ({ pm }) => {
    await pm.loginUser(pm.credentials.registeredEmail, pm.credentials.registeredPassword);
    await expect(pm.txtLoggedInAs()).toBeVisible();

    await pm.linkLogout().click();

    await expect(pm.getPageUrl()).toMatch(/\/login/);
    await expect(pm.h2LoginToAccount()).toBeVisible();
  });
});