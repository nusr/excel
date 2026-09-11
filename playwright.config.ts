import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

const testEnv = process.env.TEST_ENV || 'local';

const isLocal = testEnv === 'local';

const baseURL = isLocal
  ? 'http://localhost:3000'
  : 'https://nusr.github.io/excel?mode=e2e';

process.env.BASE_URL = baseURL;

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  failOnFlakyTests: true,
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!isCI,
  retries: isCI ? 3 : 0,
  workers: 5,
  reporter: [['html', { open: 'never' }], ['github'], ['list']],
  use: {
    baseURL,
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
  webServer: isLocal
    ? {
        command: 'yarn start:e2e',
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 120 * 1000,
      }
    : undefined,
  expect: {
    timeout: 10 * 1000,
  },
});
