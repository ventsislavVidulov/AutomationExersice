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
  } catch (e) {}
});

test.describe('Cart & Checkout Tests', () => {

  // Covers CART-001, CART-002, E2E-021
  test('CART-001: Verify Cart and Checkout Flow (Guest)', async ({ page }) => {
    await pm.linkProducts().click();
    await page.locator('.add-to-cart').first().click();
    await pm.btnViewCart().click();
    await expect(page).toHaveURL(/\/view_cart/);

    await page.locator('.check_out').click();
    await expect(page.locator('#checkoutModal')).toBeVisible();
    await page.locator('#checkoutModal u').click();
    await expect(page).toHaveURL(/\/login/);
  });

  // Covers E2E-020
  test('E2E-020: Empty Cart Check', async ({ page }) => {
    await pm.linkCartNavigation().click();
    await expect(page.locator('#empty_cart')).toBeVisible();
  });

  // Covers CART-003
  test('CART-003: Remove Product From Cart', async ({ page }) => {
    await pm.linkProducts().click();
    await page.locator('.add-to-cart').first().click();
    await pm.btnViewCart().click();
    await pm.btnRemoveItem().click();
    await expect(pm.cartEmptyMessage()).toBeVisible();
    await expect(pm.cartEmptyMessage()).toContainText('Cart is empty!');
  });

  // Covers E2E-015
  test('E2E-015: Update Product Quantity and Verify Total', async ({ page }) => {
    await pm.linkProducts().click();
    await page.locator('.add-to-cart').first().click();
    await pm.btnViewCart().click();

    const unitPriceText = await page.locator('.cart_price').first().innerText();
    const unitPrice = parseFloat(unitPriceText.replace(/[^0-9.]|(?<!\d)\./g, ''));

    await pm.inputQuantity().fill('5');
    await pm.inputQuantity().press('Enter');

    const newTotalPriceText = await pm.cartTotalPrice().first().innerText();
    const newTotalPrice = parseFloat(newTotalPriceText.replace(/[^0-9.]|(?<!\d)\./g, ''));
    expect(newTotalPrice).toBeCloseTo(unitPrice * 5, 0.01);
  });

  // Covers E2E-090
  test('E2E-090: Full Order Placement and Payment', async ({ page }) => {
    await pm.loginUser(randomEmail, password);
    await pm.linkProducts().click();
    await page.locator('.add-to-cart').first().click();
    await pm.btnViewCart().click();
    await page.locator('.check_out').click();

    await pm.textAreaComment().fill('Please deliver before 5 PM.');
    await pm.btnPlaceOrder().click();
    await pm.fillPaymentDetails();

    await expect(page).toHaveURL(/\/payment_done/);
    await expect(pm.orderConfirmationMessage()).toContainText('Congratulations! Your order has been confirmed!');
  });

  // Covers E2E-107
  test('E2E-107: Product Quantity Input Boundary Check', async ({ page }) => {
    await pm.linkProducts().click();
    await page.locator('.choose a').first().click();
    await page.locator('#quantity').fill('999999');
    await page.locator('button.cart').click();
    await pm.btnViewCart().click();

    const finalQuantity = await pm.inputQuantity().inputValue();
    expect(parseInt(finalQuantity)).toBeLessThan(1000);
  });

  // Covers E2E-025
  test('E2E-025: Verify Cart Total Price Summation', async ({ page }) => {
    await pm.linkProducts().click();
    
    // First Item
    await page.locator('.add-to-cart').first().click();
    await page.locator('.close-modal').click();

    // Second Item (with hover fix)
    const secondProductContainer = page.locator('.product-image-wrapper').nth(1);
    await secondProductContainer.hover();
    await secondProductContainer.locator('.add-to-cart').nth(1).click();

    await pm.btnViewCart().click();

    await page.waitForTimeout(500);

    const prices = await pm.cartItemPrices().allInnerTexts();
    
    let expectedTotal = 0;
    prices.forEach(priceText => {
      expectedTotal += parseFloat(priceText.replace(/[^0-9.]|(?<!\d)\./g, ''));
    });

    const firstActualTotalText = await page.locator('#cart_info').locator('td.cart_total').nth(0).innerText();
    const secondActualTotalText = await page.locator('#cart_info').locator('td.cart_total').nth(1).innerText();
    const actualSum = parseFloat(firstActualTotalText.replace(/[^0-9.]|(?<!\d)\./g, '')) + parseFloat(secondActualTotalText.replace(/[^0-9.]|(?<!\d)\./g, ''));

    expect(actualSum).toBeCloseTo(expectedTotal, 0.01);
  });

  // Covers E2E-057
  test('E2E-057: Verify Order Comment Persistence', async ({ page }) => {
    await pm.loginUser(randomEmail, password);
    await pm.linkProducts().click();
    await page.locator('.add-to-cart').first().click();
    await pm.btnViewCart().click();
    await page.locator('.check_out').click();

    const commentText = 'Please ensure the packaging is sturdy.';
    await pm.textAreaComment().fill(commentText);
    await pm.btnPlaceOrder().click();

    await expect(page.locator('.form-control[readonly]')).toHaveValue(commentText);
    await pm.fillPaymentDetails(); // Cleanup
  });

  // Covers E2E-064
  test('E2E-064: Guest User Attempts Checkout', async ({ page }) => {
    await pm.linkProducts().click();
    await page.locator('.add-to-cart').first().click();
    await pm.btnViewCart().click();
    await page.locator('.check_out').click();
    await expect(page.locator('p:has-text("Register / Login account to proceed on checkout.")')).toBeVisible();
  });
});