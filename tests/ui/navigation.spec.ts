import { test, expect } from "../../src/fixtures/auth.fixture";

test.beforeEach(async ({ loginPage, dashboardPage }) => {
  await loginPage.login("testuser", "testpassword");
  await dashboardPage.assertDashboardLoaded();
});

test.describe("@smoke Navigation", () => {
  test("should display the main navigation menu", async ({ page }) => {
    await expect(page.locator(".main-menu")).toBeVisible();
  });

  test("should show Credit cards nav item", async ({ page }) => {
    await expect(page.getByRole("link", { name: /credit cards/i }).first()).toBeVisible();
  });

  test("should show Debit cards nav item", async ({ page }) => {
    await expect(page.getByRole("link", { name: /debit cards/i }).first()).toBeVisible();
  });

  test("should show Loans nav item", async ({ page }) => {
    await expect(page.getByRole("link", { name: /loans/i }).first()).toBeVisible();
  });

  test("should show Mortgages nav item", async ({ page }) => {
    await expect(page.getByRole("link", { name: /mortgages/i }).first()).toBeVisible();
  });
});

test.describe("@regression Navigation - User Identity", () => {
  test("should display the logged-in username on the dashboard", async ({ page }) => {
    const name = await page.locator(".logged-user-name").textContent();
    expect((name ?? "").trim().length).toBeGreaterThan(0);
  });

  test("should display the user role label", async ({ page }) => {
    await expect(page.locator(".logged-user-role")).toBeVisible();
  });

  test("should not show the word 'undefined' anywhere in the header", async ({ page }) => {
    const header = await page.locator(".top-bar").textContent();
    expect(header).not.toContain("undefined");
    expect(header).not.toContain("null");
  });

  test("should show all four nav sections simultaneously", async ({ page }) => {
    const items = await page.locator(".main-menu a").count();
    expect(items).toBeGreaterThanOrEqual(4);
  });
});

test.describe("@regression Navigation - Responsive Layout", () => {
  test("should render dashboard correctly at 1280×800 (desktop)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator(".main-menu")).toBeVisible();
    await expect(page.locator(".balance-value").first()).toBeVisible();
  });

  test("should render dashboard correctly at 768×1024 (tablet)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator(".balance-value").first()).toBeVisible();
  });

  test("should render dashboard correctly at 375×812 (mobile)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator("body")).toBeVisible();
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).not.toContain("undefined");
  });
});
