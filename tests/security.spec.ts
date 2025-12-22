import { test, expect } from '../fixtures';

test.describe('Security & Vulnerability Suite', () => {

  // 1. SQL Injection (SQLi) in Login
  test('Authentication should resist SQL Injection attempts', async ({ pm }) => {
    await pm.nav.linkLogin().click();
    await pm.auth.loginUser("' OR '1'='1", "password123");
    
    // Verify we are not logged in (generic login text still present)
    await expect(pm.auth.h2LoginToAccount()).toBeVisible();
  });

  // 2. Cross-Site Scripting (XSS) in Reviews
  test('Product reviews should sanitize script tags', async ({ pm }) => {
    await pm.nav.goToProductDetails(1);
    const xssPayload = "<script>alert('xss')</script>";
    await pm.productDetails.submitReview("Hacker", "test@test.com", xssPayload);
    
    // Ensure the alert-success isn't the only check; verify script isn't executing
    await expect(pm.productDetails.alertReviewSuccess()).toBeVisible();
    const reviewSection = pm.page.locator('#review-section');
    await expect(reviewSection).not.toContainText(xssPayload); 
  });

  // 3. IDOR (Insecure Direct Object Reference)
  test('Direct URL access to non-existent products should fail gracefully', async ({ pm }) => {
    // Attempting to access a product ID that is out of bounds
    await pm.nav.goToProductDetails(99999);
    
    // Verify user is not on a valid product page (Check for 404 indicators)
    await expect(pm.page).not.toHaveTitle(/Product Details/);
    await expect(pm.productDetails.productPrice()).not.toBeVisible();
  });

  // 4. Brute Force Protection
  test('Repeated failed logins should trigger security response', async ({ pm }) => {
    await pm.nav.linkLogin().click();
    for (let i = 0; i < 5; i++) {
      await pm.auth.loginUser("victim@example.com", `wrong_pass_${i}`);
    }
    // Verify the user remains on the login page/receives error
    await expect(pm.auth.h2LoginToAccount()).toBeVisible();
  });

  // 5. Insecure File Upload
  test('Contact form should reject executable file uploads', async ({ pm }) => {
    await pm.nav.linkContact().click();
    
    // Attempting to upload a .js file instead of an image
    await pm.support.inputUploadFile().setInputFiles({
      name: 'malware.js',
      mimeType: 'application/javascript',
      buffer: Buffer.from('console.log("malicious code")')
    });
    
    await pm.support.btnSubmitContact().click();
    // In a secure system, success message should not appear for invalid extensions
    await expect(pm.support.alertContactSuccess()).not.toBeVisible();
  });

  // 6. Client-Side Price Manipulation
  test('Server should validate price regardless of client-side intercepts', async ({ pm, page }) => {
    await pm.nav.goToProductDetails(2);
    await pm.productDetails.btnAddToCart().click();
    await pm.nav.btnViewCart().click();

    // Intercept the checkout request to simulate a hacker changing the price
    await page.route('**/checkout', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        const payload = request.postDataJSON();
        payload.total_amount = "0.01"; 
        await route.continue({ postData: JSON.stringify(payload) });
      } else {
        await route.continue();
      }
    });

    await pm.cart.btnCheckout().click();
    // Verify order is not processed with manipulated price
    await expect(pm.page).not.toHaveURL(/payment_done/);
  });

  // 7. Session Hijacking (Logout Invalidation)
  test('Logout should invalidate the session token', async ({ pm }) => {
    await pm.nav.linkLogin().click();
    await pm.auth.loginUser("testuser@test.com", "password123");
    await pm.nav.linkLogout().click();

    // Attempt to access restricted area (Cart) after logout
    await pm.nav.linkCartNavigation().click();
    
    // Verify redirected back to login or session is cleared
    await expect(pm.nav.linkLogin()).toBeVisible();
    await expect(pm.nav.txtLoggedInAs()).not.toBeVisible();
  });

  // 8. CSRF Protection on Sensitive Actions
  test('Account deletion should require valid security tokens', async ({ pm, page }) => {
    await pm.nav.linkLogin().click();
    await pm.auth.loginUser("testuser@test.com", "password123");

    // Manually trigger a POST request without typical browser headers/tokens
    const response = await page.request.post('/delete_account', {
      data: { confirm: 'true' },
      headers: { 'Origin': 'http://malicious-site.com' }
    });
    
    // Expecting 403 Forbidden or similar
    expect(response.status()).not.toBe(200);
  });

  // 9. Weak Password Policy Enforcement
  test('Registration should reject common weak passwords', async ({ pm }) => {
    await pm.nav.linkLogin().click();
    await pm.auth.registerUser("SecTest", "sectest@test.com");
    
    // Using a notoriously weak password
    await pm.auth.inputPassword().fill("12345");
    await pm.auth.btnCreateAccount().click();
    
    // Should stay on the page or show validation error
    await expect(pm.auth.h2AccountCreated()).not.toBeVisible();
  });

  // 10. Technical Information Leakage
  test('Error messages should not leak server-side technical stack', async ({ pm }) => {
    await pm.nav.linkLogin().click();
    // Inject a character that often breaks weak backend logic to trigger an error
    await pm.auth.loginUser("~`#$%^&*()", "pass");
    
    const bodyContent = await pm.page.innerText('body');
    const sensitiveTerms = ['SQL', 'stack trace', 'Exception', 'Node.js', 'Express'];
    
    sensitiveTerms.forEach(term => {
      expect(bodyContent.toLowerCase()).not.toContain(term.toLowerCase());
    });
  });
});