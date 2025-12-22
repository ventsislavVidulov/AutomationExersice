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
  readonly linkBrand = (brand: string) => this.page.locator(`.brands-name a[href="/brand_products/${brand}"]`);
  readonly panelWomen = () => this.page.locator('#accordian a[href="#Women"]');
  readonly linkSubCategoryDress = () => this.page.locator('a[href="/category_products/1"]');

  // ===========================================================================
  // PRODUCT LISTS & CARDS
  // ===========================================================================
  readonly productCard = (index = 1) => this.page.locator('.single-products').nth(index - 1);
  readonly productCardImageWrapper = () => this.page.locator('.product-image-wrapper').first();
  readonly productOverlay = (cardIndex = 1) => this.productCard(cardIndex).locator('.product-overlay');
  readonly productPriceList = () => this.page.locator('.productinfo h2').first();
  readonly productTextList = () => this.page.locator('.productinfo p').first();
  readonly btnAddToCartFromList = () => this.page.locator('.overlay-content .add-to-cart').first();
  readonly btnViewProductDetailsNth = (index = 1) => this.page.locator('.choose a').nth(index - 1);
  readonly productsListWrapper = () => this.page.locator('.product-image-wrapper');
  readonly btnAddToCartNth = (index = 1) => this.page.locator(`a[data-product-id="${index}"]`).first();

  // ===========================================================================
  // RECOMMENDED ITEMS
  // ===========================================================================
  readonly carouselRecommended = () => this.page.locator('#recommended-item-carousel');
  readonly btnAddRecommendedFirst = () => this.page.locator('.recommended_items .active .add-to-cart').first();

  // ===========================================================================
  // BUSINESS LOGIC HELPERS
  // ===========================================================================
  async searchProduct(name: string) {
    await this.inputSearch().fill(name);
    await this.btnSearch().click();
  }
}