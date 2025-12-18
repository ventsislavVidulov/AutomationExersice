import { test, expect } from '../fixtures';

test.describe('General Features & Forms', () => {

  // Covers E2E-061, E2E-062, E2E-071
  test('E2E-061: Contact Us Form with File Upload', async ({ pm }) => {
    // Nav links are now in pm.nav
    await pm.nav.linkContact().click();
    await expect(pm.nav.getPageUrl()).toMatch(/\/contact_us/);
    await expect(pm.nav.getPageTitle()).toMatch(/Contact Us/);

    // Support fields are now in pm.support
    await pm.support.inputContactName().fill('QA Tester');
    await pm.support.inputContactEmail().fill('test@test.com');
    await pm.support.inputContactSubject().fill('E2E Testing Subject');
    await pm.support.inputContactMessage().fill('This is a test message.');

    await pm.support.inputUploadFile().setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('this is test data')
    });

    // Technical helpers remain on pm (inherited from BasePage via PageManager)
    await pm.nav.acceptNextDialog();
    await pm.support.btnSubmitContact().click();

    await expect(pm.support.alertContactSuccess()).toContainText('Success! Your details have been submitted successfully.');
  });

  // Covers E2E-009
  test('E2E-009: Footer Subscription', async ({ pm }) => {
    // Subscription logic is in pm.support
    await pm.support.inputSubscribeEmail().scrollIntoViewIfNeeded();
    const randomEmail = `sub_${Date.now()}@test.com`;
    await pm.support.inputSubscribeEmail().fill(randomEmail);
    await pm.support.btnSubscribe().click();
    await expect(pm.support.msgSubscribeSuccess()).toBeVisible();
    await expect(pm.support.msgSubscribeSuccess()).toContainText('You have been successfully subscribed!');
  });

  // Covers E2E-059
  test('E2E-059: Verify Mobile Viewport', async ({ pm }) => {
    // Technical helpers remain on pm
    await pm.nav.resizeWindow(375, 667); 
    await pm.nav.goToHomePage();
    // Logo is in pm.nav
    await expect(pm.nav.logo()).toBeVisible();
  });

  // Covers E2E-031
  test('E2E-031: Verify Subscription in Cart Page', async ({ pm }) => {
    await pm.nav.linkCartNavigation().click();
    const email = `sub_${Date.now()}@test.com`;
    
    // Subscription locators remain in support as they are global footer elements
    await pm.support.inputSubscribeEmail().fill(email);
    await pm.support.btnSubscribe().click();
    await expect(pm.support.msgSubscribeSuccess()).toBeVisible();
    await expect(pm.support.msgSubscribeSuccess()).toContainText('You have been successfully subscribed!');
  });

  // Covers E2E-067
  test('E2E-067: Verify "API Testing" Link Navigation', async ({ pm }) => {
    // Nav links are in pm.nav
    await pm.nav.linkAPITesting().click();
    const expectedURL = 'https://automationexercise.com/api_list';
    await expect(pm.nav.getPageUrl()).toMatch(expectedURL);
  });
});