import { test, expect } from '../fixtures';
import { validPaymentData } from '../testData/paymentData';
import { registeredUserCredentials } from '../testData/credentialsData';


test.describe('Complex E2E Integration Scenarios', () => {

    test.describe('Payment Parameterized Tests', () => {

        test('E2E-058: Post-Order Cart Cleansing', async ({ pm }) => {

            await pm.nav.linkLogin().click();
            await pm.auth.loginUser(registeredUserCredentials.email, registeredUserCredentials.password);

            // Buy Item
            await pm.nav.linkProducts().click();
            await pm.products.btnAddToCartNth(5).click();
            await pm.nav.btnViewCart().click();
            await pm.cart.btnCheckout().click();
            await pm.checkout.textAreaComment().fill('Final test');
            await pm.checkout.btnPlaceOrder().click();

            // FIX 4: Use the 'params' fixture here instead of the import
            await pm.payment.fillPaymentDetails(validPaymentData);

            // Order Confirmed
            await expect(pm.nav.getPageUrl()).toMatch(/\/payment_done/);

            // Go Home then Cart
            await pm.nav.goToHomePage();
            await pm.nav.linkCartNavigation().click();

            // Verify Empty
            await expect(pm.cart.cartEmptyMessage()).toBeVisible();
        });
    });

    // 1. E2E-053: Guest Cart Merging (Complex Session)
    test('E2E-053: Guest to User Cart Merging', async ({ pm }) => {
        // 1. As Guest, add product (ID 2 - Men Tshirt)
        await pm.nav.linkProducts().click();
        await pm.products.btnAddToCartNth(2).click();
        await pm.nav.btnContinueShopping().click();

        // 2. Login
        await pm.nav.linkLogin().click();
        await pm.auth.loginUser(registeredUserCredentials.email, registeredUserCredentials.password);

        // 3. Go to Cart
        await pm.nav.linkCartNavigation().click();

        // 4. Verify item exists associated with the account now
        await expect(pm.cart.cartItemProductByIndex(2)).toBeVisible();
        await expect(pm.cart.cartItemProductNameByIndex(2)).toContainText('Men Tshirt');
    });

    // 2. E2E-012: Cross-Category Cart Build
    test('E2E-012: Cross-Category Cart Composition', async ({ pm }) => {
        // 1. Add Women's Dress
        await pm.nav.linkProducts().click();
        await pm.products.linkCategory('Women').click();
        await pm.products.linkSubCategory(1).click(); // Dress
        await pm.products.btnAddToCartNth(3).click(); //TODO this first item from <Dress> category, maybe it is a good ide this index to come from some kind of test data object
        await pm.nav.btnContinueShopping().click();

        // 2. Add Men's Tshirt
        await pm.products.linkCategory('Men').click();
        await pm.products.linkSubCategory(3).click(); // Tshirt
        await pm.products.btnAddToCartNth(2).click(); //TODO this first item from <Men> category, maybe it is a good ide this index to come from some kind of test data object
        await pm.nav.btnContinueShopping().click();

        // 3. Verify Cart
        await pm.nav.linkCartNavigation().click();
        await expect(pm.cart.cartItemRows()).toHaveCount(2);
        await expect(pm.cart.cartTableBody()).toContainText('Women > Dress');
        await expect(pm.cart.cartTableBody()).toContainText('Men > Tshirts');
    });

    // 3. E2E-024: Checkout Address Consistency (Data Integrity)
    test('E2E-024: Checkout Address Data Integrity', async ({ pm }) => {

        // 1. Register new user with specific address
        await pm.nav.linkLogin().click();
        await pm.auth.loginUser(registeredUserCredentials.email, registeredUserCredentials.password);

        // 2. Add item and Checkout
        await pm.nav.linkProducts().click();
        await pm.products.btnAddToCartNth(1).click();
        await pm.nav.btnViewCart().click();
        await pm.cart.btnCheckout().click();

        // 3. Verify Address on Checkout Page
        await expect(pm.checkout.checkoutDeliveryAddress()).toContainText('Brahmaputra blv. 33');
        await expect(pm.checkout.checkoutDeliveryAddress()).toContainText('Vancover');
        await expect(pm.checkout.checkoutDeliveryAddress()).toContainText('Canada');
    });

    // 4. E2E-082: Cart Item Removal & Re-addition (State Resilience)
    test('E2E-082: Cart Removal and Re-addition Resilience', async ({ pm }) => {
        await pm.nav.linkProducts().click();
        await pm.products.btnAddToCartNth(1).click();
        await pm.nav.btnViewCart().click();

        // Remove Item
        await pm.cart.btnRemoveItem().click();
        await expect(pm.cart.cartEmptyMessage()).toBeVisible();

        // Add Item Again
        await pm.nav.linkProducts().click();
        await pm.products.btnAddToCartNth(1).click();
        await pm.nav.btnViewCart().click();

        // Verify it's back
        await expect(pm.cart.cartItemRows()).toHaveCount(1);
        expect(await pm.cart.btnQuantity().innerText()).toBe('1');
    });

    // 5. E2E-045: Quantity Logic via Product Detail Page
    test('E2E-045: Product Detail Quantity Logic & Total', async ({ pm }) => {
        await pm.nav.linkProducts().click();
        await pm.products.btnViewProductDetailsNth(34).click();

        // Input Quantity 4
        await pm.products.inputQuantityPDP().fill('4');
        await pm.products.btnAddToCartPDP().click();
        await pm.nav.btnViewCart().click();

        // Verify Quantity
        await expect(pm.cart.btnQuantity()).toHaveText('4');

        // Verify Math
        const total = await pm.cart.getPriceValue(pm.cart.cartTotalPrice());

        expect(total).toBe(5556);
    });

    // 6. E2E-066: Contact Us Form Reset
    test('E2E-066: Contact Us Form State Reset', async ({ pm }) => {
        await pm.nav.linkContact().click();

        // Fill and Submit
        await pm.support.inputContactName().fill('Reset Test');
        await pm.support.inputContactEmail().fill('reset@test.com');
        await pm.support.inputContactSubject().fill('Subject');
        await pm.support.inputContactMessage().fill('Msg');
        await pm.support.btnSubmitContact().click();

        await pm.support.alertContactSuccess().waitFor({ state: 'visible' });
        await expect(pm.support.alertContactSuccess()).toHaveText(
            'Success! Your details have been submitted successfully.'
        );

        // Navigate Away and Back
        await pm.auth.btnSuccessHome().click();
        await pm.nav.linkContact().click();

        // Verify Empty
        await expect(pm.support.inputContactName()).toBeEmpty();
        await expect(pm.support.inputContactMessage()).toBeEmpty();
    });

    // 8. E2E-013: Review Form Validation (Flow Interruption)
    test('E2E-013: Review Form Validation Flow', async ({ pm }) => {
        await pm.nav.linkProducts().click();
        await pm.products.btnViewProductDetailsNth(0).click();

        // 1. Attempt Submit Empty
        await pm.products.btnSubmitReview().click();
        await expect(pm.products.alertReviewSuccess()).not.toBeVisible();

        // 2. Fill Partial
        await pm.products.inputReviewName().fill('Tester');
        await pm.products.inputReviewText().fill('Great product');
        await pm.products.btnSubmitReview().click();
        await expect(pm.products.alertReviewSuccess()).not.toBeVisible();

        // 3. Fill All
        await pm.products.inputReviewEmail().fill('test@valid.com');
        await pm.products.btnSubmitReview().click();
        await expect(pm.products.alertReviewSuccess()).toBeVisible();
    });

    // 9. E2E-002: Cart Persistence After Logout/Login
    test('E2E-002: Cart Persistence Across Sessions', async ({ pm }) => {

        await pm.nav.linkLogin().click();

        // 1. Login 

        await pm.auth.loginUser(registeredUserCredentials.email, registeredUserCredentials.password);

        // 2. Clear Cart
        await pm.nav.linkCartNavigation().click();
        const deleteBtns = await pm.cart.btnRemoveItemAll().all();
        for (const btn of deleteBtns) { await btn.click(); }

        // 3. Add Item
        await pm.nav.linkProducts().click();
        await pm.products.btnAddToCartNth(1).click();
        await pm.nav.btnContinueShopping().click();

        // 4. Logout
        await pm.nav.linkLogout().click();

        // 5. Login Again
        await pm.auth.loginUser(registeredUserCredentials.email, registeredUserCredentials.password);

        // 6. Verify Persisted
        await pm.nav.linkCartNavigation().click();
        await expect(pm.cart.cartItemRows()).toHaveCount(1);
    });

    // 10. E2E-075: Add to Cart via Overlay (Visual Flow)
    test('E2E-075: Add to Cart via Hover Overlay', async ({ pm }) => {
        await pm.nav.goToHomePage();
        await pm.products.scrollTo(500);

        const productCard = pm.products.productCard(1);
        const overlayBtn = productCard.locator('.overlay-content .add-to-cart');

        await productCard.hover();
        await expect(overlayBtn).toBeVisible();
        await overlayBtn.click();

        // Verify Modal
        await expect(pm.nav.modalAdded()).toBeVisible();
        await expect(pm.nav.modalBody()).toContainText('Your product has been added to cart.');
    });

    // 11. E2E-100: Search Override Filter
    test('E2E-100: Search Overrides Brand Filter', async ({ pm }) => {
        await pm.nav.linkProducts().click();

        // 1. Apply Filter (Polo)
        await pm.products.linkBrandPolo().click();
        await expect(pm.products.h2PageTitle()).toContainText('Brand - Polo Products');

        // 2. Perform Search ('Dress')
        await pm.products.inputSearch().fill('Dress');
        await pm.products.btnSearch().click();

        // 3. Verify Overriding Brand title
        await expect(pm.products.h2PageTitle()).toContainText('Searched Products');
        const products = await pm.products.productsListWrapper().all();
        expect(products.length).toBeGreaterThan(0);
    });
});