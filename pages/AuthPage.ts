import { BasePage } from './BasePage';

export class AuthPage extends BasePage {
  // ===========================================================================
  // LOGIN & SIGNUP FORMS
  // ===========================================================================
  readonly h2LoginToAccount = () => this.page.locator('text=Login to your account');
  readonly inputLoginEmail = () => this.page.locator('[data-qa="login-email"]');
  readonly inputLoginPassword = () => this.page.locator('[data-qa="login-password"]');
  readonly btnLogin = () => this.page.locator('[data-qa="login-button"]');

  readonly inputSignupName = () => this.page.locator('[data-qa="signup-name"]');
  readonly inputSignupEmail = () => this.page.locator('[data-qa="signup-email"]');
  readonly btnSignup = () => this.page.locator('[data-qa="signup-button"]');
  readonly msgSignupError = () => this.page.locator('form[action="/signup"] p');

  // ===========================================================================
  // ACCOUNT CREATION FORM (PERSONAL INFO)
  // ===========================================================================
  readonly radioMr = () => this.page.locator('#id_gender1');
  readonly inputPassword = () => this.page.locator('[data-qa="password"]');
  readonly selectDay = () => this.page.locator('#days');
  readonly selectMonth = () => this.page.locator('#months');
  readonly selectYear = () => this.page.locator('#years');
  readonly checkNewsletter = () => this.page.locator('#newsletter');
  readonly checkOptin = () => this.page.locator('#optin');

  // ===========================================================================
  // ACCOUNT CREATION FORM (ADDRESS INFO)
  // ===========================================================================
  readonly inputFirstName = () => this.page.locator('[data-qa="first_name"]');
  readonly inputLastName = () => this.page.locator('[data-qa="last_name"]');
  readonly inputAddress1 = () => this.page.locator('[data-qa="address"]');
  readonly selectCountry = () => this.page.locator('[data-qa="country"]');
  readonly inputState = () => this.page.locator('[data-qa="state"]');
  readonly inputCity = () => this.page.locator('[data-qa="city"]');
  readonly inputZip = () => this.page.locator('[data-qa="zipcode"]');
  readonly inputMobile = () => this.page.locator('[data-qa="mobile_number"]');
  readonly btnCreateAccount = () => this.page.locator('[data-qa="create-account"]');

  // ===========================================================================
  // SUCCESS / STATUS HEADERS
  // ===========================================================================
  readonly h2AccountCreated = () => this.page.locator('h2[data-qa="account-created"]');
  readonly h2AccountDeleted = () => this.page.locator('h2[data-qa="account-deleted"]');
  readonly btnContinue = () => this.page.locator('[data-qa="continue-button"]');
  readonly btnSuccessHome = () => this.page.locator('a.btn-success');

  // ===========================================================================
  // BUSINESS LOGIC HELPERS
  // ===========================================================================
  async registerUser(name: string, email: string) {
    await this.inputSignupName().fill(name);
    await this.inputSignupEmail().fill(email);
    await this.btnSignup().click();
  }

  async loginUser(email: string, pass: string) {
    await this.inputLoginEmail().fill(email);
    await this.inputLoginPassword().fill(pass);
    await this.btnLogin().click();
  }

  async fillAccountDetails(password: string) {
    await this.radioMr().check();
    await this.inputPassword().fill(password);
    await this.selectDay().selectOption('1');
    await this.selectMonth().selectOption('1');
    await this.selectYear().selectOption('1990');
    await this.checkNewsletter().check();
    await this.checkOptin().check();
  }

  async fillAddressDetails() {
    await this.inputFirstName().fill('John');
    await this.inputLastName().fill('Doe');
    await this.inputAddress1().fill('123 Test Street');
    await this.selectCountry().selectOption('United States');
    await this.inputState().fill('New York');
    await this.inputCity().fill('New York');
    await this.inputZip().fill('10001');
    await this.inputMobile().fill('1234567890');
    await this.btnCreateAccount().click();
  }
}