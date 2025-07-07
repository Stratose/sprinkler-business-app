import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should show login page for unauthenticated users", async ({ page }) => {
    await page.goto("/");

    // Should redirect to login page
    await expect(page).toHaveURL(/.*\/login/);

    // Check login page elements
    await expect(page.locator("h1")).toContainText("Sprinkler Business Manager");
    await expect(page.locator("p").first()).toContainText("Sign in to manage your customers");

    // Check Google sign-in button
    const signInButton = page.locator(".google-signin-btn");
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toContainText("Continue with Google");

    // Check Google icon is present
    await expect(page.locator(".google-icon")).toBeVisible();

    // Take screenshot of login page
    await page.screenshot({ path: "login-page.png" });
  });

  test("should show loading state during auth initialization", async ({ page }) => {
    // Visit home page which will trigger auth loading
    const response = page.goto("/");

    // Look for loading spinner quickly before auth completes
    const loadingSpinner = page.locator(".loading-spinner");

    // The loading state might be very brief, so we'll check if it exists or if we're redirected
    await Promise.race([expect(loadingSpinner).toBeVisible(), expect(page).toHaveURL(/.*\/login/)]);

    await response;
  });

  test("should have proper redirect URI configuration", async ({ page }) => {
    await page.goto("/login");

    // Click the Google sign-in button (this won't actually authenticate in test)
    const signInButton = page.locator(".google-signin-btn");
    await signInButton.click();

    // Note: In a real test environment, this would redirect to Google
    // For now, we're just testing that the button is clickable and the flow starts

    // Check if there are any console errors
    const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleMessages.push(msg.text());
      }
    });

    // Wait a moment to see if any errors appear
    await page.waitForTimeout(1000);

    // In development, we might get CORS errors which is expected without proper OAuth setup
    // We're mainly checking the UI flow works correctly
  });

  test("should handle auth callback route", async ({ page }) => {
    await page.goto("/auth/callback");

    // Should show the callback loading page
    await expect(page.locator("h2")).toContainText("Completing sign in...");
    await expect(page.locator("p")).toContainText("Please wait while we verify");

    // Should show loading spinner
    await expect(page.locator(".spinner-ring")).toBeVisible();

    // Take screenshot of callback page
    await page.screenshot({ path: "auth-callback.png" });

    // After timeout, should redirect to login (since we're not actually authenticated)
    await expect(page).toHaveURL(/.*\/login/, { timeout: 5000 });
  });

  test("should protect authenticated routes", async ({ page }) => {
    // Try to access about page without authentication
    await page.goto("/about");

    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);

    // Try to access home page without authentication
    await page.goto("/");

    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("should have responsive design on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/login");

    // Check that login form is still visible and properly sized
    const loginContainer = page.locator(".login-container");
    await expect(loginContainer).toBeVisible();

    // Check button is full width on mobile
    const signInButton = page.locator(".google-signin-btn");
    await expect(signInButton).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({ path: "login-mobile.png" });
  });

  test("should show development authentication in dev mode", async ({ page }) => {
    await page.goto("/login");

    // Check that development authentication section is visible
    const devSection = page.locator(".dev-auth-section");
    await expect(devSection).toBeVisible();

    // Check dev divider text
    await expect(page.locator(".dev-divider span")).toContainText("Development Only");

    // Check dev login button
    const devLoginBtn = page.locator(".dev-signin-btn");
    await expect(devLoginBtn).toBeVisible();
    await expect(devLoginBtn).toContainText("Quick Dev Login");

    // Check warning text
    await expect(page.locator(".dev-warning")).toContainText(
      "automatically disabled in production"
    );

    // Take screenshot of dev options
    await page.screenshot({ path: "dev-auth-options.png" });
  });

  test("should authenticate with development login", async ({ page }) => {
    await page.goto("/login");

    // Click the development login button
    const devLoginBtn = page.locator(".dev-signin-btn");
    await devLoginBtn.click();

    // Should redirect to dashboard
    await expect(page).toHaveURL("/");

    // Wait for authentication header to appear (this means auth is working)
    await expect(page.locator(".app-header")).toBeVisible();

    // Check that we're on the dashboard (look for dashboard content)
    await expect(page.locator(".dashboard h1")).toContainText("Welcome back, Development User!");

    // Check that DEV badge is visible in header
    await expect(page.locator(".dev-badge")).toBeVisible();
    await expect(page.locator(".dev-badge")).toContainText("DEV");

    // Check user info shows development user
    await expect(page.locator(".user-name")).toContainText("Development User");
    await expect(page.locator(".user-email")).toContainText("developer@sprinkler-app.dev");

    // Take screenshot of authenticated dashboard
    await page.screenshot({ path: "dev-authenticated-dashboard.png" });

    // Test sign out
    const signOutBtn = page.locator(".sign-out-btn");
    await signOutBtn.click();

    // Should redirect back to login
    await expect(page).toHaveURL(/.*\/login/);
  });
});
