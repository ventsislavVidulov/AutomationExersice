import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

test.describe('Automation Exercise Full E2E Coverage', () => {
  let pm: PageManager;
  // Generate random email for unique registration
  const randomEmail = `qa_engineer_${Date.now()}@test.com`;
  const password = 'Password123!';

test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    
    // Change: Add { waitUntil: 'domcontentloaded' }
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // If the consent button is slow to appear, this might fail. 
    // It's safer to check if it's visible first:
    try {
      // Wait only 2 seconds for consent, if not there, move on
      await pm.btnConsent().waitFor({ state: 'visible', timeout: 2000 });
      await pm.btnConsent().click();
    } catch (e) {
      console.log('Consent button did not appear or was not needed.');
    }
  });

  // Covers E2E-001, ACNT-001 to ACNT-009
  test('E2E-001: Full User Registration Flow', async ({ page }) => {
    pm.registerUser('John Doe', randomEmail);

    // Assert Account Info Page Loaded
    await expect(page).toHaveTitle(/Signup/);
    await expect(pm.inputPassword()).toBeVisible();

    // Fill details
    await pm.fillAccountDetails(password);
    await pm.fillAddressDetails();

    // Handle "Account Created" (assuming flow based on standard behavior)
    await expect(page.locator('h2[data-qa="account-created"]')).toBeVisible();
    await page.locator('[data-qa="continue-button"]').click();

    // Verify Logged In
    await expect(page.locator('text=Logged in as John Doe')).toBeVisible();
  });


  // Covers E2E-061, E2E-062, E2E-071
  test('E2E-061: Contact Us Form with File Upload', async ({ page }) => {
    await pm.linkContact().click();
    await expect(page).toHaveTitle(/Contact Us/);

    // Quick and dirty fix
    await page.waitForTimeout(500);

    await pm.inputContactName().fill('QA Tester');
    await pm.inputContactEmail().fill('test@test.com');
    await pm.inputContactSubject().fill('E2E Testing Subject');
    await pm.inputContactMessage().fill('This is a test message.');

    // File Upload handling
    await pm.inputUploadFile().setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('this is test data')
    });

    // Set up the dialog listener BEFORE the action that triggers it.
    await pm.acceptNextDialog();
    await pm.btnSubmitContact().click();

    // // 1. Start waiting for the dialog event.
    // const dialogPromise = page.waitForEvent('dialog');

    // // 2. Perform the action that triggers the dialog (Run in parallel).
    // await pm.btnSubmitContact().click();

    // // 3. Resolve the dialog event and accept it.
    // const dialog = await dialogPromise;
    // await dialog.accept(); // Or dialog.dismiss() if needed

    // Verify Success Message
    await expect(page.locator('h2 + div.alert-success')).toContainText('Success! Your details have been submitted successfully.');
  });

  // test('E2E-061: Contact Us Form with File Upload', async ({ page }) => {
  //   // Navigate and check title
  //   await pm.linkContact().click();
  //   await expect(page).toHaveTitle(/Contact Us/);

  //   await page.waitForTimeout(500);

  //   // Fill form fields
  //   await pm.inputContactName().fill('QA Tester');
  //   await pm.inputContactEmail().fill('test@test.com');
  //   await pm.inputContactSubject().fill('E2E Testing Subject');
  //   await pm.inputContactMessage().fill('This is a test message.');

  //   // 1. Robust File Upload: Wait for the element to be ready
  //   await expect(pm.inputUploadFile()).toBeVisible();
  //   await pm.inputUploadFile().setInputFiles({
  //     name: 'test.txt',
  //     mimeType: 'text/plain',
  //     buffer: Buffer.from('this is test data')
  //   });

  //   // 2. Robust Dialog Handling: Wait for the event, then click
  //   const dialogPromise = page.waitForEvent('dialog'); // Start waiting for the dialog

  //   // Trigger the dialog

  //   await page.waitForTimeout(500);

  //   await pm.btnSubmitContact().click();

  //   // Handle the dialog and accept
  //   const dialog = await dialogPromise;
  //   console.log(`Dialog opened: ${dialog.message()}`);
  //   await dialog.accept();

  //   // 3. Robust Success Verification
  //   const successLocator = page.locator('h2 + div.alert-success');
  //   await expect(successLocator).toBeVisible();
  //   await expect(successLocator).toContainText('Success! Your details have been submitted successfully.');
  // });

  // Covers PRD-001, PRD-003, E2E-011
  test('PRD-001: Search Product and Add to Cart', async ({ page }) => {
    await pm.linkProducts().click();
    await expect(page).toHaveTitle(/All Products/);

    // Search
    await pm.inputSearch().fill('Blue Top');
    await pm.btnSearch().click();

    // Verify Search Results
    await expect(page.locator('.features_items')).toContainText('Searched Products');
    await expect(page.locator('.productinfo p').first()).toContainText('Blue Top');

    // Add to Cart (Handling the Hover Overlay logic you mentioned)
    // Since Playwright can click hidden elements or force hover
    await page.hover('.product-image-wrapper');
    await page.locator('.overlay-content .add-to-cart').first().click();

    // Verify Modal
    await expect(pm.modalAdded()).toBeVisible();
    await pm.btnContinueShopping().click();
  });

  // Covers CART-001, CART-002, E2E-021
  test('CART-001: Verify Cart and Checkout Flow', async ({ page }) => {
    // 1. Add item to cart
    await pm.linkProducts().click();
    await page.locator('.add-to-cart').first().click();
    await pm.btnViewCart().click();

    // 2. Verify Cart URL
    await expect(page).toHaveURL(/\/view_cart/);

    // 3. Proceed to Checkout (Logic for Modal if not logged in)
    await page.locator('.check_out').click();

    // Expect Modal because we didn't login in this test instance
    await expect(page.locator('#checkoutModal')).toBeVisible();

    // Click Register/Login in modal
    await page.locator('#checkoutModal u').click();
    await expect(page).toHaveURL(/\/login/);
  });

  // Covers E2E-006, E2E-020
  test('E2E-020: Empty Cart Check', async ({ page }) => {
    await pm.linkCartNavigation().click();
    // Based on your HTML: <span id="empty_cart" style="display: none;">
    // If cart is empty, this should be visible.
    // Note: This depends on app state. If fresh session, cart is empty.
    await expect(page.locator('#empty_cart')).toBeVisible();
  });

