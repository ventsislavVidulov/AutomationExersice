import { test as base } from '@playwright/test';
import { PageManager } from './pages/PageManager'; // Adjust path to where your PageManager class is

// 1. Declare the types for your custom fixtures
type MyFixtures = {
  pm: PageManager;
};

// 2. Extend the base test to include your new 'pm' fixture
export const test = base.extend<MyFixtures>({
  
  pm: async ({ page }, use) => {
    // --- Setup Phase ---
    const pm = new PageManager(page);
    
    // Navigate to the base URL
    await pm.nav.goToHomePage();

    // Handle the Consent Popup (if it appears)
    try {
      // Short timeout because we don't want to wait long if it's not there
      const consentBtn = pm.nav.btnConsent(); 
      await consentBtn.waitFor({ state: 'visible' });
      await consentBtn.click();
    } catch (e) {
      // Popup didn't appear, continue safely
    }

    // --- Pass the fixture to the test ---
    await use(pm);

    // --- Teardown Phase (Optional) ---
    // Code here runs after the test finishes (e.g., clearing local storage)
  },
});

// 3. Re-export expect so you only need to import from this file
export { expect } from '@playwright/test';