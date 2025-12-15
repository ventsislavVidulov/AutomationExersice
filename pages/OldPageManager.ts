// pages/PageManager.ts
import { Page, Locator, expect } from '@playwright/test';

export class PageManager {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- LOCATORS BASED ON YOUR HTML ---

  // Consent window

  readonly btnConsent = () => this.page.getByRole('button').filter({ hasText: 'Consent' });

  // Navigation
  readonly linkLogin = () => this.page.locator('a[href="/login"]');
  readonly linkProducts = () => this.page.locator('li a[href="/products"]');
  readonly linkCartNavigation = () => this.page.locator('header a[href="/view_cart"]');
  readonly linkContact = () => this.page.locator('a[href="/contact_us"]');
  readonly linkLogout = () => this.page.locator('a[href="/logout"]');
  readonly linkDeleteAccount = () => this.page.locator('a[href="/delete_account"]');

  // Login/Signup Page
  readonly inputSignupName = () => this.page.locator('[data-qa="signup-name"]');
  readonly inputSignupEmail = () => this.page.locator('[data-qa="signup-email"]');
  readonly btnSignup = () => this.page.locator('[data-qa="signup-button"]');
  readonly inputLoginEmail = () => this.page.locator('[data-qa="login-email"]');
  readonly inputLoginPassword = () => this.page.locator('[data-qa="login-password"]');
  readonly btnLogin = () => this.page.locator('[data-qa="login-button"]');

  // Account Creation Page
  readonly radioMr = () => this.page.locator('#id_gender1');
  readonly inputPassword = () => this.page.locator('[data-qa="password"]');
  readonly selectDay = () => this.page.locator('#days');
  readonly selectMonth = () => this.page.locator('#months');
  readonly selectYear = () => this.page.locator('#years');
  readonly checkNewsletter = () => this.page.locator('#newsletter');
  readonly checkOptin = () => this.page.locator('#optin');

  // Address Info
  readonly inputFirstName = () => this.page.locator('[data-qa="first_name"]');
  readonly inputLastName = () => this.page.locator('[data-qa="last_name"]');
  readonly inputAddress1 = () => this.page.locator('[data-qa="address"]');
  readonly selectCountry = () => this.page.locator('[data-qa="country"]');
  readonly inputState = () => this.page.locator('[data-qa="state"]');
  readonly inputCity = () => this.page.locator('[data-qa="city"]');
  readonly inputZip = () => this.page.locator('[data-qa="zipcode"]');
  readonly inputMobile = () => this.page.locator('[data-qa="mobile_number"]');
  readonly btnCreateAccount = () => this.page.locator('[data-qa="create-account"]');

  // Products & Cart
  readonly inputSearch = () => this.page.locator('#search_product');
  readonly btnSearch = () => this.page.locator('#submit_search');
  readonly modalAdded = () => this.page.locator('#cartModal');
  readonly btnContinueShopping = () => this.page.locator('.close-modal');
  readonly btnViewCart = () => this.page.locator('u:has-text("View Cart")');

  // Contact Us
  readonly inputContactName = () => this.page.locator('[data-qa="name"]');
  readonly inputContactEmail = () => this.page.locator('[data-qa="email"]');
  readonly inputContactSubject = () => this.page.locator('[data-qa="subject"]');
  readonly inputContactMessage = () => this.page.locator('[data-qa="message"]');
  readonly inputUploadFile = () => this.page.locator('input[name="upload_file"]');
  readonly btnSubmitContact = () => this.page.locator('[data-qa="submit-button"]');

  // --- NEW LOCATORS (Add these to PageManager.ts) ---

  // Product Details & Review
  readonly inputReviewName = () => this.page.locator('#name');
  readonly inputReviewEmail = () => this.page.locator('#email');
  readonly inputReviewText = () => this.page.locator('#review');
  readonly btnSubmitReview = () => this.page.locator('#button-review');
  readonly alertReviewSuccess = () => this.page.locator('#review-section .alert-success');
  readonly productPrice = () => this.page.locator('.product-information span span').first();
  readonly productAvailability = () => this.page.locator('.product-information p:has-text("Availability:")');

  // Sidebar Filters
  readonly linkCategoryWomen = () => this.page.locator('#accordian href="#Women"'); // Adjust selector based on panel structure
  // Better strategy for accordion:
  readonly panelWomen = () => this.page.locator('.panel-title a[href="#Women"]');
  readonly linkSubCategoryDress = () => this.page.locator('div#Women ul li a[href="/category_products/1"]');
  readonly linkBrandPolo = () => this.page.locator('.brands-name a[href="/brand_products/Polo"]');

  // Cart Actions
  readonly btnRemoveItem = () => this.page.locator('.cart_quantity_delete').first();
  readonly cartEmptyMessage = () => this.page.locator('#empty_cart');

  // Recommended Items
  readonly carouselRecommended = () => this.page.locator('#recommended-item-carousel');
  // Locator for "Add to cart" specifically inside the recommended items active item
  readonly btnAddRecommended = () => this.page.locator('.recommended_items .active .add-to-cart').first();


  // --- NEW LOCATORS (Add these to PageManager.ts) ---

