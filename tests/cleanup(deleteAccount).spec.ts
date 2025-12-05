import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import * as fs from 'fs';
import * as path from 'path';

let pm: PageManager;

test.beforeEach(async ({ page }) => {
  pm = new PageManager(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  try {
    await pm.btnConsent().waitFor({ state: 'visible', timeout: 5000 });
    await pm.btnConsent().click();
  } catch (e) {}
});

test('Global Cleanup: Delete Account', async ({ page }) => {
  // 1. Load the shared state (email/password)
  const statePath = path.join(__dirname, '..', 'shared-state.json');
  if (!fs.existsSync(statePath)) {
    console.log('No shared state found. Skipping cleanup.');
    return;
  }
  const sharedState = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

  const pm = new PageManager(page);
  
  // 2. Login
  await page.goto('/login');
  await pm.loginUser(sharedState.randomEmail, sharedState.password);
  
  // 3. Delete Account
  await pm.linkDeleteAccount().click();
  await expect(pm.h2AccountDeleted()).toBeVisible();
  console.log('Global cleanup: Account deleted successfully.');
});