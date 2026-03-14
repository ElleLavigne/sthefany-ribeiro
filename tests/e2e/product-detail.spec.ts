import { test, expect } from "@playwright/test";

test.describe("Product Detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products/vestido-linho-off-white");
  });

  test("should show product name", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /vestido linho off-white/i })
    ).toBeVisible();
  });

  test("should show product price", async ({ page }) => {
    await expect(page.getByText(/r\$\s*599/i)).toBeVisible();
  });

  test("should show size selector", async ({ page }) => {
    await expect(page.getByRole("group", { name: /selecione o tamanho/i })).toBeVisible();
  });

  test("should show color selector", async ({ page }) => {
    await expect(page.getByRole("group", { name: /selecione a cor/i })).toBeVisible();
  });

  test("add to bag button should be disabled before selections", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /selecione tamanho e cor/i });
    await expect(addBtn).toBeDisabled();
  });

  test("should enable add to bag button after selecting size and color", async ({ page }) => {
    await page.getByRole("button", { name: /tamanho m$/i }).click();
    await page.getByRole("button", { name: /cor off-white$/i }).click();
    const addBtn = page.getByRole("button", { name: /adicionar.*sacola/i });
    await expect(addBtn).toBeEnabled();
  });

  test("should show breadcrumb navigation", async ({ page }) => {
    const breadcrumb = page.getByRole("navigation", { name: /localização/i });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByRole("link", { name: /início/i })).toBeVisible();
  });

  test("should return 404 for non-existent product", async ({ page }) => {
    const response = await page.goto("/products/produto-inexistente");
    expect(response?.status()).toBe(404);
  });
});
