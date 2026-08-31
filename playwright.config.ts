import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  failOnFlakyTests: false,
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!isCI,
  retries: isCI ? 2 : 0,
  workers: 5,
  reporter: [['html', { open: 'never' }], ['github'], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    navigationTimeout: 10 * 1000,
    actionTimeout: 10 * 1000,
    locale: 'en-US',
    timezoneId: 'Asia/Shanghai',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
    { name: 'ipad-pro', use: { ...devices['iPad Pro 11'] } },
  ],
  webServer: {
    command: 'yarn start:e2e',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
  },
  expect: {
    timeout: 10 * 1000,
  },
});
