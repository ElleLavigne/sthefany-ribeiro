import { test, expect } from "@playwright/test";

test.describe("Collections", () => {
  test("should load collections page", async ({ page }) => {
    await page.goto("/collections");
    await expect(page.getByRole("heading", { name: /cole/i })).toBeVisible();
  });

  test("should show all collections as links", async ({ page }) => {
    await page.goto("/collections");
    const links = page.getByRole("link", { name: /ver coleção/i });
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should navigate to a collection detail page", async ({ page }) => {
    await page.goto("/collections");
    await page.getByRole("link", { name: /ver coleção essenciais/i }).click();
    await expect(page).toHaveURL("/collections/essenciais");
    await expect(page.getByRole("heading", { name: /essenciais/i })).toBeVisible();
  });

  test("should show products in collection page", async ({ page }) => {
    await page.goto("/collections/essenciais");
    const productLinks = page.getByRole("link").filter({ hasText: /r\$/i });
    const count = await productLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should return 404 for non-existent collection", async ({ page }) => {
    const response = await page.goto("/collections/colecao-inexistente");
    expect(response?.status()).toBe(404);
  });
});
