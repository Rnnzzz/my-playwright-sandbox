import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 8 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.cheapflights.com.au/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 60000,
  },

  projects: [
    {
      name: 'web',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'api',
      testMatch: /.*\.api\.ts/,
      use: {
        baseURL: process.env.API_URL || 'https://restful-booker.herokuapp.com',
      },
    },
  ],
});