// Covers E2E-009: Subscription
  test('E2E-009: Footer Subscription', async ({ page }) => {
    
    // OLD LINE (causing error):
    // await page.goto('/');

    // NEW LINE (The Fix):
    await page.goto('/', { waitUntil: 'domcontentloaded' }); 

    await page.locator('#susbscribe_email').scrollIntoViewIfNeeded();
    
    // Pro Tip: Use a random email to avoid "already subscribed" issues in repeated tests
    const randomEmail = `sub_${Date.now()}@test.com`; 
    await page.locator('#susbscribe_email').fill(randomEmail);
    
    await page.locator('#subscribe').click();
    
    await expect(page.locator('#success-subscribe')).toBeVisible();
    await expect(page.locator('#success-subscribe')).toContainText('You have been successfully subscribed!');
  });

  // Covers E2E-004: Register with existing email
  test('E2E-004: Negative Registration (Existing Email)', async ({ page }) => {
    // Attempt to register with a known email (assuming 'johndoesecond@johndoe.com' exists from your HTML)
    await pm.registerUser('Duplicate User', 'johndoesecond@johndoe.com');

    // Expect error message (Inferred selector based on standard behavior)
    await expect(page.locator('form[action="/signup"] p')).toContainText('Email Address already exist!');
  });

  // Covers E2E-059: Responsive Design
  test('E2E-059: Verify Mobile Viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');

    // Verify the carousel indicators are visible or layout changed
    // Note: Specific assertion depends on CSS, checking visual regression here is usually best
    // But we can check if the logo is centered or menu is collapsed
    await expect(page.locator('.logo')).toBeVisible();
  });

  // Covers LOG-001, LOG-002, E2E-005
  test('LOG-001: Login with Valid Credentials', async ({ page }) => {
    // Note: In a real scenario, we'd use API to create user first, 
    // but here we assume the user from the previous test exists or we mock it.

    // Quick and dirty fix
    await pm.loginUser('johndoeseventh@johndoe.com', 'password');
    await expect(page.locator('text=Logged in as')).toBeVisible();
    await expect(page.locator('text=Jhon Doe')).toBeVisible();
  });

  // 1. LOG-002: Logout User
  test('LOG-002: Logout User', async ({ page }) => {
    // Prerequisite: Login first
    await pm.loginUser('johndoeseventh@johndoe.com', 'password');
    await expect(page.locator('text=Logged in as')).toBeVisible();

    // Action: Logout
    await pm.linkLogout().click();

    // Assertion: Verify redirection to Login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=Login to your account')).toBeVisible();
  });

  // 2. PRD-005: Filter by Category (Women > Dress)
  test('PRD-005: Filter Products by Category', async ({ page }) => {
    await pm.linkProducts().click();
    
    // Action: Expand 'Women' and click 'Dress'
    await pm.panelWomen().click();
    // Wait for animation if necessary, Playwright auto-waits for visibility
    await pm.linkSubCategoryDress().click();

    // Assertion: Check URL and Page Title
    await expect(page).toHaveURL(/\/category_products\/1/);
    await expect(page.locator('.features_items h2')).toContainText('Women - Dress Products');
  });

  // 3. PRD-010: Filter by Brand (Polo)
  test('PRD-010: Filter Products by Brand', async ({ page }) => {
    await pm.linkProducts().click();

    // Action: Click Brand 'Polo'
    await pm.linkBrandPolo().click();

    // Assertion: Check URL and Header
    await expect(page).toHaveURL(/\/brand_products\/Polo/);
    await expect(page.locator('.features_items h2')).toContainText('Brand - Polo Products');
  });

  // 4. PD-005: Submit Product Review
  test('PD-005: Submit Product Review', async ({ page }) => {
    await pm.linkProducts().click();
    await page.locator('.choose a').first().click(); // Click 'View Product' on first item

    // Action: Fill Review
    await pm.submitReview('QA Tester', 'test@test.com', 'This is a high quality product.');

    // Assertion: Verify Success Message (Note: Your HTML uses JS to show/hide this)
    await expect(pm.alertReviewSuccess()).toBeVisible();
    await expect(pm.alertReviewSuccess()).toContainText('Thank you for your review');
  });

  // 5. CART-003: Remove Product From Cart
  test('CART-003: Remove Product From Cart', async ({ page }) => {
    // Prerequisite: Add item to cart
    await pm.linkProducts().click();
    await page.locator('.add-to-cart').first().click();
    await pm.btnViewCart().click();

    // Action: Click 'X' button
    await pm.btnRemoveItem().click();

    // Assertion: Verify item row is gone or cart is empty
    // Based on your HTML logic, if it was the only item, empty_cart span appears
    await expect(pm.cartEmptyMessage()).toBeVisible();
    await expect(pm.cartEmptyMessage()).toContainText('Cart is empty!');
  });

  // 6. PD-001: Verify Product Details (Data Integrity)
  test('PD-001: Verify Product Details Integrity', async ({ page }) => {
    await pm.linkProducts().click();
    
    // Get text from the list to compare later
    const listPrice = await page.locator('.productinfo h2').first().innerText();
    
    // Go to details
    await page.locator('.choose a').first().click();

    // Assertion: Verify Price matches and Availability is visible
    await expect(pm.productPrice()).toHaveText(listPrice);
    await expect(pm.productAvailability()).toBeVisible();
    await expect(pm.productAvailability()).toContainText('In Stock');
  });

  // 7. PRD-002: Negative Search (Product Not Found)
  test('PRD-002: Negative Search Results', async ({ page }) => {
    await pm.linkProducts().click();

    // Action: Search for garbage text
    await pm.inputSearch().fill('NonExistentItem12345');
    await pm.btnSearch().click();

    // Assertion: Check that no products are displayed or specific message appears
    // Note: Depends on how your site handles 0 results. 
    // Usually, the product list is empty or "searched products" header exists but no grid.
    const products = page.locator('.product-image-wrapper');
    await expect(products).toHaveCount(0); 
  });

  // 8. E2E-017: Add Recommended Item to Cart
  test('E2E-017: Add Recommended Item to Cart', async ({ page }) => {
    // Action: Scroll to bottom (Recommended items are usually in footer area)
    await pm.carouselRecommended().scrollIntoViewIfNeeded();

    // Click 'Add to cart' in the recommended section
    // We use .first() because the carousel clones items for the slider effect
    await pm.btnAddRecommended().click();

    // Assertion: Confirm Modal appears
    await expect(pm.modalAdded()).toBeVisible();
    
    // View Cart and verify
    await pm.btnViewCart().click();
    await expect(page).toHaveURL(/\/view_cart/);
    await expect(page.locator('#cart_info_table tbody tr')).toHaveCount(1);
  });

  // 9. E2E-031: Subscription from Cart Page
  test('E2E-031: Verify Subscription in Cart Page', async ({ page }) => {
    await pm.linkCartNavigation().click();

    // Action: Fill subscription in footer
    const email = `sub_${Date.now()}@test.com`;
    await page.locator('#susbscribe_email').fill(email);
    await page.locator('#subscribe').click();

    // Assertion
    await expect(page.locator('#success-subscribe')).toBeVisible();
    await expect(page.locator('#success-subscribe')).toContainText('You have been successfully subscribed!');
  });

  // 10. HOME-009: View Product Button from Home Page
  test('HOME-009: View Product Button Navigation', async ({ page }) => {
    // Action: Find "View Product" button for the 3rd item (e.g., Sleeveless Dress)
    // Using nth(2) because indices start at 0
    await page.locator('.choose a').nth(2).click();

    // Assertion: Verify URL contains product details
    await expect(page).toHaveURL(/\/product_details\/3/); // ID 3 based on your HTML
    await expect(page.locator('.product-information h2')).toBeVisible();
  });
});

