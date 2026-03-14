import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load and show the brand name", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /stheany ribeiro/i })).toBeVisible();
  });

  test("should have hero section with CTA link", async ({ page }) => {
    const cta = page.getByRole("link", { name: /ver cole/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/collections");
  });

  test("should show header with navigation links", async ({ page }) => {
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("link", { name: /cole/i }).first()).toBeVisible();
  });

  test("should navigate to collections when CTA is clicked", async ({ page }) => {
    await page.getByRole("link", { name: /ver cole/i }).click();
    await expect(page).toHaveURL("/collections");
  });

  test("should show footer", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });
});
