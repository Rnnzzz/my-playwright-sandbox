import { test, expect } from '../fixtures/base_test';

test.describe('Login Functionality', { tag: '@smoke' }, () => {

    test('should show error with invalid credentials', async ({ loginPage }) => {
        await loginPage.login('Test123!%@test.com', 'invalidPassword');

        const message = await loginPage.getAlertText();
        await expect(message).toContain('Incorrect email or password.');
    });

    test('should show error with valid credentials', async ({ page, loginPage }) => {
        await loginPage.login('Test123!%@test.com', '+HA};o#5)90M');
        await expect(page.getByText('Automation Practice')).toBeVisible();
        await expect(page.url()).toContain('/client/#/dashboard');
    });

});