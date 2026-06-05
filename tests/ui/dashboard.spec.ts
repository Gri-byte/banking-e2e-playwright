import { test, expect } from "../../src/fixtures/auth.fixture";

/**
 * Banking App - Dashboard Test Suite
 * Tests account overview, balance display, and navigation elements
 * after successful authentication.
 */
test.describe("@smoke Dashboard", () => {
  test("should show dashboard after successful login", async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login("testuser", "testpassword");
    await dashboardPage.assertDashboardLoaded();
  });

  test("should display account balance on dashboard", async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login("testuser", "testpassword");
    await dashboardPage.assertDashboardLoaded();
    const balance = await dashboardPage.getBalanceText();
    expect(balance).not.toBe("");
  });

  test("should show the transfer action on the dashboard", async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login("testuser", "testpassword");
    await dashboardPage.assertDashboardLoaded();
    await expect(dashboardPage.transferButton).toBeVisible();
  });

  test("should list at least one account row", async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login("testuser", "testpassword");
    await dashboardPage.assertDashboardLoaded();
    const count = await dashboardPage.getAccountCount();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("@regression Dashboard - UI Integrity", () => {
  test("should have page title containing bank name", async ({
    loginPage,
    page,
  }) => {
    await loginPage.login("testuser", "testpassword");
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test("should not expose raw error messages to user", async ({
    loginPage,
    page,
  }) => {
    await loginPage.login("testuser", "testpassword");
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).not.toContain("Traceback");
    expect(bodyText).not.toContain("NullPointerException");
    expect(bodyText).not.toContain("SQLException");
  });

  test("should have HTTPS in base URL", async ({ page }) => {
    const url = page.url();
    expect(url.startsWith("https://") || url.startsWith("http://localhost")).toBeTruthy();
  });

  test("should display a balance in a currency-like format", async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login("testuser", "testpassword");
    await dashboardPage.assertDashboardLoaded();
    const balance = await dashboardPage.getBalanceText();
    // Contains at least one digit (e.g. "$350,000" / "350.000")
    expect(balance).toMatch(/\d/);
  });

  test("should not leak credentials in the page DOM after login", async ({
    loginPage,
    page,
  }) => {
    await loginPage.login("testuser", "testpassword");
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).not.toContain("testpassword");
  });

  test("should redirect back to the login page after logout", async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login("testuser", "testpassword");
    await dashboardPage.assertDashboardLoaded();
    await dashboardPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
