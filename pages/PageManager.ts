// pages/PageManager.ts
import { Page, Locator, expect } from '@playwright/test';
import { userCredentials, Credentials } from '../appConstants';

export class PageManager {
  readonly page: Page;
  readonly credentials: Credentials;


  constructor(page: Page) {
    this.page = page;
    this.credentials = userCredentials;
  }

  // ===========================================================================
  // 0. PAGE
  // ===========================================================================

  readonly goToHomePage = async () => { await this.page.goto('/', { waitUntil: 'domcontentloaded' }) };
  readonly goToProductDetails = async (productId: number) => { await this.page.goto(`/product_details/${productId}`, { waitUntil: 'domcontentloaded' }) };
  readonly getPageUrl = () => this.page.url();
  readonly getPageTitle = () => this.page.title();


  // ===========================================================================
  // 1. GLOBAL / COMMON
  // ===========================================================================

  // Consent & Modals
  readonly btnConsent = () => this.page.getByRole('button').filter({ hasText: 'Consent' });
  readonly modalAdded = () => this.page.locator('#cartModal');
  readonly btnContinueShopping = () => this.page.locator('.close-modal');
  readonly btnViewCart = () => this.page.locator('u:has-text("View Cart")');

  // Generic Headers/Messages
  readonly h2AccountCreated = () => this.page.locator('h2[data-qa="account-created"]');
  readonly h2AccountDeleted = () => this.page.locator('h2[data-qa="account-deleted"]');
  readonly h2LoginToAccount = () => this.page.locator('text=Login to your account');
  readonly btnContinue = () => this.page.locator('[data-qa="continue-button"]');

  // Page-specific headers (new locators from tests)
  readonly h2PageTitle = () => this.page.locator('h2.title'); // Used for 'Women - Dress Products', 'Brand - Polo Products'
  readonly h2FeaturesItems = () => this.page.locator('.features_items'); // Used for 'Searched Products' title
  readonly h2ProductInfo = () => this.page.locator('.product-information h2'); // Used for 'View Product Button Navigation'

  // ===========================================================================
  // 2. NAVIGATION BAR
  // ===========================================================================
  readonly linkHome = () => this.page.locator('a[href="/"]');
  readonly linkLogin = () => this.page.locator('a[href="/login"]');
  readonly linkProducts = () => this.page.locator('li a[href="/products"]');
  readonly linkCartNavigation = () => this.page.locator('header a[href="/view_cart"]');
  readonly linkContact = () => this.page.locator('a[href="/contact_us"]');
  readonly linkLogout = () => this.page.locator('a[href="/logout"]');
  readonly linkDeleteAccount = () => this.page.locator('a[href="/delete_account"]');

  // Dynamic User Status
  readonly txtLoggedInAs = () => this.page.locator('text=Logged in as');
  readonly txtLoggedInUser = (username: string) => this.page.locator(`text=Logged in as ${username}`);

  // ===========================================================================
  // 3. AUTHENTICATION (Login / Signup / Account Info)
  // ===========================================================================

  // Signup/Login Forms
  readonly inputSignupName = () => this.page.locator('[data-qa="signup-name"]');
  readonly inputSignupEmail = () => this.page.locator('[data-qa="signup-email"]');
  readonly btnSignup = () => this.page.locator('[data-qa="signup-button"]');
  readonly inputLoginEmail = () => this.page.locator('[data-qa="login-email"]');
  readonly inputLoginPassword = () => this.page.locator('[data-qa="login-password"]');
  readonly btnLogin = () => this.page.locator('[data-qa="login-button"]');
  readonly msgSignupError = () => this.page.locator('form[action="/signup"] p');

  // Account Creation Form (Personal Info)
  readonly radioMr = () => this.page.locator('#id_gender1');
  readonly inputPassword = () => this.page.locator('[data-qa="password"]');
  readonly selectDay = () => this.page.locator('#days');
  readonly selectMonth = () => this.page.locator('#months');
  readonly selectYear = () => this.page.locator('#years');
  readonly checkNewsletter = () => this.page.locator('#newsletter');
  readonly checkOptin = () => this.page.locator('#optin');

  // Account Creation Form (Address Info)
  readonly inputFirstName = () => this.page.locator('[data-qa="first_name"]');
  readonly inputLastName = () => this.page.locator('[data-qa="last_name"]');
  readonly inputAddress1 = () => this.page.locator('[data-qa="address"]');
  readonly selectCountry = () => this.page.locator('[data-qa="country"]');
  readonly inputState = () => this.page.locator('[data-qa="state"]');
  readonly inputCity = () => this.page.locator('[data-qa="city"]');
  readonly inputZip = () => this.page.locator('[data-qa="zipcode"]');
  readonly inputMobile = () => this.page.locator('[data-qa="mobile_number"]');
  readonly btnCreateAccount = () => this.page.locator('[data-qa="create-account"]');

  // ===========================================================================
  // 4. PRODUCT DISCOVERY (Search, Categories, Sidebar)
  // ===========================================================================
  readonly inputSearch = () => this.page.locator('#search_product');
  readonly btnSearch = () => this.page.locator('#submit_search');

  // Sidebar / Accordion
  readonly linkCategory = (category: string) => this.page.locator(`.panel-title a[href="#${category}"]`);
  readonly linkSubCategory = (categoryId: number) => this.page.locator(`a[href="/category_products/${categoryId}"]`);
  readonly linkBrandPolo = () => this.page.locator('.brands-name a[href="/brand_products/Polo"]');
  readonly panelWomen = () => this.page.locator('#accordian a[href="#Women"]');
  readonly linkSubCategoryDress = () => this.page.locator('a[href="/category_products/1"]');

