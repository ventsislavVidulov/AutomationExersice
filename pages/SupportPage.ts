import { BasePage } from './BasePage';

export class SupportPage extends BasePage {
  // ===========================================================================
  // CONTACT US FORM
  // ===========================================================================
  readonly inputContactName = () => this.page.locator('[data-qa="name"]');
  readonly inputContactEmail = () => this.page.locator('[data-qa="email"]');
  readonly inputContactSubject = () => this.page.locator('[data-qa="subject"]');
  readonly inputContactMessage = () => this.page.locator('[data-qa="message"]');
  readonly inputUploadFile = () => this.page.locator('input[name="upload_file"]');
  readonly btnSubmitContact = () => this.page.locator('[data-qa="submit-button"]');
  readonly alertContactSuccess = () => this.page.locator('h2 + div.alert-success');

  // ===========================================================================
  // SUBSCRIPTION (FOOTER & CART PAGE)
  // ===========================================================================
  readonly inputSubscribeEmail = () => this.page.locator('#susbscribe_email');
  readonly btnSubscribe = () => this.page.locator('#subscribe');
  readonly msgSubscribeSuccess = () => this.page.locator('#success-subscribe');
}