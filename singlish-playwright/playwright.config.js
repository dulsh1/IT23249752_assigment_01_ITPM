// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * @see https://playwright.dev/docs/test-configuration
 */

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list", { printSteps: true, colors: true }], ["html"]],
  use: {
    // baseURL intentionally omitted to avoid forced navigation
    trace: "on-first-retry",
    headless: true, // run tests in headless mode for speed
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 10000, // reduce action timeout for faster failure
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        headless: true,
        viewport: { width: 1920, height: 1080 },
        // Removed slowMo for speed
      },
    },
  ],
});