  // Product List/Card Locators (new locators from tests)
  readonly productCard = (index = 0) => this.page.locator('.single-products').nth(index); // Used for HOME-005
  readonly productCardImageWrapper = () => this.page.locator('.product-image-wrapper').first(); // Used for PRD-001 hover
  readonly productOverlay = (cardIndex = 0) => this.productCard(cardIndex).locator('.product-overlay'); // Used for HOME-005
  readonly productPriceList = () => this.page.locator('.productinfo h2').first(); // Used for PD-001 List Price
  readonly productTextList = () => this.page.locator('.productinfo p').first(); // Used for PRD-001 Product Name
  readonly btnAddToCartFromList = () => this.page.locator('.overlay-content .add-to-cart').first(); // Used for PRD-001
  readonly btnViewProductFromList = (index = 0) => this.page.locator('.choose a').nth(index); // Used for PD-005/HOME-009
  readonly productsListWrapper = () => this.page.locator('.product-image-wrapper'); // Used for PRD-002 count

  // Recommended Items
  readonly carouselRecommended = () => this.page.locator('#recommended-item-carousel');
  readonly btnAddRecommended = () => this.page.locator('.recommended_items .active .add-to-cart').first();

  // ===========================================================================
  // 5. PRODUCT DETAILS & REVIEWS
  // ===========================================================================
  readonly productPrice = () => this.page.locator('.product-information span span').first();
  readonly productAvailability = () => this.page.locator('.product-information p:has-text("Availability:")');

  // Review Form
  readonly reviewForm = () => this.page.locator('#review-form');
  readonly inputReviewName = () => this.page.locator('#name');
  readonly inputReviewEmail = () => this.page.locator('#email');
  readonly inputReviewText = () => this.page.locator('#review');
  readonly btnSubmitReview = () => this.page.locator('#button-review');
  readonly alertReviewSuccess = () => this.page.locator('#review-section .alert-success');

  // ===========================================================================
  // 6. CART
  // ===========================================================================
  readonly btnRemoveItem = () => this.page.locator('.cart_quantity_delete').first();
  readonly cartEmptyMessage = () => this.page.locator('#empty_cart');
  readonly cartItemRows = () => this.page.locator('#cart_info_table tbody tr'); // Used for E2E-017 count

  // Cart Table Data
  readonly btnQuantity = (itemIndex = 0) => this.page.locator('button.disabled').nth(itemIndex);
  readonly inputQuantity = (itemIndex = 0) => this.page.locator('input.cart_quantity_input').nth(itemIndex);
  readonly cartTotalPrice = () => this.page.locator('#cart_info_table .cart_total_price');
  readonly cartItemPrices = () => this.page.locator('#cart_info_table .cart_price');

  // ===========================================================================
  // 7. CHECKOUT & PAYMENT
  // ===========================================================================

  // Checkout
  readonly checkoutDeliveryAddress = () => this.page.locator('#address_delivery');
  readonly checkoutBillingAddress = () => this.page.locator('#address_invoice');
  readonly textAreaComment = () => this.page.locator('textarea[name="message"]');
  readonly btnPlaceOrder = () => this.page.locator('a:has-text("Place Order")');

  // Payment
  readonly inputCardName = () => this.page.locator('[data-qa="name-on-card"]');
  readonly inputCardNumber = () => this.page.locator('[data-qa="card-number"]');
  readonly inputCVC = () => this.page.locator('[data-qa="cvc"]');
  readonly inputExpiryMonth = () => this.page.locator('[data-qa="expiry-month"]');
  readonly inputExpiryYear = () => this.page.locator('[data-qa="expiry-year"]');
  readonly btnPayConfirm = () => this.page.locator('[data-qa="pay-button"]');
  readonly orderConfirmationMessage = () => this.page.locator('.col-sm-9 p').first();

  // ===========================================================================
  // 8. CONTACT US
  // ===========================================================================
  readonly inputContactName = () => this.page.locator('[data-qa="name"]');
  readonly inputContactEmail = () => this.page.locator('[data-qa="email"]');
  readonly inputContactSubject = () => this.page.locator('[data-qa="subject"]');
  readonly inputContactMessage = () => this.page.locator('[data-qa="message"]');
  readonly inputUploadFile = () => this.page.locator('input[name="upload_file"]');
  readonly btnSubmitContact = () => this.page.locator('[data-qa="submit-button"]');

  // ===========================================================================
  // 9. HELPER METHODS (Business Logic)
  // ===========================================================================

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

  async searchProduct(name: string) {
    await this.inputSearch().fill(name);
    await this.btnSearch().click();
  }

  async submitReview(name: string, email: string, review: string) {
    await this.inputReviewName().fill(name);
    await this.inputReviewEmail().fill(email);
    await this.inputReviewText().fill(review);
    await this.btnSubmitReview().click();
  }

  async fillPaymentDetails() {
    await this.inputCardName().fill('John Doe');
    await this.inputCardNumber().fill('4100 0000 0000 0000');
    await this.inputCVC().fill('123');
    await this.inputExpiryMonth().fill('01');
    await this.inputExpiryYear().fill('2025');
    await this.btnPayConfirm().click();
  }

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

  async acceptNextDialog(): Promise<void> {
    this.page.once('dialog', dialog => dialog.accept());
  }

  async handleAdvert(): Promise<void> {
    // console.log('Handle advert called');
    this.page.once('popup', closeBtn => closeBtn.click('defs + path'))
  }
}