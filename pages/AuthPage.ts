import { BasePage } from './BasePage';
import { AccountDetails, AddressDetails } from '../types/Credentials';

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
  readonly radioMrs = () => this.page.locator('#id_gender2');
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

  async fillAccountDetails({gender, password, day, month, year, newsletter, option}: AccountDetails) {
   if (gender === 'male') {
      await this.radioMr().check();
    } else {
      await this.radioMrs().check();
    }
    await this.inputPassword().fill(password);
    await this.selectDay().selectOption(day);
    await this.selectMonth().selectOption(month);
    await this.selectYear().selectOption(year);
    if (newsletter) {
      await this.checkNewsletter().check();
    }
    if (option) {
      await this.checkOptin().check();
    }
  }

  async fillAddressDetails({firstName, lastName, address1, country, state, city, zip, mobile}: AddressDetails) {
    await this.inputFirstName().fill(firstName);
    await this.inputLastName().fill(lastName);
    await this.inputAddress1().fill(address1);
    await this.selectCountry().selectOption(country);
    await this.inputState().fill(state);
    await this.inputCity().fill(city);
    await this.inputZip().fill(zip);
    await this.inputMobile().fill(mobile);
    await this.btnCreateAccount().click();
  }
}