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
    this.accountBalance = page.locator(".total-value").first();
    this.transactionList = page.locator(".table-row");
    this.transferButton = page.locator("[data-id='btn-transfer']");
    this.logoutButton = page.locator(".logout-btn");
    this.accountRows = page.locator(".account-row");
    this.userName = page.locator(".logged-user-name");
  }

  async assertDashboardLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*index/);
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
