import { Page, Locator, expect } from "@playwright/test";

export class TransactionPage {
  readonly page: Page;
  readonly table: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;
  readonly statusCells: Locator;
  readonly amountCells: Locator;
  readonly makePaymentBtn: Locator;
  readonly viewStatementBtn: Locator;
  readonly payNowBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator("table");
    this.tableHeaders = page.locator("table thead th");
    this.tableRows = page.locator("table tbody tr");
    this.statusCells = page.locator("table tbody tr .status-pill");
    this.amountCells = page.locator("table tbody tr td").filter({ hasText: /USD/ });
    this.makePaymentBtn = page.getByRole("link", { name: /make payment/i });
    this.viewStatementBtn = page.getByRole("link", { name: /view statement/i });
    this.payNowBtn = page.getByRole("link", { name: /pay now/i });
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async getHeaders(): Promise<string[]> {
    return this.tableHeaders.allTextContents();
  }

  async assertTableVisible(): Promise<void> {
    await expect(this.table).toBeVisible();
    await expect(this.tableRows.first()).toBeVisible();
  }
}
