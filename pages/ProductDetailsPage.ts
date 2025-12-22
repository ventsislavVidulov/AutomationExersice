import { BasePage } from "./BasePage";

export class ProductDetailsPage extends BasePage {
    // ===========================================================================
    // PRODUCT DETAILS PAGE (PDP)
    // ===========================================================================
    readonly productPrice = () => this.page.locator('.product-information span span').first();
    readonly productAvailability = () => this.page.locator('.product-information p:has-text("Availability:")');
    readonly inputQuantity = () => this.page.locator('#quantity');
    readonly btnAddToCart = () => this.page.locator('button.cart');

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
    async submitReview(name: string, email: string, review: string) {
        await this.inputReviewName().fill(name);
        await this.inputReviewEmail().fill(email);
        await this.inputReviewText().fill(review);
        await this.btnSubmitReview().click();
    }
}