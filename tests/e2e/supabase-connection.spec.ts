import { test, expect } from "@playwright/test";

test.describe("Supabase Connection", () => {
  test("should redirect to login and show professional interface", async ({ page }) => {
    await page.goto("/");

    // Should redirect to login page since we're not authenticated
    await expect(page).toHaveURL(/.*\/login/);

    // Check that the login page is properly loaded
    await expect(page.locator("h1")).toContainText("Sprinkler Business Manager");

    // Check that the Google sign-in button is visible (this validates our Supabase integration)
    await expect(page.locator(".google-signin-btn")).toBeVisible();

    // Take a screenshot for verification
    await page.screenshot({ path: "auth-redirect-test.png" });
  });
});