  // Checkout Page
  readonly textAreaComment = () => this.page.locator('textarea[name="message"]');
  readonly btnPlaceOrder = () => this.page.locator('a:has-text("Place Order")');

  // Payment Page (Assuming Mock Payment Form from your HTML)
  readonly inputCardName = () => this.page.locator('[data-qa="name-on-card"]');
  readonly inputCardNumber = () => this.page.locator('[data-qa="card-number"]');
  readonly inputCVC = () => this.page.locator('[data-qa="cvc"]');
  readonly inputExpiryMonth = () => this.page.locator('[data-qa="expiry-month"]');
  readonly inputExpiryYear = () => this.page.locator('[data-qa="expiry-year"]');
  readonly btnPayConfirm = () => this.page.locator('[data-qa="pay-button"]');

  // Account Deletion/Confirmation
  readonly h2AccountDeleted = () => this.page.locator('h2[data-qa="account-deleted"]');
  readonly orderConfirmationMessage = () => this.page.locator('.col-sm-9 p').first();

  // Cart Data Locators
  readonly btnQuantity = (itemIndex = 0) => this.page.locator('button.disabled').nth(itemIndex);
  readonly inputQuantity = (itemIndex = 0) => this.page.locator('input.cart_quantity_input').nth(itemIndex);
  readonly cartTotalPrice = () => this.page.locator('#cart_info_table .cart_total_price');
  readonly cartItemPrices = () => this.page.locator('#cart_info_table .cart_price');

  // Add these inside your PageManager class in pages/PageManager.ts

  // --- NEW LOCATORS FOR COMPLEX FLOWS ---

  // Dynamic Category & Subcategory Selection
  // Example usage: await pm.linkCategory('Men').click();
  readonly linkCategory = (category: string) => this.page.locator(`.panel-title a[href="#${category}"]`);
  readonly linkSubCategory = (categoryId: number) => this.page.locator(`a[href="/category_products/${categoryId}"]`);

  // Checkout Address Verification Locators
  readonly checkoutDeliveryAddress = () => this.page.locator('#address_delivery');
  readonly checkoutBillingAddress = () => this.page.locator('#address_invoice');

  // Review Form
  readonly reviewForm = () => this.page.locator('#review-form');

  // --- NEW HELPER METHODS ---

  /**
   * Helper to parse price string "$ 500" or "Rs. 500" to number 500
   */
  async getPriceValue(locator: Locator): Promise<number> {
    const text = await locator.innerText();
    return parseFloat(text.replace(/[^0-9.]|(?<!\d)\./g, ''));
  }

  /**
   * Helper to verify address text exists in the checkout address box
   */
  async verifyAddressDetails(container: Locator, addressLine: string) {
    await expect(container).toContainText(addressLine);
  }


  /**
   * Listens for the next dialog and accepts it.
   * @returns A promise that resolves with the dialog object once it's handled.
   */
  async acceptNextDialog(): Promise<void> {
    this.page.once('dialog', dialog => dialog.accept());
  }

  // Listener for advert
  async handleAdvert(): Promise<void> {
    console.log('Handle advert called');
    this.page.once('popup', closeBtn => closeBtn.click('defs + path'))
  }

  // --- HELPER METHODS ---

  async registerUser(name: string, email: string) {
    await this.linkLogin().click();
    await this.inputSignupName().fill(name);
    await this.inputSignupEmail().fill(email);
    await this.btnSignup().click();
  }

  async fillAccountDetails(password: string) {
    await this.radioMr().check();
    await this.inputPassword().fill(password);
    await this.selectDay().selectOption('1');
    await this.selectMonth().selectOption('1');
    await this.selectYear().selectOption('1990');
    await this.checkNewsletter().check();
    await this.checkOptin().check();
  }

  async fillAddressDetails() {
    await this.inputFirstName().fill('John');
    await this.inputLastName().fill('Doe');
    await this.inputAddress1().fill('123 Test Street');
    await this.selectCountry().selectOption('United States');
    await this.inputState().fill('New York');
    await this.inputCity().fill('New York');
    await this.inputZip().fill('10001');
    await this.inputMobile().fill('1234567890');
    await this.btnCreateAccount().click();
  }

  async loginUser(email: string, pass: string) {
    await this.linkLogin().click();
    await this.inputLoginEmail().fill(email);
    await this.inputLoginPassword().fill(pass);
    await this.btnLogin().click();
  }

  // --- NEW HELPER METHODS ---

  async submitReview(name: string, email: string, review: string) {
    await this.inputReviewName().fill(name);
    await this.inputReviewEmail().fill(email);
    await this.inputReviewText().fill(review);
    await this.btnSubmitReview().click();
  }

  // --- NEW HELPER METHOD ---

  async fillPaymentDetails() {
    // Fills mock payment details for successful order placement
    await this.inputCardName().fill('John Doe');
    await this.inputCardNumber().fill('4100 0000 0000 0000');
    await this.inputCVC().fill('123');
    await this.inputExpiryMonth().fill('01');
    await this.inputExpiryYear().fill('2025');
    await this.btnPayConfirm().click();
  }
}