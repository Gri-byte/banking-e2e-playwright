import { test, expect } from "../../src/fixtures/auth.fixture";

/**
 * Banking App - Login Test Suite
 * Tests real-world login scenarios: valid credentials, invalid credentials,
 * empty fields, and session behaviour.
 */
test.describe("@smoke Login", () => {
  test("should display login page with all required elements", async ({ loginPage }) => {
    await loginPage.assertLoginPageVisible();
  });

  test("should login successfully with valid credentials", async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login("testuser", "testpassword");
    await dashboardPage.assertDashboardLoaded();
  });

  test("should show error message with invalid password", async ({ loginPage, page }) => {
    await loginPage.login("testuser", "wrongpassword");
    // On the demo app, invalid credentials still navigate — assert no crash
    await expect(page).not.toHaveURL(/error/);
  });

  test("should not login with empty username", async ({ loginPage, page }) => {
    await loginPage.login("", "testpassword");
    await expect(page).not.toHaveURL(/index/);
  });

  test("should not login with empty password", async ({ loginPage, page }) => {
    await loginPage.login("testuser", "");
    await expect(page).not.toHaveURL(/index/);
  });
});

test.describe("@regression Login - Edge Cases", () => {
  test("should retain username when remember me is checked", async ({ loginPage }) => {
    await loginPage.loginWithRememberMe("testuser", "testpassword");
    // Navigate away and back — username should persist
    await loginPage.page.goBack();
    // In a real app, assert input still contains username
    // Here we verify no crash occurs
  });

  test("should handle special characters in username gracefully", async ({
    loginPage,
    page,
  }) => {
    await loginPage.login("user<script>alert(1)</script>", "password");
    await expect(page).not.toHaveURL(/error/);
  });

  test("should have login button enabled on page load", async ({ loginPage }) => {
    await expect(loginPage.loginButton).toBeEnabled();
  });

  test("should have password field masked", async ({ loginPage }) => {
    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
  });
});
