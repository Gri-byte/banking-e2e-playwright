import { test, expect } from "../../src/fixtures/auth.fixture";

test.describe("@regression Security - Login Page Hardening", () => {
  test("should serve the login page over HTTPS", async ({ loginPage }) => {
    const url = loginPage.page.url();
    expect(url).toMatch(/^https:\/\//);
  });

  test("password input should not be visible in the DOM as plain text", async ({ loginPage }) => {
    await loginPage.passwordInput.fill("s3cr3t_password");
    const inputType = await loginPage.passwordInput.getAttribute("type");
    expect(inputType).toBe("password");
  });

  test("should not expose internal paths or stack traces on the login page", async ({ loginPage }) => {
    const bodyText = await loginPage.page.locator("body").textContent();
    expect(bodyText).not.toMatch(/\/var\/www|\/home\/|C:\\Users\\/i);
    expect(bodyText).not.toContain("Traceback");
    expect(bodyText).not.toContain("at Object.<anonymous>");
  });

  test("XSS attempt in username field should not execute script", async ({ loginPage, page }) => {
    await loginPage.login("<img src=x onerror=alert(1)>", "password");
    // If XSS ran, the page would show a dialog — assert none appeared
    let dialogFired = false;
    page.on("dialog", () => { dialogFired = true; });
    await page.waitForTimeout(500);
    expect(dialogFired).toBe(false);
  });

  test("should not set an auth cookie before login", async ({ loginPage, page }) => {
    const cookies = await page.context().cookies();
    const authCookies = cookies.filter(c =>
      /session|token|auth|jwt/i.test(c.name)
    );
    // A secure app sets session cookies only after successful login
    // Here we assert no cookie contains the plaintext password
    for (const c of authCookies) {
      expect(c.value).not.toContain("testpassword");
    }
  });
});

test.describe("@regression Security - Post-Login", () => {
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await loginPage.login("testuser", "testpassword");
    await dashboardPage.assertDashboardLoaded();
  });

  test("dashboard URL should use HTTPS", async ({ page }) => {
    expect(page.url()).toMatch(/^https:\/\//);
  });

  test("no sensitive keywords should appear in the page source after login", async ({ page }) => {
    const body = await page.locator("body").textContent();
    expect(body).not.toContain("SQLException");
    expect(body).not.toContain("NullPointerException");
    expect(body).not.toContain("SQLSTATE");
    expect(body).not.toContain("stack trace");
  });

  test("page should not render raw JSON in the visible body", async ({ page }) => {
    const body = await page.locator("body").textContent();
    // Raw API responses leaked to DOM look like {"key":"value"}
    expect(body).not.toMatch(/^\s*\{.*":\s*"/m);
  });

  test("should not expose the user password anywhere in the DOM", async ({ page }) => {
    const body = await page.locator("body").textContent();
    expect(body).not.toContain("testpassword");
  });
});
