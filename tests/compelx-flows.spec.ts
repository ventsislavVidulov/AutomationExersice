import { test, expect } from '../fixtures';

test.describe('Complex E2E Integration Scenarios', () => {

    // 1. E2E-053: Guest Cart Merging (Complex Session)
    test('E2E-053: Guest to User Cart Merging', async ({ pm }) => {
        // 1. As Guest, add product (ID 2 - Men Tshirt)
        await pm.linkProducts().click();
        await pm.btnAddToCartID2().click();
        await pm.btnContinueShopping().click();

        // 2. Login
        await pm.loginUser(pm.credentials.registeredEmail, pm.credentials.registeredPassword);

        // 3. Go to Cart
        await pm.linkCartNavigation().click();

        // 4. Verify item exists associated with the account now
        await expect(pm.cartItemProduct2()).toBeVisible();
        await expect(pm.cartItemProduct2Name()).toContainText('Men Tshirt');
    });

    // 2. E2E-012: Cross-Category Cart Build
    test('E2E-012: Cross-Category Cart Composition', async ({ pm }) => {
        // 1. Add Women's Dress
        await pm.linkProducts().click();
        await pm.linkCategory('Women').click();
        await pm.linkSubCategory(1).click(); // Dress
        await pm.btnAddToCartFirst().click();
        await pm.btnContinueShopping().click();

        // 2. Add Men's Tshirt
        await pm.linkCategory('Men').click();
        await pm.linkSubCategory(3).click(); // Tshirt
        await pm.btnAddToCartFirst().click();
        await pm.btnContinueShopping().click();

        // 3. Verify Cart
        await pm.linkCartNavigation().click();
        await expect(pm.cartItemRows()).toHaveCount(2);
        // Replaced raw locator
        await expect(pm.cartTableBody()).toContainText('Women > Dress');
        await expect(pm.cartTableBody()).toContainText('Men > Tshirts');
    });

    // 3. E2E-024: Checkout Address Consistency (Data Integrity)
    test('E2E-024: Checkout Address Data Integrity', async ({ pm, page }) => {
        const uniqueEmail = `addr_${Date.now()}@test.com`;
        const uniqueAddr = '999 Unique Ave';

        // 1. Register new user with specific address
        await pm.registerUser('Addr Tester', uniqueEmail);
        await pm.fillAccountDetails('Password123!');
        await pm.inputFirstName().fill('Addr');
        await pm.inputLastName().fill('Tester');
        await pm.inputAddress1().fill(uniqueAddr); // Key Data
        await pm.selectCountry().selectOption('Canada');
        await pm.inputState().fill('Ontario');
        await pm.inputCity().fill('Toronto');
        await pm.inputZip().fill('M5V 2T6');
        await pm.inputMobile().fill('1234567890');
        await pm.btnCreateAccount().click();
        await pm.btnContinue().click();

        // 2. Add item and Checkout
        await pm.linkProducts().click();
        await pm.btnAddToCartFirst().click();
        await pm.btnViewCart().click();
        await pm.btnCheckout().click();

        // 3. Verify Address on Checkout Page
        await expect(pm.checkoutDeliveryAddress()).toContainText(uniqueAddr);
        await expect(pm.checkoutDeliveryAddress()).toContainText('Toronto');
        await expect(pm.checkoutDeliveryAddress()).toContainText('Canada');

        // Cleanup: Delete account to keep system clean
        await pm.linkDeleteAccount().click();
    });

    // 4. E2E-082: Cart Item Removal & Re-addition (State Resilience)
    test('E2E-082: Cart Removal and Re-addition Resilience', async ({ pm }) => {
        await pm.linkProducts().click();
        await pm.btnAddToCartFirst().click(); // Add Item A
        await pm.btnViewCart().click();

        // Remove Item A
        await pm.btnRemoveItem().click();
        await expect(pm.cartEmptyMessage()).toBeVisible();

        // Add Item A Again
        await pm.linkProducts().click();
        await pm.btnAddToCartFirst().click();
        await pm.btnViewCart().click();

        // Verify it's back with correct default quantity
        await expect(pm.cartItemRows()).toHaveCount(1);
        console.log(await pm.btnQuantity().innerText());

        expect(await pm.btnQuantity().innerText()).toBe('1');
    });

    // 5. E2E-045: Quantity Logic via Product Detail Page
    test('E2E-045: Product Detail Quantity Logic & Total', async ({ pm }) => {
        await pm.linkProducts().click();
        await pm.btnViewProductFromList(0).click(); // Go to PDP

        // Input Quantity 4
        await pm.inputQuantityPDP().fill('4');
        await pm.btnAddToCartPDP().click();
        await pm.btnViewCart().click();

        // Verify Quantity
        await expect(pm.btnQuantity()).toHaveText('4');

        // Verify Math: Unit Price * 4 = Total
        const unitPrice = await pm.getPriceValue(pm.cartItemPrices());
        const total = await pm.getPriceValue(pm.cartTotalPrice());

        expect(total).toBe(unitPrice * 4);
    });

    // 6. E2E-066: Contact Us Form Reset
    test('E2E-066: Contact Us Form State Reset', async ({ pm }) => {
        await pm.linkContact().click();

        // Fill and Submit
        await expect(pm.inputContactName()).toBeVisible();
        await pm.inputContactName().fill('Reset Test');
        await pm.inputContactEmail().fill('reset@test.com');
        await pm.inputContactSubject().fill('Subject');
        await pm.inputContactMessage().fill('Msg');
        await pm.btnSubmitContact().click();
        // Replaced raw page.waitForSelector with PM locator-specific wait
        await pm.alertContactSuccess().waitFor({ state: 'visible' });

        await expect(pm.alertContactSuccess()).toHaveText(
            'Success! Your details have been submitted successfully.'
        );

        // Navigate Away and Back
        await pm.btnSuccessHome().click();
        await expect(pm.getPageUrl()).toMatch('/');
        await pm.linkContact().click();

        // Verify Empty
        await expect(pm.inputContactName()).toBeEmpty();
        await expect(pm.inputContactMessage()).toBeEmpty();
    });

    // 7. E2E-058: Post-Order Navigation (Empty Cart Check)
    test('E2E-058: Post-Order Cart Cleansing', async ({ pm }) => {
        // Login
        await pm.loginUser(pm.credentials.registeredEmail, pm.credentials.registeredPassword);

        // Buy Item
        await pm.linkProducts().click();
        await pm.btnAddToCartFirst().click();
        await pm.btnViewCart().click();
        await pm.btnCheckout().click();
        await pm.textAreaComment().fill('Final test');
        await pm.btnPlaceOrder().click();
        await pm.fillPaymentDetails();

        // Order Confirmed
        await expect(pm.getPageUrl()).toMatch(/\/payment_done/);

        // Go Home then Cart
        await pm.goToHomePage();
        await pm.linkCartNavigation().click();

        // Verify Empty
        await expect(pm.cartEmptyMessage()).toBeVisible();
    });

    // 8. E2E-013: Review Form Validation (Flow Interruption)
    test('E2E-013: Review Form Validation Flow', async ({ pm }) => {
        await pm.linkProducts().click();
        await pm.btnViewProductFromList(0).click(); // PDP

        // 1. Attempt Submit Empty
        await pm.btnSubmitReview().click();
        // Verify no success message appeared.
        await expect(pm.alertReviewSuccess()).not.toBeVisible();

        // 2. Fill Partial (No Email)
        await pm.inputReviewName().fill('Tester');
        await pm.inputReviewText().fill('Great product');
        await pm.btnSubmitReview().click();
        await expect(pm.alertReviewSuccess()).not.toBeVisible();

        // 3. Fill All
        await pm.inputReviewEmail().fill('test@valid.com');
        await pm.btnSubmitReview().click();
        await expect(pm.alertReviewSuccess()).toBeVisible();
    });

    // 9. E2E-002: Cart Persistence After Logout/Login
    test('E2E-002: Cart Persistence Across Sessions', async ({ pm }) => {
        // 1. Login
        await pm.loginUser(pm.credentials.registeredEmail, pm.credentials.registeredPassword);

        // 2. Clear Cart (Cleanup first)
        await pm.linkCartNavigation().click();
        // Replaced raw locator
        const deleteBtns = await pm.btnRemoveItemAll().all();
        for (const btn of deleteBtns) { await btn.click(); }

        // 3. Add Item
        await pm.linkProducts().click();
        await pm.btnAddToCartFirst().click();
        await pm.btnContinueShopping().click();

        // 4. Logout
        await pm.linkLogout().click();

        // 5. Login Again
        await pm.loginUser(pm.credentials.registeredEmail, pm.credentials.registeredPassword);

        // 6. Verify Item Persisted
        await pm.linkCartNavigation().click();
        await expect(pm.cartItemRows()).toHaveCount(1);
    });

    // 10. E2E-075: Add to Cart via Overlay (Visual Flow)
    test('E2E-075: Add to Cart via Hover Overlay', async ({ pm }) => {
        await pm.goToHomePage(); // Home page
        // Replaced raw page.evaluate with PM helper
        await pm.scrollTo(500);

        // Product Card and Overlay Button use PM locators (Locator on Locator is fine)
        const productCard = pm.productCard(0);
        const overlayBtn = productCard.locator('.overlay-content .add-to-cart');

        // Force hover
        await productCard.hover();
        await expect(overlayBtn).toBeVisible();
        await overlayBtn.click();

        // Verify Modal
        await expect(pm.modalAdded()).toBeVisible();
        // Replaced raw locator
        await expect(pm.modalBody()).toContainText('Your product has been added to cart.');
    });

    // 11. E2E-100: Search Override Filter
    test('E2E-100: Search Overrides Brand Filter', async ({ pm }) => {
        await pm.linkProducts().click();

        // 1. Apply Filter (Polo)
        await pm.linkBrandPolo().click();
        // Replaced raw locator
        await expect(pm.h2PageTitle()).toContainText('Brand - Polo Products');

        // 2. Perform Search ('Dress')
        await pm.inputSearch().fill('Dress');
        await pm.btnSearch().click();

        // 3. Verify "Searched Products" title appears (overriding Brand title)
        // Replaced raw locator
        await expect(pm.h2PageTitle()).toContainText('Searched Products');
        const products = await pm.productsListWrapper().all();
        expect(products.length).toBeGreaterThan(0);
    });
});