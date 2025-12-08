import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import * as fs from 'fs';
import * as path from 'path';

let pm: PageManager;
let randomEmail: string;
let password: string;

// Load shared state if available, but some tests will generate fresh users
test.beforeAll(async () => {
    try {
        const statePath = path.join(__dirname, '..', 'shared-state.json');
        if (fs.existsSync(statePath)) {
            const sharedState = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
            randomEmail = sharedState.randomEmail;
            password = sharedState.password;
        }
    } catch (e) {
        console.log('Shared state not found, some tests might skip or fail if dependent.');
    }
});

test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await pm.acceptNextDialog();
    try {
        await pm.btnConsent().waitFor({ state: 'visible', timeout: 5000 });
        await pm.btnConsent().click();
    } catch (e) { }
});

test.describe('Complex E2E Integration Scenarios', () => {

    // 1. E2E-053: Guest Cart Merging (Complex Session)
    // Scenario: Guest adds item -> Login -> Verify Item is NOT lost (it merges)
    test('E2E-053: Guest to User Cart Merging', async ({ page }) => {
        // 1. As Guest, add product (ID 2 - Men Tshirt)
        await pm.linkProducts().click();
        await page.locator('a[data-product-id="2"]').first().click();
        await pm.btnContinueShopping().click();

        // 2. Login
        await pm.linkLogin().click();
        await pm.inputLoginEmail().fill(randomEmail);
        await pm.inputLoginPassword().fill(password);
        await pm.btnLogin().click();

        // 3. Go to Cart
        await pm.linkCartNavigation().click();

        // 4. Verify item exists associated with the account now
        await expect(page.locator('#product-2')).toBeVisible();
        await expect(page.locator('#product-2 h4')).toContainText('Men Tshirt');
    });

    // 2. E2E-012: Cross-Category Cart Build
    // Scenario: Add items from different categories -> Verify Cart Composition
    test('E2E-012: Cross-Category Cart Composition', async ({ page }) => {
        // 1. Add Women's Dress
        await pm.linkProducts().click();
        await pm.linkCategory('Women').click();
        await pm.linkSubCategory(1).click(); // Dress
        await page.locator('.add-to-cart').first().click();
        await pm.btnContinueShopping().click();

        // 2. Add Men's Tshirt
        await pm.linkCategory('Men').click();
        await pm.linkSubCategory(3).click(); // Tshirt
        await page.locator('.add-to-cart').first().click();
        await pm.btnContinueShopping().click();

        // 3. Verify Cart
        await pm.linkCartNavigation().click();
        await expect(page.locator('tbody tr')).toHaveCount(2);
        // Verify specific descriptions to ensure correct items
        await expect(page.locator('tbody')).toContainText('Women > Dress');
        await expect(page.locator('tbody')).toContainText('Men > Tshirts');
    });

    // 3. E2E-024: Checkout Address Consistency (Data Integrity)
    // Scenario: Register -> Checkout -> Verify Delivery Address matches Registration
    test('E2E-024: Checkout Address Data Integrity', async ({ page }) => {
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
        await page.locator('[data-qa="continue-button"]').click();

        // 2. Add item and Checkout
        await pm.linkProducts().click();
        await page.locator('.add-to-cart').first().click();
        await pm.btnViewCart().click();
        await page.locator('.check_out').click();

        // 3. Verify Address on Checkout Page
        await expect(pm.checkoutDeliveryAddress()).toContainText(uniqueAddr);
        await expect(pm.checkoutDeliveryAddress()).toContainText('Toronto');
        await expect(pm.checkoutDeliveryAddress()).toContainText('Canada');

        // Cleanup: Delete account to keep system clean
        await pm.linkDeleteAccount().click();
    });

    // 4. E2E-082: Cart Item Removal & Re-addition (State Resilience)
    // Scenario: Remove item -> Add same item back -> Verify State
    test('E2E-082: Cart Removal and Re-addition Resilience', async ({ page }) => {
        await pm.linkProducts().click();
        await page.locator('.add-to-cart').first().click(); // Add Item A
        await pm.btnViewCart().click();

        // Remove Item A
        await pm.btnRemoveItem().click();
        await expect(pm.cartEmptyMessage()).toBeVisible();

        // Add Item A Again
        await pm.linkProducts().click();
        await page.locator('.add-to-cart').first().click();
        await pm.btnViewCart().click();

        // Verify it's back with correct default quantity
        await expect(page.locator('#cart_info_table tbody tr')).toHaveCount(1);
        console.log(await pm.btnQuantity().innerText());

        expect(await pm.btnQuantity().innerText()).toBe('1');
    });

    // 5. E2E-045: Quantity Logic via Product Detail Page
    // Scenario: Input high quantity -> Add -> Verify Calculation
    test('E2E-045: Product Detail Quantity Logic & Total', async ({ page }) => {
        await pm.linkProducts().click();
        await page.locator('.choose a').first().click(); // Go to PDP

        // Input Quantity 4
        await page.locator('#quantity').fill('4');
        await page.locator('button.cart').click();
        await pm.btnViewCart().click();

        // Verify Quantity
        await expect(pm.btnQuantity()).toHaveText('4');

        // Verify Math: Unit Price * 4 = Total
        const unitPrice = await pm.getPriceValue(pm.cartItemPrices());
        const total = await pm.getPriceValue(pm.cartTotalPrice());

        expect(total).toBe(unitPrice * 4);
    });

    // 6. E2E-066: Contact Us Form Reset
    // Scenario: Submit Form -> Navigate Home -> Navigate Back -> Verify Empty
    test('E2E-066: Contact Us Form State Reset', async ({ page }) => {
        await pm.linkContact().click();

        // Fill and Submit - Playwright's auto-waiting makes timeout unnecessary.
        // We can wait for a specific element to be visible to ensure the page is ready.
        await page.waitForTimeout(500);
        // await pm.acceptNextDialog();
        await expect(pm.inputContactName()).toBeVisible();
        await pm.inputContactName().fill('Reset Test');
        await pm.inputContactEmail().fill('reset@test.com');
        await pm.inputContactSubject().fill('Subject');
        await pm.inputContactMessage().fill('Msg');
        await pm.btnSubmitContact().click();
        await page.waitForSelector('.alert-success');

        await expect(page.locator('.alert-success').first()).toHaveText(
            'Success! Your details have been submitted successfully.'
        );

        // Navigate Away and Back
        await page.locator('a.btn-success').click(); // Click Home button in success message
        await expect(page).toHaveURL('/');
        await pm.linkContact().click();

        // Verify Empty
        await expect(pm.inputContactName()).toBeEmpty();
        await expect(pm.inputContactMessage()).toBeEmpty();
    });

    // 7. E2E-058: Post-Order Navigation (Empty Cart Check)
    // Scenario: Complete Checkout -> Go Home -> Check Cart is Empty
    test('E2E-058: Post-Order Cart Cleansing', async ({ page }) => {
        // Login
        await pm.loginUser(randomEmail, password);

        // Buy Item
        await pm.linkProducts().click();
        await page.locator('.add-to-cart').first().click();
        await pm.btnViewCart().click();
        await page.locator('.check_out').click();
        await pm.textAreaComment().fill('Final test');
        await pm.btnPlaceOrder().click();
        await pm.fillPaymentDetails();

        // Order Confirmed
        await expect(page).toHaveURL(/\/payment_done/);

        // Go Home then Cart
        await page.goto('/');
        await pm.linkCartNavigation().click();

        // Verify Empty
        await expect(pm.cartEmptyMessage()).toBeVisible();
    });

    // 8. E2E-013: Review Form Validation (Flow Interruption)
    // Scenario: Submit Empty -> Verify Required -> Fill -> Submit
    test('E2E-013: Review Form Validation Flow', async ({ page }) => {
        await pm.linkProducts().click();
        await page.locator('.choose a').first().click(); // PDP

        // 1. Attempt Submit Empty
        await pm.btnSubmitReview().click();
        // Playwright cannot easily capture native HTML5 validation bubbles, 
        // but we can verify we are still on the same page and no success message appeared.
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
    // Scenario: Login -> Add Item -> Logout -> Login -> Verify Item
    test('E2E-002: Cart Persistence Across Sessions', async ({ page }) => {
        // 1. Login
        await pm.loginUser(randomEmail, password);

        // 2. Clear Cart (Cleanup first)
        await pm.linkCartNavigation().click();
        const deleteBtns = await page.locator('.cart_quantity_delete').all();
        for (const btn of deleteBtns) { await btn.click(); await page.waitForTimeout(500); }

        // 3. Add Item
        await pm.linkProducts().click();
        await page.locator('.add-to-cart').first().click();
        await pm.btnContinueShopping().click();

        // 4. Logout
        await pm.linkLogout().click();

        // 5. Login Again
        await pm.loginUser(randomEmail, password);

        // 6. Verify Item Persisted
        await pm.linkCartNavigation().click();
        await expect(page.locator('#cart_info_table tbody tr')).toHaveCount(1);
    });

    // 10. E2E-075: Add to Cart via Overlay (Visual Flow)
    // Scenario: Hover -> Click Overlay Button -> Verify Modal
    test('E2E-075: Add to Cart via Hover Overlay', async ({ page }) => {
        await page.goto('/'); // Home page
        await page.evaluate(() => window.scrollTo(0, 500)); // Scroll to items

        const productCard = page.locator('.single-products').first();
        const overlayBtn = productCard.locator('.overlay-content .add-to-cart');

        // Force hover
        await productCard.hover();
        await expect(overlayBtn).toBeVisible();
        await overlayBtn.click();

        // Verify Modal
        await expect(pm.modalAdded()).toBeVisible();
        await expect(page.locator('.modal-body')).toContainText('Your product has been added to cart.');
    });

    // 11. E2E-100: Search Override Filter
    // Scenario: Filter Brand -> Search -> Verify Search overrides Filter
    test('E2E-100: Search Overrides Brand Filter', async ({ page }) => {
        await pm.linkProducts().click();

        // 1. Apply Filter (Polo)
        await pm.linkBrandPolo().click();
        await expect(page.locator('h2.title')).toContainText('Brand - Polo Products');

        // 2. Perform Search ('Dress')
        await pm.inputSearch().fill('Dress');
        await pm.btnSearch().click();

        // 3. Verify "Searched Products" title appears (overriding Brand title)
        // And results are likely > 0 if dresses exist
        await expect(page.locator('h2.title')).toContainText('Searched Products');
        const products = await page.locator('.product-image-wrapper').all();
        expect(products.length).toBeGreaterThan(0);
    });

});