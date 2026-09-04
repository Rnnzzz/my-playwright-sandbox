import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/FlightSearch';
import { SearchResultsPage } from '../../src/pages/SearchResultsPage';
import { TestData } from '../../src/utils/test-data';

test.describe('@Web Flight-search validations', () => {

  test('@Positive searching with valid flight should redirect to flight result page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const { from, to, departDate, returnDate } = TestData.validRoundTrip;
    await home.searchFlights(from, to, departDate, returnDate);

    const results = new SearchResultsPage(page);
    await results.waitForResultsToLoad();
    expect(await page.locator(`//div[@id='flight-results-list-wrapper']//div[@role='group']//ol/li`).count()).toBeGreaterThan(0);
  });

  test('@Positive searching should auto-complete the word for suggestions', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.originInput.click();
    await home.originInput.fill('Syd');
    const suggestion = page.getByRole('option', { name: /sydney/i }).first();
    await expect(suggestion).toBeVisible({ timeout: 10_000 });
  });

  test('@Negative searching with an empty destination should keep the search button disable', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.selectOrigin(TestData.emptyDestination.from);

    const isDisabled = await home.searchButton.isDisabled().catch(() => false);

    if (!isDisabled) {
      const urlBefore = page.url();
      await home.clickSearch();
      await page.waitForTimeout(2000);
      expect(page.url()).toBe(urlBefore);
    } else {
      expect(isDisabled).toBeTruthy();
    }
  });

  test('@Negative Searching non existing destination should have no result', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.destinationInput.click();
    await home.destinationInput.fill(TestData.nonExistentPlace.to);

    const anyOption = page.getByRole('option');
    await page.waitForTimeout(2000);
    expect(await anyOption.count()).toBe(0);
  });

  test('@Negative searching with an empty origin should keep the search button disable', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const urlBefore = page.url();
    await home.selectDestination('Melbourne');
    await home.clickSearch();
    await page.waitForTimeout(2000);
    const isDisabled = await home.searchButton.isDisabled().catch(() => false);
  });
});
