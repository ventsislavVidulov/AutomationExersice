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

test.describe('Product Discovery & Review Tests', () => {

  // Covers PRD-001, PRD-003, E2E-011
  test('PRD-001: Search Product and Add to Cart', async ({ page }) => {
    await pm.linkProducts().click();
    await expect(page).toHaveTitle(/All Products/);
    await pm.inputSearch().fill('Blue Top');
    await pm.btnSearch().click();
    
    await expect(page.locator('.features_items')).toContainText('Searched Products');
    await expect(page.locator('.productinfo p').first()).toContainText('Blue Top');

    await page.hover('.product-image-wrapper', { force: true });
    await page.waitForTimeout(500);
    await page.locator('.overlay-content .add-to-cart').first().click();
    await expect(pm.modalAdded()).toBeVisible();
    await pm.btnContinueShopping().click();
  });

  // Covers PRD-005
  test('PRD-005: Filter Products by Category (Women > Dress)', async ({ page }) => {
    await pm.linkProducts().click();
    await pm.panelWomen().click();
    await pm.linkSubCategoryDress().click();
    await expect(page).toHaveURL(/\/category_products\/1/);
    await expect(page.locator('h2.title')).toContainText('Women - Dress Products');
  });

  // Covers PRD-010
  test('PRD-010: Filter Products by Brand (Polo)', async ({ page }) => {
    await pm.linkProducts().click();
    await pm.linkBrandPolo().click();
    await expect(page).toHaveURL(/\/brand_products\/Polo/);
    await expect(page.locator('h2.title.text-center')).toContainText('Brand - Polo Products');
  });

  // Covers PD-005
  test('PD-005: Submit Product Review', async ({ page }) => {
    await pm.linkProducts().click();
    await page.locator('.choose a').first().click();
    await pm.submitReview('QA Tester', 'test@test.com', 'This is a high quality product.');
    await expect(pm.alertReviewSuccess()).toBeVisible();
    await expect(pm.alertReviewSuccess()).toContainText('Thank you for your review');
  });

  // Covers PD-001
  test('PD-001: Verify Product Details Integrity', async ({ page }) => {
    await pm.linkProducts().click();
    const listPrice = await page.locator('.productinfo h2').first().innerText();
    
    await page.locator('.choose a').first().click();
    await expect(pm.productPrice()).toHaveText(listPrice);
    await expect(pm.productAvailability()).toBeVisible();
    await expect(pm.productAvailability()).toContainText('In Stock');
  });

  // Covers PRD-002
  test('PRD-002: Negative Search Results', async ({ page }) => {
    await pm.linkProducts().click();
    await pm.inputSearch().fill('NonExistentItem12345');
    await pm.btnSearch().click();
    const products = page.locator('.product-image-wrapper');
    await expect(products).toHaveCount(0);
  });

  // Covers E2E-017
  test('E2E-017: Add Recommended Item to Cart', async ({ page }) => {
    await pm.carouselRecommended().scrollIntoViewIfNeeded();
    await pm.btnAddRecommended().click();
    await expect(pm.modalAdded()).toBeVisible();
    await pm.btnViewCart().click();
    await expect(page.locator('#cart_info_table tbody tr')).toHaveCount(1);
  });

  // Covers HOME-009
  test('HOME-009: View Product Button Navigation', async ({ page }) => {
    await page.locator('.choose a').nth(2).click();
    await expect(page).toHaveURL(/\/product_details\/3/);
    await expect(page.locator('.product-information h2')).toBeVisible();
  });

  // Covers HOME-005
  test('HOME-005: Verify Add to Cart Overlay on Hover', async ({ page }) => {
    await page.goto('/');
    const productCard = page.locator('.single-products').first();
    const overlay = productCard.locator('.product-overlay');
    await expect(overlay).toHaveCSS('height', '0px');
    await productCard.hover();
    await expect(overlay).not.toHaveCSS('height', '0px');
  });

  // Covers E2E-102
  test('E2E-102: Access Non-Existent Product URL', async ({ page }) => {
    await page.goto('/product_details/99999', { waitUntil: 'domcontentloaded' });
    const currentURL = page.url();
    const expectedProductListURL = new RegExp(/\/products|\/404/);
    expect(currentURL).toMatch(expectedProductListURL);
  });
});