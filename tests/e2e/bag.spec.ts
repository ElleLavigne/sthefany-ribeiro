import { test, expect } from "@playwright/test";

test.describe("Bag", () => {
  test.beforeEach(async ({ page }) => {
    // Limpar localStorage antes de cada teste
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("should open bag sidebar when bag icon is clicked", async ({ page }) => {
    const bagBtn = page.getByRole("button", { name: /sacola de compras/i });
    await bagBtn.click();
    const sidebar = page.getByRole("dialog", { name: /sacola/i });
    await expect(sidebar).toBeVisible();
  });

  test("should show empty state in empty bag", async ({ page }) => {
    const bagBtn = page.getByRole("button", { name: /sacola de compras/i });
    await bagBtn.click();
    await expect(page.getByText(/sacola vazia/i)).toBeVisible();
  });

  test("should close bag sidebar with close button", async ({ page }) => {
    await page.getByRole("button", { name: /sacola de compras/i }).click();
    await page.getByRole("button", { name: /fechar sacola/i }).click();
    const sidebar = page.getByRole("dialog", { name: /sacola/i });
    await expect(sidebar).toHaveClass(/translate-x-full/);
  });

  test("should close bag sidebar with Escape key", async ({ page }) => {
    await page.getByRole("button", { name: /sacola de compras/i }).click();
    await page.keyboard.press("Escape");
    const sidebar = page.getByRole("dialog", { name: /sacola/i });
    await expect(sidebar).toHaveClass(/translate-x-full/);
  });

  test("should add product to bag and show in sidebar", async ({ page }) => {
    await page.goto("/products/vestido-linho-off-white");

    // Selecionar tamanho e cor
    await page.getByRole("button", { name: /tamanho m$/i }).click();
    await page.getByRole("button", { name: /cor off-white$/i }).click();

    // Adicionar à sacola
    await page.getByRole("button", { name: /adicionar.*sacola/i }).click();

    // Verificar sidebar abriu com o produto
    const sidebar = page.getByRole("dialog", { name: /sacola/i });
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByText("Vestido Linho Off-White")).toBeVisible();
  });

  test("should show item count in header after adding product", async ({ page }) => {
    await page.goto("/products/vestido-linho-off-white");
    await page.getByRole("button", { name: /tamanho m$/i }).click();
    await page.getByRole("button", { name: /cor off-white$/i }).click();
    await page.getByRole("button", { name: /adicionar.*sacola/i }).click();

    // Badge de contagem no header
    await page.getByRole("button", { name: /fechar sacola/i }).click();
    const bagBtn = page.getByRole("button", { name: /sacola de compras — 1 item/i });
    await expect(bagBtn).toBeVisible();
  });

  test("bag page should show empty state when no items", async ({ page }) => {
    await page.goto("/bag");
    await expect(page.getByText(/sacola está vazia/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /ver cole/i })).toBeVisible();
  });
});
