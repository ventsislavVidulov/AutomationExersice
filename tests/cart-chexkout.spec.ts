import { test, expect } from '../fixtures';

test.describe('Cart & Checkout Tests', () => {

  // Covers CART-001, CART-002, E2E-021
  test('CART-001: Verify Cart and Checkout Flow (Guest)', async ({ pm }) => {
    await pm.linkProducts().click();
    // Replaced raw locator
    await pm.btnAddToCartFirst().click();
    await pm.btnViewCart().click();
    await expect(pm.getPageUrl()).toMatch(/\/view_cart/);

    // Replaced raw locators
    await pm.btnCheckout().click();
    await expect(pm.modalCheckout()).toBeVisible();
    await pm.linkRegisterLoginCheckout().click();
    await expect(pm.getPageUrl()).toMatch(/\/login/);
  });

  // Covers E2E-020
  test('E2E-020: Empty Cart Check', async ({ pm }) => {
    await pm.linkCartNavigation().click();
    // Replaced raw locator
    await expect(pm.cartEmptyMessage()).toBeVisible();
  });

  // Covers CART-003
  test('CART-003: Remove Product From Cart', async ({ pm }) => {
    await pm.linkProducts().click();
    // Replaced raw locator
    await pm.btnAddToCartFirst().click();
    await pm.btnViewCart().click();
    await pm.btnRemoveItem().click();
    await expect(pm.cartEmptyMessage()).toBeVisible();
    await expect(pm.cartEmptyMessage()).toContainText('Cart is empty!');
  });

  // Covers E2E-015
  test('E2E-015: Update Product Quantity and Verify Total', async ({ pm }) => {
    await pm.linkProducts().click();
    // Replaced raw locator
    await pm.btnAddToCartFirst().click();
    await pm.btnViewCart().click();

    // Replaced raw locator
    const unitPriceText = await pm.cartItemPrices().first().innerText();
    const unitPrice = parseFloat(unitPriceText.replace(/[^0-9.]|(?<!\d)\./g, ''));

    await pm.inputQuantity().fill('5');
    await pm.inputQuantity().press('Enter');

    const newTotalPriceText = await pm.cartTotalPrice().first().innerText();
    const newTotalPrice = parseFloat(newTotalPriceText.replace(/[^0-9.]|(?<!\d)\./g, ''));
    expect(newTotalPrice).toBeCloseTo(unitPrice * 5, 0.01);
  });

  // Covers E2E-090
  test('E2E-090: Full Order Placement and Payment', async ({ pm }) => {
    await pm.loginUser(pm.credentials.registeredEmail, pm.credentials.registeredPassword);
    await pm.linkProducts().click();
    // Replaced raw locator
    await pm.btnAddToCartFirst().click();
    await pm.btnViewCart().click();
    // Replaced raw locator
    await pm.btnCheckout().click();

    await pm.textAreaComment().fill('Please deliver before 5 PM.');
    await pm.btnPlaceOrder().click();
    await pm.fillPaymentDetails();

    await expect(pm.getPageUrl()).toMatch(/\/payment_done/);
    await expect(pm.orderConfirmationMessage()).toContainText('Congratulations! Your order has been confirmed!');
  });

  // Covers E2E-107
  test('E2E-107: Product Quantity Input Boundary Check', async ({ pm }) => {
    await pm.linkProducts().click();
    // Replaced raw locators
    await pm.btnViewProductFromList(0).click();
    await pm.inputQuantityPDP().fill('999999');
    await pm.btnAddToCartPDP().click();
    await pm.btnViewCart().click();

    const finalQuantity = await pm.inputQuantity().inputValue();
    expect(parseInt(finalQuantity)).toBeLessThan(1000);
  });

  // Covers E2E-025
  test('E2E-025: Verify Cart Total Price Summation', async ({ pm}) => {
    await pm.linkProducts().click();
    
    // First Item
    // Replaced raw locators
    await pm.btnAddToCartFirst().click();
    await pm.btnContinueShopping().click();

    // Second Item (with hover fix)
    // Replaced raw locators (using locator on locator which is valid)
    const secondProductContainer = pm.productsListWrapper().nth(1);
    await secondProductContainer.hover();
    await secondProductContainer.locator('.add-to-cart').first().click(); // Targeting the add-to-cart button inside the wrapper

    await pm.btnViewCart().click();

    const prices = await pm.cartItemPrices().allInnerTexts();
    
    let expectedTotal = 0;
    prices.forEach(priceText => {
      expectedTotal += parseFloat(priceText.replace(/[^0-9.]|(?<!\d)\./g, ''));
    });

    // Replaced raw locators with PM locator
    const firstActualTotalText = await pm.cartItemTotalPrices().nth(0).innerText();
    const secondActualTotalText = await pm.cartItemTotalPrices().nth(1).innerText();
    const actualSum = parseFloat(firstActualTotalText.replace(/[^0-9.]|(?<!\d)\./g, '')) + parseFloat(secondActualTotalText.replace(/[^0-9.]|(?<!\d)\./g, ''));

    expect(actualSum).toBeCloseTo(expectedTotal, 0.01);
  });

  // Covers E2E-057
  test('E2E-057: Verify Order Comment Persistence', async ({ pm }) => {
    await pm.loginUser(pm.credentials.registeredEmail, pm.credentials.registeredPassword);
    await pm.linkProducts().click();
    // Replaced raw locator
    await pm.btnAddToCartFirst().click();
    await pm.btnViewCart().click();
    // Replaced raw locator
    await pm.btnCheckout().click();

    const commentText = 'Please ensure the packaging is sturdy.';
    await pm.textAreaComment().fill(commentText);
    await pm.btnPlaceOrder().click();

    // Replaced raw locator
    await expect(pm.inputCommentReadonly()).toHaveValue(commentText);
    await pm.fillPaymentDetails(); // Cleanup
  });

  // Covers E2E-064
  test('E2E-064: Guest User Attempts Checkout', async ({ pm }) => {
    await pm.linkProducts().click();
    // Replaced raw locator
    await pm.btnAddToCartFirst().click();
    await pm.btnViewCart().click();
    // Replaced raw locator
    await pm.btnCheckout().click();
    // Replaced raw locator
    await expect(pm.msgRegisterLoginCheckout()).toBeVisible();
  });
});