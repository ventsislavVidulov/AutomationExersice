import { test, expect } from '../fixtures';

test.describe('General Features & Forms', () => {

  // Covers E2E-061, E2E-062, E2E-071
  test('E2E-061: Contact Us Form with File Upload', async ({ pm }) => {
    await pm.linkContact().click();
    await expect(pm.getPageUrl()).toMatch(/\/contact_us/);
    await expect(pm.getPageTitle()).toMatch(/Contact Us/);

    await pm.inputContactName().fill('QA Tester');
    await pm.inputContactEmail().fill('test@test.com');
    await pm.inputContactSubject().fill('E2E Testing Subject');
    await pm.inputContactMessage().fill('This is a test message.');

    await pm.inputUploadFile().setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('this is test data')
    });

    await pm.acceptNextDialog();
    await pm.btnSubmitContact().click();

    // Replaced raw locator
    await expect(pm.alertContactSuccess()).toContainText('Success! Your details have been submitted successfully.');
  });

  // Covers E2E-009
  test('E2E-009: Footer Subscription', async ({ pm }) => {
    // Replaced raw locators
    await pm.inputSubscribeEmail().scrollIntoViewIfNeeded();
    const randomEmail = `sub_${Date.now()}@test.com`;
    await pm.inputSubscribeEmail().fill(randomEmail);
    await pm.btnSubscribe().click();
    await expect(pm.msgSubscribeSuccess()).toBeVisible();
    await expect(pm.msgSubscribeSuccess()).toContainText('You have been successfully subscribed!');
  });

  // Covers E2E-059
  test('E2E-059: Verify Mobile Viewport', async ({ pm }) => {
    await pm.resizeWindow(375, 667); // Configuration, requires `page`
    await pm.goToHomePage();
    // Replaced raw locator
    await expect(pm.logo()).toBeVisible();
  });

  // Covers E2E-031
  test('E2E-031: Verify Subscription in Cart Page', async ({ pm }) => {
    await pm.linkCartNavigation().click();
    const email = `sub_${Date.now()}@test.com`;
    // Replaced raw locators
    await pm.inputSubscribeEmail().fill(email);
    await pm.btnSubscribe().click();
    await expect(pm.msgSubscribeSuccess()).toBeVisible();
    await expect(pm.msgSubscribeSuccess()).toContainText('You have been successfully subscribed!');
  });

  // Covers E2E-067
  test('E2E-067: Verify "API Testing" Link Navigation', async ({ pm }) => {
    // Replaced raw locator
    await pm.linkAPITesting().click();
    const expectedURL = 'https://automationexercise.com/api_list';
    await expect(pm.getPageUrl()).toMatch(expectedURL);
  });
});