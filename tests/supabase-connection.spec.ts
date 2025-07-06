import { test, expect } from "@playwright/test";

test.describe("Supabase Connection", () => {
  test("should connect to Supabase and display table count", async ({ page }) => {
    await page.goto("/");

    // Wait for the title to be visible (be more specific about which h1)
    await expect(page.locator(".home h1")).toContainText("Sprinkler Business App");

    // Check that the Supabase connection test section is visible
    await expect(page.locator("h2")).toContainText("Database Connection");

    // Wait for the connection test to complete (success status should be visible)
    await expect(page.locator(".status.success")).toBeVisible();

    // Check that we're connected to Supabase
    await expect(page.locator(".status.success")).toContainText("Connected to Supabase!");

    // Check that tables were found
    await expect(page.locator(".status.success")).toContainText("Tables found: 4");

    // Take a screenshot of the connection test
    await page.screenshot({ path: "connection-test.png" });
  });
});
