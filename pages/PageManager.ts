import { Page } from '@playwright/test';
import { NavComponent } from './NavComponent';
import { AuthPage } from './AuthPage';
import { ProductPage } from './ProductPage';
import { CartPage } from './CartPage';
import { SupportPage } from './SupportPage';
import { CheckOutPage } from './CheckOutPage';
import { PaymentPage } from './PaymentPage';
import { ProductDetailsPage } from './ProductDetailsPage';

export class PageManager {
  readonly page: Page;

  readonly nav: NavComponent;
  readonly auth: AuthPage;
  readonly products: ProductPage;
  readonly cart: CartPage;
  readonly support: SupportPage;
  readonly checkout: CheckOutPage;
  readonly payment: PaymentPage;
  readonly productDetails: ProductDetailsPage;


  constructor(page: Page) {
    this.page = page;

    this.nav = new NavComponent(page);
    this.auth = new AuthPage(page);
    this.products = new ProductPage(page);
    this.cart = new CartPage(page);
    this.support = new SupportPage(page);
    this.checkout = new CheckOutPage(page);
    this.payment = new PaymentPage(page);
    this.productDetails = new ProductDetailsPage(page);
  }
}