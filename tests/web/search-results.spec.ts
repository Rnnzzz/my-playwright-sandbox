import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../../src/pages/FlightSearch';
import { SearchResultsPage } from '../../src/pages/SearchResultsPage';
import { TestData } from '../../src/utils/test-data';

test.describe('@Web Flight-results validations', () => {

  test('@Positive should display flight results and critical search components', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const { from, to, departDate, returnDate } = TestData.validRoundTrip;
    await home.searchFlights(from, to, departDate, returnDate);

    const resultsPage = new SearchResultsPage(page);
    await resultsPage.waitForResultsToLoad();

    await expect(resultsPage.searchSection).toBeVisible();

    const filterComponents = ["All filters", "Stops", "Times", "Airlines", "Airports", "Duration", "Cabin"];
    for (const component of filterComponents) {
      await validateFilterComponents(component, page);
    }

    const resultsSection = resultsPage.resultSection.first();
    await expect(resultsSection).toBeVisible();
  });

  async function validateFilterComponents(componentLocator: string, page: Page) {
    const elementComponent = page.locator(`//div[@aria-label='${componentLocator}']`).first();
    expect(await elementComponent).toBeVisible();
    await elementComponent.click();
    const componentClickedElement = page.locator(`//div[text()='${componentLocator}']`).nth(1);
    expect(await componentClickedElement).toBeVisible();
    await elementComponent.click();
  }

  test('@Negative a route with no viable flights shows a "no results" state, not an empty/blank page', async ({ page }) => {
    const home = new HomePage(page);
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const returnDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const departureDateStr = tomorrow.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '');
    const returnDateStr = returnDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '');

    await home.goto();
    await home.selectOrigin('Norfolk Island');
    await home.selectDestination('Invercargill');
    await home.selectFlightDates(departureDateStr, returnDateStr);
    await page.getByText('First').click();
    await page.getByText('Compare vs Cheapflights').waitFor({ state: 'visible', timeout: 10_000 });
    await page.locator(`//div[text()='Compare vs Cheapflights']/parent::div/following-sibling::div//input`).click();
    await home.clickSearch();

    const results = new SearchResultsPage(page);
    await page.locator(`//img[@alt='no-results']`).waitFor({ state: 'visible', timeout: 60_000 });

    const noResults = results.noResultsMessage;

    expect(noResults).toContainText('No flights found');
  });
});