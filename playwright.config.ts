import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 8_000 },

  reporter: isCI
    ? [["blob"], ["github"]]
    : [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: process.env.BASE_URL || "https://demo.applitools.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    // ── Desktop browsers ──────────────────────────────────────────
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    // ── Mobile viewports ─────────────────────────────────────────
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
      testMatch: "**/navigation.spec.ts",
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
      testMatch: "**/navigation.spec.ts",
    },
  ],
});