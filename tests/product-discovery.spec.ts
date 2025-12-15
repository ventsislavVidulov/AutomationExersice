import { test, expect } from "../fixtures";

test.describe('Product Discovery & Review Tests', () => {

  // Covers PRD-001, PRD-003, E2E-011
  test('PRD-001: Search Product and Add to Cart', async ({ pm }) => {
    await pm.linkProducts().click();
    await expect(pm.getPageTitle()).toMatch(/All Products/);

    await pm.searchProduct('Blue Top'); // Using new helper method

    await expect(pm.h2FeaturesItems()).toContainText('Searched Products');
    await expect(pm.productTextList()).toContainText('Blue Top');

    await pm.productCardImageWrapper().hover({ force: true });
    // await page.waitForTimeout(500);
    await pm.btnAddToCartFromList().click();
    await expect(pm.modalAdded()).toBeVisible();
    await pm.btnContinueShopping().click();
  });

  // Covers PRD-005
  test('PRD-005: Filter Products by Category (Women > Dress)', async ({ pm }) => {
    await pm.linkProducts().click();
    await pm.panelWomen().click();
    await pm.linkSubCategoryDress().click();
    await expect(pm.getPageUrl()).toMatch(/\/category_products\/1/);
    await expect(pm.h2PageTitle()).toContainText('Women - Dress Products');
  });

  // Covers PRD-010
  test('PRD-010: Filter Products by Brand (Polo)', async ({ pm, page }) => {
    await pm.linkProducts().click();
    await pm.linkBrandPolo().click();
    await expect(pm.getPageUrl()).toMatch(/\/brand_products\/Polo/);
    await expect(pm.h2PageTitle()).toContainText('Brand - Polo Products');
  });

  // Covers PD-005
  test('PD-005: Submit Product Review', async ({ pm }) => {
    await pm.linkProducts().click();
    await pm.btnViewProductFromList(0).click();
    await pm.submitReview('QA Tester', 'test@test.com', 'This is a high quality product.');
    await expect(pm.alertReviewSuccess()).toBeVisible();
    await expect(pm.alertReviewSuccess()).toContainText('Thank you for your review');
  });

  // Covers PD-001
  test('PD-001: Verify Product Details Integrity', async ({ pm }) => {
    await pm.linkProducts().click();
    const listPrice = await pm.productPriceList().innerText();

    await pm.btnViewProductFromList(0).click();
    await expect(pm.productPrice()).toHaveText(listPrice);
    await expect(pm.productAvailability()).toBeVisible();
    await expect(pm.productAvailability()).toContainText('In Stock');
  });

  // Covers PRD-002
  test('PRD-002: Negative Search Results', async ({ pm }) => {
    await pm.linkProducts().click();
    await pm.searchProduct('NonExistentItem12345'); // Using new helper method
    const products = pm.productsListWrapper();
    await expect(products).toHaveCount(0);
  });

  // Covers E2E-017
  test('E2E-017: Add Recommended Item to Cart', async ({ pm }) => {
    await pm.carouselRecommended().scrollIntoViewIfNeeded();
    await pm.btnAddRecommended().click();
    await expect(pm.modalAdded()).toBeVisible();
    await pm.btnViewCart().click();
    await expect(pm.cartItemRows()).toHaveCount(1);
  });

  // Covers HOME-009
  test('HOME-009: View Product Button Navigation', async ({ pm }) => {
    await pm.btnViewProductFromList(2).click();
    await expect(pm.getPageUrl()).toMatch(/\/product_details\/3/);
    await expect(pm.h2ProductInfo()).toBeVisible();
  });

  // Covers HOME-005
  test('HOME-005: Verify Add to Cart Overlay on Hover', async ({ pm }) => {
    await pm.goToHomePage(); ``
    const productCard = pm.productCard(0);
    const overlay = pm.productOverlay(0);
    // Note: Checking for height '0px' might be flaky, checking for visibility is safer.
    // However, keeping the original logic using the new locators.
    await expect(overlay).toHaveCSS('height', '0px');
    await productCard.hover();
    await expect(overlay).not.toHaveCSS('height', '0px');
  });

  // Covers E2E-102
  test('E2E-102: Access Non-Existent Product URL', async ({ pm }) => {
    await pm.goToProductDetails(9999999);
    const currentURL = pm.getPageUrl();
    const expectedProductListURL = new RegExp(/\/products|\/404/);
    expect(currentURL).toMatch(expectedProductListURL);
  });
});