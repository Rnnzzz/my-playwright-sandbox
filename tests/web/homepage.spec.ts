import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/FlightSearch';

test.describe('@Web Logo and Log-in button validations', () => {
  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
  });

  test('@Positive Logo is visible', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.logo).toBeVisible();
  });

  test('@Positive Log-in button is visible', async ({ page }) => {
      const home = new HomePage(page);
      await expect(home.signInButton).toBeVisible();
      await expect(home.signInButton).toBeEnabled();

    });
});
