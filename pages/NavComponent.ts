import { BasePage } from './BasePage';

export class NavComponent extends BasePage {
  // ===========================================================================
  // GLOBAL UI ELEMENTS & LOGO
  // ===========================================================================
  readonly logo = () => this.page.locator('.logo');
  readonly btnConsent = () => this.page.getByRole('button').filter({ hasText: 'Consent' });

  // ===========================================================================
  // "ADDED TO CART" MODAL
  // ===========================================================================
  readonly modalAdded = () => this.page.locator('#cartModal');
  readonly btnContinueShopping = () => this.page.locator('.close-modal');
  readonly btnViewCart = () => this.page.locator('u:has-text("View Cart")');
  readonly modalBody = () => this.page.locator('.modal-body');

  // ===========================================================================
  // NAVIGATION BAR LINKS
  // ===========================================================================
  readonly linkHome = () => this.page.locator('a[href="/"]');
  readonly linkLogin = () => this.page.locator('a[href="/login"]');
  readonly linkProducts = () => this.page.locator('li a[href="/products"]');
  readonly linkCartNavigation = () => this.page.locator('header a[href="/view_cart"]');
  readonly linkContact = () => this.page.locator('a[href="/contact_us"]');
  readonly linkLogout = () => this.page.locator('a[href="/logout"]');
  readonly linkDeleteAccount = () => this.page.locator('a[href="/delete_account"]');
  readonly linkAPITesting = () => this.page.locator('a:has-text("API Testing")');

  // ===========================================================================
  // USER STATUS
  // ===========================================================================
  readonly txtLoggedInAs = () => this.page.locator('text=Logged in as');
  readonly txtLoggedInUser = (username: string) => this.page.locator(`text=Logged in as ${username}`);

  // ===========================================================================
  // HARD NAVIGATION
  // ===========================================================================
  readonly goToHomePage = async () => { await this.page.goto('/', { waitUntil: 'domcontentloaded' }) };
  readonly goToProductDetails = async (productId: number) => { await this.page.goto(`/product_details/${productId}`, { waitUntil: 'domcontentloaded' }) };

  // ===========================================================================
  // META DATA
  // ===========================================================================
  readonly getPageUrl = () => this.page.url();
  readonly getPageTitle = () => this.page.title();
}