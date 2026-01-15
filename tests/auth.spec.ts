import { test, expect } from "../fixtures";
import { accountDetails, addressDetails, registeredUserCredentials } from "../testData/credentialsData";


test.describe('Authentication Tests', () => {

  // Covers E2E-001
    // test('E2E-001: Full User Registration Flow', async ({ pm }) => {
    //   await pm.auth.registerUser(randomEmail, randomEmail);
    //   await expect(pm.nav.getPageTitle()).toBe(/Signup/);
    //   await expect(pm.auth.inputPassword()).toBeVisible();

    //   await pm.auth.fillAccountDetails(accountDetails);
    //   await pm.auth.fillAddressDetails(addressDetails);

    //   // Updated to use PageManager locator
    //   await expect(pm.auth.h2AccountCreated()).toBeVisible();
    //   await pm.auth.btnContinue().click();

    //   // Updated to use PageManager locator for dynamic text
    //   await expect(pm.nav.txtLoggedInUser(randomEmail)).toBeVisible();
    //   await pm.nav.linkLogout().click();
    // });

  // Covers E2E-004
  test('E2E-004: Negative Registration (Existing Email)', async ({ pm }) => {

    await pm.nav.linkLogin().click();

    // Attempt to register with the same email used in E2E-001 (or previous runs)
    await pm.auth.registerUser(registeredUserCredentials.userFullName, registeredUserCredentials.email); // Or use randomEmail if you want to test strict duplication of the specific user

    // Updated to use PageManager locator
    await expect(pm.auth.msgSignupError()).toContainText('Email Address already exist!');
  });

  // Covers LOG-001, LOG-002, E2E-005
  test('LOG-001: Login with Valid Credentials', async ({ pm }) => {
    await pm.nav.linkLogin().click();
    await pm.auth.loginUser(registeredUserCredentials.email, registeredUserCredentials.password);
    await expect(pm.nav.txtLoggedInAs()).toBeVisible();
    await expect(pm.nav.txtLoggedInUser(registeredUserCredentials.userFullName)).toBeVisible();
  });

  // Covers LOG-002
  test('LOG-002: Logout User', async ({ pm }) => {
    await pm.nav.linkLogin().click();

    await pm.auth.loginUser(registeredUserCredentials.email, registeredUserCredentials.password);
    await expect(pm.nav.txtLoggedInAs()).toBeVisible();

    await pm.nav.linkLogout().click();

    await expect(pm.nav.getPageUrl()).toMatch(/\/login/);
    await expect(pm.auth.h2LoginToAccount()).toBeVisible();
  });
});