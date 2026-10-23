import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

const testEnv = process.env.TEST_ENV || 'local';

const isLocal = testEnv === 'local';
const isPreview = testEnv === 'preview';

const baseURL = isPreview
  ? `http://127.0.0.1:4176${process.env.ROOT_BASE_URL || '/'}?mode=e2e`
  : isLocal
    ? 'http://localhost:3000'
    : 'https://nusr.github.io/excel?mode=e2e';

process.env.BASE_URL = baseURL;

// Avoid Linux headless WebKit's accelerated canvas rendering hangs.
const webkitLaunchOptions =
  process.platform === 'linux'
    ? { env: { ...process.env, WEBKIT_SKIA_ENABLE_CPU_RENDERING: '1' } }
    : {};

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  failOnFlakyTests: false,
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : 5,
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
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], launchOptions: webkitLaunchOptions },
    },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'], launchOptions: webkitLaunchOptions },
    },
    {
      name: 'ipad-pro',
      use: { ...devices['iPad Pro 11'], launchOptions: webkitLaunchOptions },
    },
  ],
  webServer:
    isLocal || isPreview
      ? {
          command: isPreview
            ? 'yarn workspace frontend run vite preview --host 127.0.0.1 --port 4176 --strictPort'
            : 'yarn start:e2e',
          url: baseURL,
          reuseExistingServer: !isCI && !isPreview,
          timeout: 120 * 1000,
        }
      : undefined,
  expect: {
    timeout: 10 * 1000,
  },
});
