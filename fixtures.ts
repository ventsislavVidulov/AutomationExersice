import { test as base, expect } from '@playwright/test';
import { PageManager } from './pages/PageManager';

type PMFixture = {
  pm: PageManager;
};

type ParamFixture<T> = {
  params: T;
};

// 1. Your Base Fixture
export const test = base.extend<PMFixture>({
  pm: async ({ page }, use) => {
    const pm = new PageManager(page);
    await pm.nav.goToHomePage();
    const consentBtn = pm.nav.btnConsent();
    await consentBtn.waitFor({ state: 'visible' });
    await consentBtn.click();
    await use(pm);
  },
});

// 2. Generic Function
export function createParameterizedTest<T>() {
  return test.extend<ParamFixture<T>>({
    // Wrap the generic T in an async fixture function
    params: async ({ }, use) => {
      await use({} as T);
    },
  });
}

export { expect };