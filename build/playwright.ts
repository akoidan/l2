import {
  devices,
  PlaywrightTestConfig
} from '@playwright/test';


export const envConfig: {
  TEST_BASE_URL: string;
  PLAYWRITE_RUN_SERVOR: boolean;
  PORT: number;
  PUBLIC_PATH: string | null;
  OPEN_PLAYWRIGHT_REPORTS: boolean;
  PLAYWRIGHT_TRACE: boolean;
  FORBID_ONLY?: true;
} = process.env.VITE_BUILD_ENV == 'local' ? require('./local.json') : require('./test.json');

export function getPlaywrightTestConfig(): PlaywrightTestConfig {
  const config: PlaywrightTestConfig = {
    testDir: './playwright/e2e',
    outputDir: './playwright/test-results',
    forbidOnly: !!envConfig.FORBID_ONLY,
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
      ['html', { outputFolder: './playwright/test-report', open: envConfig.OPEN_PLAYWRIGHT_REPORTS ? 'always' : 'never'}],
      ['list', { printSteps: true }],
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
      /* Base URL to use in actions like `await page.goto('/')`. */
      baseURL: envConfig.TEST_BASE_URL,

      /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      trace: envConfig.PLAYWRIGHT_TRACE ? 'on' : 'off',
      video: envConfig.PLAYWRIGHT_TRACE ? 'retain-on-failure' : 'off',
    },

    snapshotDir: 'playwright/test-screenshots',
    /* Configure projects for major browsers */
    projects: [
      {
        name: 'chromium',
        use: {
          ...devices['Desktop Chrome'],
          viewport: {
            width: 1440, // figma sizes
            height: 1024,
          },
        },
      },
      // {
      //   name: 'firefox',
      //   use: {
      //     ...devices['Desktop Firefox'],
      //     viewport: {
      //       width: 1440, // figma sizes
      //       height: 1024,
      //     },
      //   },
      // },
    ],
  };

  if (envConfig.PLAYWRITE_RUN_SERVOR) {
    config.webServer = {
      command: `node ./build/servor.js`,
      url: envConfig.TEST_BASE_URL,
      reuseExistingServer: true,
      env: {
        VITE_BUILD_ENV: process.env.VITE_BUILD_ENV
      }
    };
  }
  return config;
}

