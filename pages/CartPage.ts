import { BasePage } from './BasePage';
import { PaymentDetails } from '../types/PaymentDetails';

import { CartItem } from '../types/CartItem';


export class CartPage extends BasePage {
  // ===========================================================================
  // CART ACTIONS & MESSAGES
  // ===========================================================================
  readonly btnRemoveItem = () => this.page.locator('.cart_quantity_delete').first();
  readonly btnRemoveItemAll = () => this.page.locator('.cart_quantity_delete');
  readonly cartEmptyMessage = () => this.page.locator('#empty_cart');
  readonly btnCheckout = () => this.page.locator('.check_out');
  readonly cartTableBody = () => this.page.locator('#cart_info_table tbody');

  // ===========================================================================
  // CART TABLE DATA
  // ===========================================================================
  readonly cartItemRows = () => this.page.locator('#cart_info_table tbody tr');
  readonly cartItemNames = () => this.page.locator('.cart_description h4').allInnerTexts();
  readonly cartItemPrices = () => this.page.locator('.cart_price p').allInnerTexts();
  readonly cartItemPrice = (itemIndex = 1) => this.page.locator('.cart_price p').nth(itemIndex);
  readonly cartItemQuantities = () => this.page.locator('.cart_quantity button.disabled').allInnerTexts();
  readonly cartItemTotals = () => this.page.locator('.cart_total p').allInnerTexts();

  readonly btnQuantity = (itemIndex = 0) => this.page.locator('button.disabled').nth(itemIndex);
  readonly inputQuantity = (itemIndex = 0) => this.page.locator('input.cart_quantity_input').nth(itemIndex);
  readonly cartTotalPrice = () => this.page.locator('#cart_info_table .cart_total_price');
  // readonly cartItemPrices = () => this.page.locator('#cart_info_table .cart_price');
  // readonly cartItemTotalPrices = () => this.page.locator('#cart_info td.cart_total');

  // ===========================================================================
  // SPECIFIC CART ITEMS
  // ===========================================================================
  readonly cartItemProductByIndex = (index = 1) => this.page.locator(`#product-${index}`);
  readonly cartItemProductNameByIndex = (index = 1) => this.page.locator(`#product-${index} h4`);

  // ===========================================================================
  // CHECKOUT MODAL
  // ===========================================================================
  readonly modalCheckout = () => this.page.locator('#checkoutModal');
  readonly linkRegisterLoginCheckout = () => this.page.locator('#checkoutModal u');
  readonly msgRegisterLoginCheckout = () => this.page.locator('p:has-text("Register / Login account to proceed on checkout.")');

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================
  async scrapeCartItemsData() {
    const cartItemsData: CartItem[] = [];
    const cartItemNames = await this.cartItemNames();
    const cartItemPrices = await this.cartItemPrices();
    const cartItemQuantities = await this.cartItemQuantities();
    const cartItemTotals = await this.cartItemTotals();

    for (let i = 0; i < cartItemNames.length; i++) {
      const cartItem: CartItem = {
        name: cartItemNames[i],
        price: parseFloat(cartItemPrices[i].replace(/[^0-9.]|(?<!\d)\./g, '')),
        quantity: parseInt(cartItemQuantities[i]),
        total: parseFloat(cartItemTotals[i].replace(/[^0-9.]|(?<!\d)\./g, ''))
      };

      cartItemsData.push(cartItem);
    }

    return cartItemsData;
  }

  async getTotalPrice(): Promise<number> {
    const cartItemsData = await this.scrapeCartItemsData();
    return cartItemsData.reduce((total, item) => total + item.total, 0);
  }
}