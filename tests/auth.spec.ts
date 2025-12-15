import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import * as fs from 'fs';
import * as path from 'path';

let pm: PageManager;
let randomEmail: string;
let password: string;

test.beforeAll(async () => {
  const statePath = path.join(__dirname, '..', 'shared-state.json');
  const sharedState = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
  randomEmail = sharedState.randomEmail;
  password = sharedState.password;
});

test.beforeEach(async ({ page }) => {
  pm = new PageManager(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  try {
    await pm.btnConsent().waitFor({ state: 'visible', timeout: 5000 });
    await pm.btnConsent().click();
  } catch (e) {
    // Console log optional here
  }
});

test.describe('Authentication Tests', () => {

  // Covers E2E-001
  test('E2E-001: Full User Registration Flow', async ({ page }) => {
    pm.registerUser(randomEmail, randomEmail);
    await expect(page).toHaveTitle(/Signup/);
    await expect(pm.inputPassword()).toBeVisible();
    
    await pm.fillAccountDetails(password);
    await pm.fillAddressDetails();
    
    await expect(page.locator('h2[data-qa="account-created"]')).toBeVisible();
    await page.locator('[data-qa="continue-button"]').click();
    
    await expect(page.locator(`text=Logged in as ${randomEmail}`)).toBeVisible();
    await pm.linkLogout().click();
  });

  // Covers E2E-004
  test('E2E-004: Negative Registration (Existing Email)', async ({ page }) => {
    await pm.registerUser('Duplicate User', 'johndoesecond@johndoe.com');
    await expect(page.locator('form[action="/signup"] p')).toContainText('Email Address already exist!');
  });

  // Covers LOG-001, LOG-002, E2E-005
  test('LOG-001: Login with Valid Credentials', async ({ page }) => {
    await pm.loginUser(randomEmail, password);
    await expect(page.locator('text=Logged in as')).toBeVisible();
    await expect(page.locator(`text=${randomEmail}`)).toBeVisible();
  });

  // Covers LOG-002
  test('LOG-002: Logout User', async ({ page }) => {
    await pm.loginUser(randomEmail, password);
    await expect(page.locator('text=Logged in as')).toBeVisible();
    await pm.linkLogout().click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=Login to your account')).toBeVisible();
  });
});