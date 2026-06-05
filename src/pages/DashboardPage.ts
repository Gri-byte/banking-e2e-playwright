import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly accountBalance: Locator;
  readonly transactionList: Locator;
  readonly transferButton: Locator;
  readonly logoutButton: Locator;
  readonly accountRows: Locator;
  readonly userName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountBalance = page.locator(".balance-value").first();
    this.transactionList = page.locator("table tbody tr");
    this.transferButton = page.getByRole("link", { name: /make payment/i });
    this.logoutButton = page.locator(".logout-btn");
    this.accountRows = page.locator("table tbody tr");
    this.userName = page.locator(".logged-user-name");
  }

  async assertDashboardLoaded(): Promise<void> {
    // The demo app lands on /app.html (older builds used /index.html)
    await expect(this.page).toHaveURL(/(app|index)\.html/);
    await expect(this.accountBalance).toBeVisible();
  }

  async getAccountCount(): Promise<number> {
    return await this.accountRows.count();
  }

  async getBalanceText(): Promise<string> {
    return (await this.accountBalance.textContent()) ?? "";
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async assertUserNameVisible(expectedName: string): Promise<void> {
    await expect(this.userName).toContainText(expectedName);
  }
}
