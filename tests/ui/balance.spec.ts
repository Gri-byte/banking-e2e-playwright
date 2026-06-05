import { test, expect } from "../../src/fixtures/auth.fixture";

test.beforeEach(async ({ loginPage, dashboardPage }) => {
  await loginPage.login("testuser", "testpassword");
  await dashboardPage.assertDashboardLoaded();
});

test.describe("@smoke Balance Summary", () => {
  test("should display Total Balance section", async ({ page }) => {
    await expect(page.getByText("Total Balance")).toBeVisible();
  });

  test("should display Credit Available section", async ({ page }) => {
    await expect(page.getByText("Credit Available")).toBeVisible();
  });

  test("should display Due Today section", async ({ page }) => {
    await expect(page.getByText("Due Today")).toBeVisible();
  });

  test("should show exactly 3 balance cards", async ({ page }) => {
    const count = await page.locator(".balance-value").count();
    expect(count).toBe(3);
  });
});

test.describe("@regression Balance - Data Validation", () => {
  test("should show a non-empty value in every balance card", async ({ page }) => {
    const values = await page.locator(".balance-value").allTextContents();
    for (const v of values) {
      expect(v.trim().length).toBeGreaterThan(0);
    }
  });

  test("should show a dollar sign in the Total Balance", async ({ page }) => {
    const totalBalance = await page.locator(".balance-value").first().textContent();
    expect(totalBalance).toContain("$");
  });

  test("should not display NaN or undefined in any balance card", async ({ page }) => {
    const values = await page.locator(".balance-value").allTextContents();
    for (const v of values) {
      expect(v).not.toContain("NaN");
      expect(v).not.toContain("undefined");
      expect(v).not.toContain("null");
    }
  });

  test("should show the Add Account action button near the balance section", async ({ page }) => {
    await expect(page.getByRole("link", { name: /add account/i })).toBeVisible();
  });

  test("should show Request Increase action button", async ({ page }) => {
    await expect(page.getByRole("link", { name: /request increase/i })).toBeVisible();
  });
});
