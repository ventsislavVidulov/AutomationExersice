import { BasePage } from "./BasePage";

export class CheckOutPage extends BasePage {
    // ===========================================================================
    // CHECKOUT 
    // ===========================================================================
    readonly checkoutDeliveryAddress = () => this.page.locator('#address_delivery');
    readonly checkoutBillingAddress = () => this.page.locator('#address_invoice');
    readonly textAreaComment = () => this.page.locator('textarea[name="message"]');
    readonly btnPlaceOrder = () => this.page.locator('a:has-text("Place Order")');
    readonly inputCommentReadonly = () => this.page.locator('.form-control[readonly]');
}
