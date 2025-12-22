import { test, expect } from "../fixtures";

test.describe('Product Discovery & Review Tests', () => {

  // Covers PRD-001, PRD-003, E2E-011
  test('PRD-001: Search Product and Add to Cart', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    expect(pm.nav.getPageUrl()).toMatch(/products/);

    await pm.products.searchProduct('Blue Top'); 

    await expect(pm.products.h2FeaturesItems()).toContainText('Searched Products');
    await expect(pm.products.productTextList()).toContainText('Blue Top');

    await pm.products.productCardImageWrapper().hover({ force: true });
    await pm.products.btnAddToCartFromList().click();
    
    await expect(pm.nav.modalAdded()).toBeVisible();
    await pm.nav.btnContinueShopping().click();
  });

  // Covers PRD-005
  test('PRD-005: Filter Products by Category (Women > Dress)', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    await pm.products.panelWomen().click();
    await pm.products.linkSubCategoryDress().click();
    await expect(pm.nav.getPageUrl()).toMatch(/\/category_products\/1/);
    await expect(pm.products.h2PageTitle()).toContainText('Women - Dress Products');
  });

  // Covers PRD-010
  test('PRD-010: Filter Products by Brand (Polo)', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    await pm.products.linkBrand('Polo').click();
    await expect(pm.nav.getPageUrl()).toMatch(/\/brand_products\/Polo/);
    await expect(pm.products.h2PageTitle()).toContainText('Brand - Polo Products');
  });

  // Covers PD-005
  test('PD-005: Submit Product Review', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    await pm.products.btnViewProductDetailsNth(0).click();
    await pm.productDetails.submitReview('QA Tester', 'test@test.com', 'This is a high quality product.');
    await expect(pm.productDetails.alertReviewSuccess()).toBeVisible();
    await expect(pm.productDetails.alertReviewSuccess()).toContainText('Thank you for your review');
  });

  // Covers PD-001
  test('PD-001: Verify Product Details Integrity', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    const listPrice = await pm.products.productPriceList().innerText();

    await pm.products.btnViewProductDetailsNth(1).click();
    await expect(pm.productDetails.productPrice()).toHaveText(listPrice);
    await expect(pm.productDetails.productAvailability()).toBeVisible();
    await expect(pm.productDetails.productAvailability()).toContainText('In Stock');
  });

  // Covers PRD-002
  test('PRD-002: Negative Search Results', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    await pm.products.searchProduct('NonExistentItem12345'); 
    const products = pm.products.productsListWrapper();
    await expect(products).toHaveCount(0);
  });

  // Covers E2E-017
  test('E2E-017: Add Recommended Item to Cart', async ({ pm }) => {
    await pm.products.carouselRecommended().scrollIntoViewIfNeeded();
    await pm.products.btnAddRecommendedFirst().click();
    await expect(pm.nav.modalAdded()).toBeVisible();
    await pm.nav.btnViewCart().click();
    await expect(pm.cart.cartItemRows()).toHaveCount(1);
  });

  // Covers HOME-009
  test('HOME-009: View Product Button Navigation', async ({ pm }) => {
    await pm.products.btnViewProductDetailsNth(3).click();
    await expect(pm.nav.getPageUrl()).toMatch(/\/product_details\/3/);
    await expect(pm.products.h2ProductInfo()).toBeVisible();
  });

  // Covers HOME-005
  test('HOME-005: Verify Add to Cart Overlay on Hover', async ({ pm }) => {
    await pm.nav.goToHomePage(); 
    const productCard = pm.products.productCard(1);
    const overlay = pm.products.productOverlay(1);
    
    await expect(overlay).toHaveCSS('height', '0px');
    await productCard.hover();
    await expect(overlay).not.toHaveCSS('height', '0px');
  });

  // Covers E2E-102
  test('E2E-102: Access Non-Existent Product URL', async ({ pm }) => {
    await pm.nav.goToProductDetails(9999999);
    const currentURL = pm.nav.getPageUrl();
    const expectedProductListURL = new RegExp(/\/products|\/404/);
    expect(currentURL).toMatch(expectedProductListURL);
  });
});