import { BasePage } from './BasePage';
import { PaymentDetails } from '../types/PaymentDetails';

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
  readonly btnQuantity = (itemIndex = 0) => this.page.locator('button.disabled').nth(itemIndex);
  readonly inputQuantity = (itemIndex = 0) => this.page.locator('input.cart_quantity_input').nth(itemIndex);
  readonly cartTotalPrice = () => this.page.locator('#cart_info_table .cart_total_price');
  readonly cartItemPrices = () => this.page.locator('#cart_info_table .cart_price');
  readonly cartItemTotalPrices = () => this.page.locator('#cart_info td.cart_total');

  // ===========================================================================
  // SPECIFIC CART ITEMS
  // ===========================================================================
  readonly cartItemProductByIndex = (index = 1) => this.page.locator(`#product-${index}`);
  readonly cartItemProductNameByIndex = (index = 1) => this.page.locator(`#product-${index} h4`);

  // ===========================================================================
  // CHECKOUT & PAYMENT (Related to Cart Workflow)
  // ===========================================================================
  readonly checkoutDeliveryAddress = () => this.page.locator('#address_delivery');
  readonly checkoutBillingAddress = () => this.page.locator('#address_invoice');
  readonly textAreaComment = () => this.page.locator('textarea[name="message"]');
  readonly btnPlaceOrder = () => this.page.locator('a:has-text("Place Order")');
  readonly inputCommentReadonly = () => this.page.locator('.form-control[readonly]');

  readonly inputCardName = () => this.page.locator('[data-qa="name-on-card"]');
  readonly inputCardNumber = () => this.page.locator('[data-qa="card-number"]');
  readonly inputCVC = () => this.page.locator('[data-qa="cvc"]');
  readonly inputExpiryMonth = () => this.page.locator('[data-qa="expiry-month"]');
  readonly inputExpiryYear = () => this.page.locator('[data-qa="expiry-year"]');
  readonly btnPayConfirm = () => this.page.locator('[data-qa="pay-button"]');
  readonly orderConfirmationMessage = () => this.page.locator('.col-sm-9 p').first();

  // ===========================================================================
  // CHECKOUT MODAL
  // ===========================================================================
  readonly modalCheckout = () => this.page.locator('#checkoutModal');
  readonly linkRegisterLoginCheckout = () => this.page.locator('#checkoutModal u');
  readonly msgRegisterLoginCheckout = () => this.page.locator('p:has-text("Register / Login account to proceed on checkout.")');

  // ===========================================================================
  // BUSINESS LOGIC HELPERS
  // ===========================================================================
  async fillPaymentDetails({ inputCardName, inputCardNumber, inputCVC, inputExpiryMonth, inputExpiryYear }: PaymentDetails) {
    await this.inputCardName().fill(inputCardName);
    await this.inputCardNumber().fill(inputCardNumber);
    await this.inputCVC().fill(inputCVC);
    await this.inputExpiryMonth().fill(inputExpiryMonth);
    await this.inputExpiryYear().fill(inputExpiryYear);
    await this.btnPayConfirm().click();
  }
}