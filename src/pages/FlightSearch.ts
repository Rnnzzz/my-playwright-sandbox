import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly logo: Locator;
  readonly signInButton: Locator;
  readonly originInput: Locator;
  readonly destinationInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo = page
      .locator(`//a[@aria-label='Go to the cheapflights homepage']`);

    this.signInButton = page.getByRole('button', { name: /sign in/i })
      .or(page.getByRole('link', { name: /sign in/i }));

    this.originInput = page.getByPlaceholder(/leaving from|from\?|origin/i)
      .or(page.getByRole('combobox', { name: /from|origin|departure airport/i }));

    this.destinationInput = page.getByPlaceholder(/going to|to\?|destination/i)
      .or(page.getByRole('combobox', { name: /to|destination|arrival airport/i }));

    this.searchButton = page.getByRole('button', { name: 'Search' });
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.page.locator(`//div[@id='main-search-form']//img[1]`).first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  async selectOrigin(cityName: string) {
    const originInputLocator = 'Flight origin input';
    if (await this.page.getByLabel(originInputLocator).getByRole('button', { name: 'Remove value' }).isVisible()) {
      await this.page.getByLabel(originInputLocator).getByRole('button', { name: 'Remove value' }).click();
    }
    await this.originInput.click();
    await this.originInput.fill(cityName);
    await this.page.getByRole('option', { name: new RegExp(cityName, 'i') }).first().click();
  }

  async selectDestination(cityName: string) {
    const destinationInputLocator = 'Flight destination input';
    if (await this.page.getByLabel(destinationInputLocator).getByRole('button', { name: 'Remove value' }).isVisible()) {
      await this.page.getByLabel(destinationInputLocator).getByRole('button', { name: 'Remove value' }).click();
    }
    await this.destinationInput.click();
    await this.destinationInput.fill(cityName);
    await this.page.getByRole('option', { name: new RegExp(cityName, 'i') }).first().click();
  }

  async clickSearch() {
    await this.searchButton.click();
  }

  async searchFlights(from: string, to: string, departureDate: string, returnDate: string) {
    await this.selectOrigin(from);
    await this.selectDestination(to);
    await this.selectFlightDates(departureDate, returnDate);
    await this.page.getByText('Compare vs Cheapflights').waitFor({ state: 'visible', timeout: 10_000 });
    await this.page.locator(`//div[text()='Compare vs Cheapflights']/parent::div/following-sibling::div//input`).click();
    await this.clickSearch();
  }

  async selectFlightDates(departureDate: string, returnDate: string) {
    await this.page.locator(`//div[contains(@aria-label,'${departureDate}')]`).click();
    await this.page.locator(`//div[contains(@aria-label,'${returnDate}')]`).click();
  }

}
