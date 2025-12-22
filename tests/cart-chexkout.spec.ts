import { test, expect } from '../fixtures';
import { validPaymentData, invalidPaymentData, emptyPaymentData } from '../testData/paymentData';
import { registeredUserCredentials } from '../testData/credentialsData';


test.describe('Cart & Checkout Tests', () => {

  test.describe('Parametrized Tests With Invalid Payment Data', () => {
    invalidPaymentData.forEach((paymentData) => {
      test(`Test Should fail with ${paymentData.name}`, async ({ pm }) => {
        await pm.nav.linkLogin().click();
        await pm.auth.loginUser(registeredUserCredentials.email, registeredUserCredentials.password);
        await pm.nav.linkProducts().click();
        // Replaced raw locator
        await pm.products.btnAddToCartNth(5).click();
        await pm.nav.btnViewCart().click();
        // Replaced raw locator
        await pm.cart.btnCheckout().click();

        await pm.checkout.textAreaComment().fill('Please deliver before 5 PM.');
        await pm.checkout.btnPlaceOrder().click();
        await pm.payment.fillPaymentDetails(paymentData);

        await expect(pm.nav.getPageUrl()).not.toMatch(/\/payment_done/);
        await expect(pm.payment.orderConfirmationMessage()).not.toContainText('Congratulations! Your order has been confirmed!');
      })
    })
  });

  test.describe('Parametrized Tests With Empty Payment Data', () => {
    emptyPaymentData.forEach((paymentData) => {
      test(`Test Should Fail with ${paymentData.name}`, async ({ pm }) => {
        await pm.nav.linkLogin().click();
        await pm.auth.loginUser(registeredUserCredentials.email, registeredUserCredentials.password);
        await pm.nav.linkProducts().click();
        // Replaced raw locator
        await pm.products.btnAddToCartNth(5).click();
        await pm.nav.btnViewCart().click();
        // Replaced raw locator
        await pm.cart.btnCheckout().click();

        await pm.checkout.textAreaComment().fill('Please deliver before 5 PM.');
        await pm.checkout.btnPlaceOrder().click();
        await pm.payment.fillPaymentDetails(paymentData);

        expect(pm.nav.getPageUrl()).not.toMatch(/\/payment_done/);
      })
    })
  });

  test.describe('Parametrized Tests With Valid Payment Data', () => {

    // Covers E2E-090
    test(`E2E-090: Full Order Placement And Payment With ${validPaymentData.name}`, async ({ pm }) => {
      await pm.nav.linkLogin().click();
      await pm.auth.loginUser(registeredUserCredentials.email, registeredUserCredentials.password);
      await pm.nav.linkProducts().click();
      // Replaced raw locator
      await pm.products.btnAddToCartNth(5).click();
      await pm.nav.btnViewCart().click();
      // Replaced raw locator
      await pm.cart.btnCheckout().click();

      await pm.checkout.textAreaComment().fill('Please deliver before 5 PM.');
      await pm.checkout.btnPlaceOrder().click();
      await pm.payment.fillPaymentDetails(validPaymentData);

      await expect(pm.nav.getPageUrl()).toMatch(/\/payment_done/);
      await expect(pm.payment.orderConfirmationMessage()).toContainText('Congratulations! Your order has been confirmed!');
    });

    // Covers E2E-057
    test('E2E-057: Verify Order Comment Persistence', async ({ pm }) => {
      await pm.nav.linkLogin().click();
      await pm.auth.loginUser(registeredUserCredentials.email, registeredUserCredentials.password);
      await pm.nav.linkProducts().click();
      // Replaced raw locator
      await pm.products.btnAddToCartNth(5).click();
      await pm.nav.btnViewCart().click();
      // Replaced raw locator
      await pm.cart.btnCheckout().click();

      const commentText = 'Please ensure the packaging is sturdy.';
      await pm.checkout.textAreaComment().fill(commentText);
      await pm.checkout.btnPlaceOrder().click();

      // Replaced raw locator
      await expect(pm.checkout.inputCommentReadonly()).toHaveValue(commentText);
      await pm.payment.fillPaymentDetails(validPaymentData);
    });
  });

  // Covers CART-001, CART-002, E2E-021
  test('CART-001: Verify Cart and Checkout Flow (Guest)', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    await pm.products.btnAddToCartNth(5).click();
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
    await pm.products.btnAddToCartNth(8).click();
    await pm.nav.btnViewCart().click();
    await pm.cart.btnRemoveItem().click();
    await expect(pm.cart.cartEmptyMessage()).toBeVisible();
    await expect(pm.cart.cartEmptyMessage()).toContainText('Cart is empty!');
  });

  // Covers E2E-015
  //TODO
  test('E2E-015: Update Product Quantity and Verify Total', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    // Replaced raw locator
    await pm.products.btnAddToCartNth(5).click();
    await pm.nav.btnViewCart().click();

    // Replaced raw locator
    const unitPriceText = await pm.cart.cartItemPrice(5).innerText();
    const unitPrice = parseFloat(unitPriceText.replace(/[^0-9.]|(?<!\d)\./g, ''));

    await pm.cart.inputQuantity().fill('5');
    await pm.cart.inputQuantity().press('Enter');

    const newTotalPriceText = await pm.cart.cartTotalPrice().first().innerText();
    const newTotalPrice = parseFloat(newTotalPriceText.replace(/[^0-9.]|(?<!\d)\./g, ''));
    expect(newTotalPrice).toBeCloseTo(unitPrice * 5, 0.01);
  });

  // Covers E2E-107
  test('E2E-107: Product Quantity Input Boundary Check', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    // Replaced raw locators
    await pm.products.btnViewProductDetailsNth(0).click();
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
    await pm.products.btnAddToCartNth(5).click();
    await pm.nav.btnContinueShopping().click();

    await pm.products.btnAddToCartNth(5).click();
    await pm.nav.btnContinueShopping().click();

    await pm.products.btnAddToCartNth(16).click();
    await pm.nav.btnContinueShopping().click();

    await pm.nav.linkCartNavigation().click();;

    expect(await pm.cart.getTotalPrice()).toBeCloseTo(1678, 0.01);
  });

  // Covers E2E-064
  test('E2E-064: Guest User Attempts Checkout', async ({ pm }) => {
    await pm.nav.linkProducts().click();
    // Replaced raw locator
    await pm.products.btnAddToCartNth(5).click();
    await pm.nav.btnViewCart().click();
    // Replaced raw locator
    await pm.cart.btnCheckout().click();
    // Replaced raw locator
    await expect(pm.cart.msgRegisterLoginCheckout()).toBeVisible();
  });
});