import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login_page';

// Define the types for your custom fixtures
type MyFixtures = {
  loginPage: LoginPage;
};

// Extend the base test to include your custom fixtures
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    // Instantiate the page object
    const loginPage = new LoginPage(page);
    
    // Pass the fixture to the test
    await use(loginPage);
  },
});

// Export the expect utility for convenience
export { expect } from '@playwright/test';