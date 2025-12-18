import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  // ===========================================================================
  // TECHNICAL HELPERS (SCROLLING, RESIZING, DIALOGS)
  // ===========================================================================
  
  /**
   * Helper to scroll the window to a specific Y coordinate.
   */
  async scrollTo(y: number): Promise<void> {
    await this.page.evaluate((yCoord) => window.scrollTo(0, yCoord), y);
  }

  /**
   * Helper to resize the window to a specific size
   */
  async resizeWindow(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  async acceptNextDialog(): Promise<void> {
    this.page.once('dialog', dialog => dialog.accept());
  }

  async handleAdvert(): Promise<void> {
    this.page.once('popup', closeBtn => closeBtn.click('defs + path'));
  }

  // ===========================================================================
  // DATA PARSING & VALIDATION HELPERS
  // ===========================================================================

  /**
   * Helper to parse price string "$ 500" or "Rs. 500" to number 500
   */
  async getPriceValue(locator: Locator): Promise<number> {
    const text = await locator.innerText();
    return parseFloat(text.replace(/[^0-9.]|(?<!\d)\./g, ''));
  }

  /**
   * Helper to verify address text exists in the checkout address box
   */
  async verifyAddressDetails(container: Locator, addressLine: string) {
    await expect(container).toContainText(addressLine);
  }
}