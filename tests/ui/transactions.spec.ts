import { test, expect } from "../../src/fixtures/auth.fixture";

test.use({ storageState: undefined });

test.beforeEach(async ({ loginPage, dashboardPage }) => {
  await loginPage.login("testuser", "testpassword");
  await dashboardPage.assertDashboardLoaded();
});

test.describe("@smoke Transactions Table", () => {
  test("should display the transactions table after login", async ({ transactionPage }) => {
    await transactionPage.assertTableVisible();
  });

  test("should render all 5 expected column headers", async ({ transactionPage }) => {
    const headers = (await transactionPage.getHeaders()).map(h => h.trim());
    expect(headers).toEqual(
      expect.arrayContaining(["Status", "Date", "Description", "Category", "Amount"])
    );
  });

  test("should show at least one transaction row", async ({ transactionPage }) => {
    const count = await transactionPage.getRowCount();
    expect(count).toBeGreaterThan(0);
  });

  test("should display Make Payment action button", async ({ transactionPage }) => {
    await expect(transactionPage.makePaymentBtn).toBeVisible();
  });

  test("should display View Statement action button", async ({ transactionPage }) => {
    await expect(transactionPage.viewStatementBtn).toBeVisible();
  });

  test("should display Pay Now action button", async ({ transactionPage }) => {
    await expect(transactionPage.payNowBtn).toBeVisible();
  });
});

test.describe("@regression Transactions - Data Integrity", () => {
  test("should show only valid status labels in each row", async ({ page }) => {
    // Status text sits in the plain <span> after .status-pill inside the first <td> of each row
    const rows = page.locator("table tbody tr");
    const count = await rows.count();
    const validStatuses = ["Complete", "Declined", "Pending"];
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const statusText = await rows.nth(i).locator("td").first().locator("span:not([class])").textContent();
      expect(validStatuses).toContain((statusText ?? "").trim());
    }
  });

  test("should display amounts containing USD", async ({ page }) => {
    const rows = page.locator("table tbody tr");
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const rowText = await rows.nth(i).textContent();
      expect(rowText).toContain("USD");
    }
  });

  test("should show a non-empty description for each transaction", async ({ page }) => {
    const rows = page.locator("table tbody tr");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const text = await rows.nth(i).textContent();
      expect((text ?? "").trim().length).toBeGreaterThan(0);
    }
  });

  test("should have exactly 6 transaction rows in the demo dataset", async ({ transactionPage }) => {
    const count = await transactionPage.getRowCount();
    expect(count).toBe(6);
  });

  test("should not display raw stack traces in the transactions section", async ({ page }) => {
    const tableText = await page.locator("table").textContent();
    expect(tableText).not.toMatch(/Error:|Exception:|Traceback|undefined/i);
  });
});
