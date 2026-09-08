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

    const boundingBox = await home.logo.boundingBox();
    expect(boundingBox).not.toBeNull();

    if (boundingBox) {
      expect(boundingBox.y).toBeLessThan(100);
      expect(boundingBox.x).toBeLessThan(200);
    }
  });

  test('@Positive Log-in button is visible', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.signInButton).toBeVisible();
    await expect(home.signInButton).toBeEnabled();

    const boundingBox = await home.signInButton.boundingBox();
    const viewportSize = page.viewportSize();

    expect(boundingBox).not.toBeNull();
    expect(viewportSize).not.toBeNull();

    if (boundingBox && viewportSize) {
      expect(boundingBox.y).toBeLessThan(100);

      const distanceFromRight = viewportSize.width - (boundingBox.x + boundingBox.width);
      expect(distanceFromRight).toBeLessThan(100);
    }

  });
});
