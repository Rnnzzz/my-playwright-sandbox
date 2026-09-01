// pages-or-flows/login-page.ts
import { Page, Locator, defineConfig } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', {name : 'email'});
    this.passwordInput = page.getByPlaceholder('enter your passsword');
    this.loginButton = page.getByRole('button', {name : 'login'});
    this.errorMessage = page.getByLabel('Incorrect email or password.');
  }

  async navigate() {
    await this.page.goto('/client/#/auth/login');
  }

  async login(user: string, pass: string) {
    await this.navigate();
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  async getAlertText(): Promise<string | null> {
    return this.errorMessage.textContent();
  }
}
