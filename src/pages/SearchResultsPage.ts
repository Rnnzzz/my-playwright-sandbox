import { Page, Locator } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;
  readonly noResultsMessage: Locator;
  readonly searchSection: Locator;
  readonly resultSection : Locator;


  constructor(page: Page) {
    this.page = page;

    this.noResultsMessage = page.getByText('No flights found').first();
    this.searchSection = page.locator(`//div[@role='search']/parent::div`);
    this.resultSection = page.locator('[data-testid="results-list"], .results-section, [role="main"]');
  }

  async waitForResultsToLoad() {
    await this.page.locator(`//div[@aria-label='Cheapest']`).waitFor({ state: 'visible', timeout: 10_000 });
  }


}
