import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

let pm: PageManager;

test.beforeEach(async ({ page }) => {
  pm = new PageManager(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  try {
    await pm.btnConsent().waitFor({ state: 'visible', timeout: 5000 });
    await pm.btnConsent().click();
  } catch (e) {}
});

test.describe('General Features & Forms', () => {

  // Covers E2E-061, E2E-062, E2E-071
  test('E2E-061: Contact Us Form with File Upload', async ({ page }) => {
    await pm.linkContact().click();
    await expect(page).toHaveTitle(/Contact Us/);
    await page.waitForTimeout(1000); // Wait for animations

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

    await expect(page.locator('h2 + div.alert-success')).toContainText('Success! Your details have been submitted successfully.');
  });

  // Covers E2E-009
  test('E2E-009: Footer Subscription', async ({ page }) => {
    await page.locator('#susbscribe_email').scrollIntoViewIfNeeded();
    const randomEmail = `sub_${Date.now()}@test.com`;
    await page.locator('#susbscribe_email').fill(randomEmail);
    await page.locator('#subscribe').click();
    await expect(page.locator('#success-subscribe')).toBeVisible();
    await expect(page.locator('#success-subscribe')).toContainText('You have been successfully subscribed!');
  });

  // Covers E2E-059
  test('E2E-059: Verify Mobile Viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');
    await expect(page.locator('.logo')).toBeVisible();
  });

  // Covers E2E-031
  test('E2E-031: Verify Subscription in Cart Page', async ({ page }) => {
    await pm.linkCartNavigation().click();
    const email = `sub_${Date.now()}@test.com`;
    await page.locator('#susbscribe_email').fill(email);
    await page.locator('#subscribe').click();
    await expect(page.locator('#success-subscribe')).toBeVisible();
    await expect(page.locator('#success-subscribe')).toContainText('You have been successfully subscribed!');
  });

  // Covers E2E-067
  test('E2E-067: Verify "API Testing" Link Navigation', async ({ page }) => {
    await page.locator('a:has-text("API Testing")').click();
    const expectedURLPattern = /https:\/\/www.automationtesting.com|qaautomation\.net/;
    await expect(page).toHaveURL(expectedURLPattern);
  });
});