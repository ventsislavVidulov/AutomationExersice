import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  // ===========================================================================
  // PRODUCT DISCOVERY (SEARCH & TITLES)
  // ===========================================================================
  readonly inputSearch = () => this.page.locator('#search_product');
  readonly btnSearch = () => this.page.locator('#submit_search');
  readonly h2PageTitle = () => this.page.locator('h2.title');
  readonly h2FeaturesItems = () => this.page.locator('.features_items');
  readonly h2ProductInfo = () => this.page.locator('.product-information h2');

  // ===========================================================================
  // SIDEBAR / CATEGORIES / BRANDS
  // ===========================================================================
  readonly linkCategory = (category: string) => this.page.locator(`.panel-title a[href="#${category}"]`);
  readonly linkSubCategory = (categoryId: number) => this.page.locator(`a[href="/category_products/${categoryId}"]`);
  readonly linkBrandPolo = () => this.page.locator('.brands-name a[href="/brand_products/Polo"]');
  readonly panelWomen = () => this.page.locator('#accordian a[href="#Women"]');
  readonly linkSubCategoryDress = () => this.page.locator('a[href="/category_products/1"]');

  // ===========================================================================
  // PRODUCT LISTS & CARDS
  // ===========================================================================
  readonly productCard = (index = 0) => this.page.locator('.single-products').nth(index);
  readonly productCardImageWrapper = () => this.page.locator('.product-image-wrapper').first();
  readonly productOverlay = (cardIndex = 0) => this.productCard(cardIndex).locator('.product-overlay');
  readonly productPriceList = () => this.page.locator('.productinfo h2').first();
  readonly productTextList = () => this.page.locator('.productinfo p').first();
  readonly btnAddToCartFromList = () => this.page.locator('.overlay-content .add-to-cart').first();
  readonly btnViewProductFromList = (index = 0) => this.page.locator('.choose a').nth(index);
  readonly productsListWrapper = () => this.page.locator('.product-image-wrapper');
  readonly btnAddToCartFirst = () => this.page.locator('.add-to-cart').first();
  readonly btnAddToCartID2 = () => this.page.locator('a[data-product-id="2"]').first();

  // ===========================================================================
  // RECOMMENDED ITEMS
  // ===========================================================================
  readonly carouselRecommended = () => this.page.locator('#recommended-item-carousel');
  readonly btnAddRecommended = () => this.page.locator('.recommended_items .active .add-to-cart').first();

  // ===========================================================================
  // PRODUCT DETAILS PAGE (PDP)
  // ===========================================================================
  readonly productPrice = () => this.page.locator('.product-information span span').first();
  readonly productAvailability = () => this.page.locator('.product-information p:has-text("Availability:")');
  readonly inputQuantityPDP = () => this.page.locator('#quantity');
  readonly btnAddToCartPDP = () => this.page.locator('button.cart');

  // ===========================================================================
  // REVIEW FORM
  // ===========================================================================
  readonly reviewForm = () => this.page.locator('#review-form');
  readonly inputReviewName = () => this.page.locator('#name');
  readonly inputReviewEmail = () => this.page.locator('#email');
  readonly inputReviewText = () => this.page.locator('#review');
  readonly btnSubmitReview = () => this.page.locator('#button-review');
  readonly alertReviewSuccess = () => this.page.locator('#review-section .alert-success');

  // ===========================================================================
  // BUSINESS LOGIC HELPERS
  // ===========================================================================
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
}