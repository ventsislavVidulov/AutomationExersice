import { BasePage } from "./BasePage";
import { PaymentDetails } from "../types/PaymentDetails";

export class PaymentPage extends BasePage {
    // ===========================================================================
    // PAYMENT 
    // ===========================================================================
    readonly inputCardName = () => this.page.locator('[data-qa="name-on-card"]');
    readonly inputCardNumber = () => this.page.locator('[data-qa="card-number"]');
    readonly inputCVC = () => this.page.locator('[data-qa="cvc"]');
    readonly inputExpiryMonth = () => this.page.locator('[data-qa="expiry-month"]');
    readonly inputExpiryYear = () => this.page.locator('[data-qa="expiry-year"]');
    readonly btnPayConfirm = () => this.page.locator('[data-qa="pay-button"]');
    readonly orderConfirmationMessage = () => this.page.locator('.col-sm-9 p').first();

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