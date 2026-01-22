import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.E2E_TEST);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 5,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }], ['github'], ['list']],
  timeout: 30 * 1000,
  globalTimeout: 16 * 60 * 1000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    navigationTimeout: 10 * 1000,
    actionTimeout: 10 * 1000,
    locale: 'en-US',
    timezoneId: 'Asia/Shanghai',
    headless: true,
  },
  /* Configure projects for major browsers */
  projects: [
    // Desktop browser configurations
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },

    // Mobile browser configurations - Android
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-chrome-landscape',
      use: {
        ...devices['Pixel 5 landscape'],
      },
    },
    {
      name: 'galaxy-s9',
      use: { ...devices['Galaxy S9+'] },
    },

    // Mobile browser configurations - iOS
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'mobile-safari-landscape',
      use: {
        ...devices['iPhone 13 landscape'],
      },
    },
    {
      name: 'iphone-12',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'ipad-pro',
      use: { ...devices['iPad Pro'] },
    },
    {
      name: 'ipad-mini',
      use: { ...devices['iPad Mini'] },
    },
  ],

  /* Run your local dev server before starting the tests */
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
