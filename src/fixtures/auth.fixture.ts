import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { TransactionPage } from "../pages/TransactionPage";

type AuthFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  transactionPage: TransactionPage;
  authenticatedPage: DashboardPage;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  transactionPage: async ({ page }, use) => {
    await use(new TransactionPage(page));
  },

  // Pre-authenticated fixture — skips login UI for tests that don't need it
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_USERNAME ?? "testuser",
      process.env.TEST_PASSWORD ?? "testpassword"
    );
    const dashboard = new DashboardPage(page);
    await dashboard.assertDashboardLoaded();
    await use(dashboard);
  },
});

export { expect } from "@playwright/test";
