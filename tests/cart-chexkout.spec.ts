import { test, expect } from '../fixtures';
import {validPaymentData} from '../testData/paymentData'

test.describe('Cart & Checkout Tests', () => {

  // Covers CART-001, CART-002, E2E-021
  test('CART-001: Verify Cart and Checkout Flow (Guest)', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    await pm.products.btnAddToCartFirst().click();
    await pm.nav.btnViewCart().click();
    expect(pm.nav.getPageUrl()).toMatch(/\/view_cart/);

    // Replaced raw locators
    await pm.cart.btnCheckout().click();
    await expect(pm.cart.modalCheckout()).toBeVisible();
    await pm.cart.linkRegisterLoginCheckout().click();
    await expect(pm.nav.getPageUrl()).toMatch(/\/login/);
  });

  // Covers E2E-020
  test('E2E-020: Empty Cart Check', async ({ pm }) => {
    await pm.nav.linkCartNavigation().click();
    // Replaced raw locator
    await expect(pm.cart.cartEmptyMessage()).toBeVisible();
  });

  // Covers CART-003
  test('CART-003: Remove Product From Cart', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    // Replaced raw locator
    await pm.products.btnAddToCartFirst().click();
    await pm.nav.btnViewCart().click();
    await pm.cart.btnRemoveItem().click();
    await expect(pm.cart.cartEmptyMessage()).toBeVisible();
    await expect(pm.cart.cartEmptyMessage()).toContainText('Cart is empty!');
  });

  // Covers E2E-015
  test('E2E-015: Update Product Quantity and Verify Total', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    // Replaced raw locator
    await pm.products.btnAddToCartFirst().click();
    await pm.nav.btnViewCart().click();

    // Replaced raw locator
    const unitPriceText = await pm.cart.cartItemPrices().first().innerText();
    const unitPrice = parseFloat(unitPriceText.replace(/[^0-9.]|(?<!\d)\./g, ''));

    await pm.cart.inputQuantity().fill('5');
    await pm.cart.inputQuantity().press('Enter');

    const newTotalPriceText = await pm.cart.cartTotalPrice().first().innerText();
    const newTotalPrice = parseFloat(newTotalPriceText.replace(/[^0-9.]|(?<!\d)\./g, ''));
    expect(newTotalPrice).toBeCloseTo(unitPrice * 5, 0.01);
  });

  // Covers E2E-090
  test('E2E-090: Full Order Placement and Payment', async ({ pm }) => {
    await pm.auth.loginUser(pm.credentials.registeredEmail, pm.credentials.registeredPassword);
    await pm.nav.linkProducts().click();
    // Replaced raw locator
    await pm.products.btnAddToCartFirst().click();
    await pm.nav.btnViewCart().click();
    // Replaced raw locator
    await pm.cart.btnCheckout().click();

    await pm.cart.textAreaComment().fill('Please deliver before 5 PM.');
    await pm.cart.btnPlaceOrder().click();
    await pm.cart.fillPaymentDetails(validPaymentData);

    await expect(pm.nav.getPageUrl()).toMatch(/\/payment_done/);
    await expect(pm.cart.orderConfirmationMessage()).toContainText('Congratulations! Your order has been confirmed!');
  });

  // Covers E2E-107
  test('E2E-107: Product Quantity Input Boundary Check', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    // Replaced raw locators
    await pm.products.btnViewProductFromList(0).click();
    await pm.products.inputQuantityPDP().fill('999999');
    await pm.products.btnAddToCartPDP().click();
    await pm.nav.btnViewCart().click();

    const finalQuantity = await pm.cart.inputQuantity().inputValue();
    expect(parseInt(finalQuantity)).toBeLessThan(1000);
  });

  // Covers E2E-025
  test('E2E-025: Verify Cart Total Price Summation', async ({ pm }) => {
    await pm.nav.linkProducts().click();

    // First Item
    // Replaced raw locators
    await pm.products.btnAddToCartFirst().click();
    await pm.nav.btnContinueShopping().click();

    // Second Item (with hover fix)
    // Replaced raw locators (using locator on locator which is valid)
    const secondProductContainer = pm.products.productsListWrapper().nth(1);
    await secondProductContainer.hover();
    await secondProductContainer.locator('.add-to-cart').first().click(); // Targeting the add-to-cart button inside the wrapper

    await pm.nav.btnViewCart().click();

    const prices = await pm.cart.cartItemPrices().allInnerTexts();

    let expectedTotal = 0;
    prices.forEach(priceText => {
      expectedTotal += parseFloat(priceText.replace(/[^0-9.]|(?<!\d)\./g, ''));
    });

    // Replaced raw locators with PM locator
    const firstActualTotalText = await pm.cart.cartItemTotalPrices().nth(0).innerText();
    const secondActualTotalText = await pm.cart.cartItemTotalPrices().nth(1).innerText();
    const actualSum = parseFloat(firstActualTotalText.replace(/[^0-9.]|(?<!\d)\./g, '')) + parseFloat(secondActualTotalText.replace(/[^0-9.]|(?<!\d)\./g, ''));

    expect(actualSum).toBeCloseTo(expectedTotal, 0.01);
  });

  // Covers E2E-057
  test('E2E-057: Verify Order Comment Persistence', async ({ pm }) => {
    await pm.auth.loginUser(pm.credentials.registeredEmail, pm.credentials.registeredPassword);
    await pm.nav.linkProducts().click();
    // Replaced raw locator
    await pm.products.btnAddToCartFirst().click();
    await pm.nav.btnViewCart().click();
    // Replaced raw locator
    await pm.cart.btnCheckout().click();

    const commentText = 'Please ensure the packaging is sturdy.';
    await pm.cart.textAreaComment().fill(commentText);
    await pm.cart.btnPlaceOrder().click();

    // Replaced raw locator
    await expect(pm.cart.inputCommentReadonly()).toHaveValue(commentText);
    await pm.cart.fillPaymentDetails(validPaymentData);
  });

  // Covers E2E-064
  test('E2E-064: Guest User Attempts Checkout', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    // Replaced raw locator
    await pm.products.btnAddToCartFirst().click();
    await pm.nav.btnViewCart().click();
    // Replaced raw locator
    await pm.cart.btnCheckout().click();
    // Replaced raw locator
    await expect(pm.cart.msgRegisterLoginCheckout()).toBeVisible();
  });
});