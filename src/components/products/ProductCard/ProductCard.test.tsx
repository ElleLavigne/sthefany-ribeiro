import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "./ProductCard";
import { BagProvider } from "@/context/BagContext";
import type { Product } from "@/types/product";

const mockProduct: Product = {
  id: "prod_001",
  slug: "vestido-linho-off-white",
  name: "Vestido Linho Off-White",
  description: "Um vestido de linho elegante.",
  details: ["100% Linho"],
  price: 59900,
  compareAtPrice: null,
  images: ["/images/products/vestido-01.jpg"],
  sizes: ["PP", "P", "M", "G", "GG"],
  colors: [{ name: "Off-White", hex: "#F5F0E8" }],
  collectionSlug: "verao-2025",
  isNew: true,
  isFeatured: true,
  inStock: true,
  tags: ["vestido"],
  createdAt: "2026-01-10T00:00:00.000Z",
};

function renderCard(product = mockProduct) {
  return render(
    <BagProvider>
      <ProductCard product={product} />
    </BagProvider>
  );
}

describe("ProductCard", () => {
  it("should render the product name", () => {
    renderCard();
    expect(screen.getAllByText("Vestido Linho Off-White").length).toBeGreaterThan(0);
  });

  it("should render the formatted price", () => {
    renderCard();
    expect(screen.getByText(/599/)).toBeInTheDocument();
  });

  it("should render installment text", () => {
    renderCard();
    expect(screen.getByText(/3x de/i)).toBeInTheDocument();
  });

  it("should link to the product detail page", () => {
    renderCard();
    const links = screen.getAllByRole("link");
    const productLink = links.find((l) =>
      l.getAttribute("href") === "/products/vestido-linho-off-white"
    );
    expect(productLink).toBeInTheDocument();
  });

  it("should show 'Novo' badge when isNew is true", () => {
    renderCard();
    expect(screen.getByText("Novo")).toBeInTheDocument();
  });

  it("should not show 'Novo' badge when isNew is false", () => {
    renderCard({ ...mockProduct, isNew: false });
    expect(screen.queryByText("Novo")).not.toBeInTheDocument();
  });

  it("should show 'Adicionar à Sacola' button on hover interaction", async () => {
    renderCard();
    const addBtn = screen.getByText(/adicionar/i);
    expect(addBtn).toBeInTheDocument();
  });

  it("should open quick-add size selector when bag button clicked", async () => {
    renderCard();
    await userEvent.click(screen.getByText(/adicionar/i));
    expect(screen.getByText("Tamanho")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar/i })).toBeInTheDocument();
  });

  it("should show discount badge when compareAtPrice is set", () => {
    renderCard({ ...mockProduct, compareAtPrice: 89900, isNew: false });
    expect(screen.getByText(/-\d+%/)).toBeInTheDocument();
  });
});
