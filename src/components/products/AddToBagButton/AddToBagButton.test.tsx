import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToBagButton } from "./AddToBagButton";
import { BagProvider } from "@/context/BagContext";
import type { Product } from "@/types/product";

const mockProduct: Product = {
  id: "prod_001",
  slug: "vestido-linho-off-white",
  name: "Vestido Linho Off-White",
  description: "Um vestido elegante.",
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

function renderWithProvider(ui: React.ReactElement) {
  return render(<BagProvider>{ui}</BagProvider>);
}

describe("AddToBagButton", () => {
  it("should be disabled when no size is selected", () => {
    renderWithProvider(
      <AddToBagButton
        product={mockProduct}
        selectedSize={null}
        selectedColor={{ name: "Off-White", hex: "#F5F0E8" }}
      />
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should be disabled when no color is selected", () => {
    renderWithProvider(
      <AddToBagButton product={mockProduct} selectedSize="M" selectedColor={null} />
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should be enabled when size and color are selected", () => {
    renderWithProvider(
      <AddToBagButton
        product={mockProduct}
        selectedSize="M"
        selectedColor={{ name: "Off-White", hex: "#F5F0E8" }}
      />
    );
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("should show 'Esgotado' when product is out of stock", () => {
    renderWithProvider(
      <AddToBagButton
        product={{ ...mockProduct, inStock: false }}
        selectedSize="M"
        selectedColor={{ name: "Off-White", hex: "#F5F0E8" }}
      />
    );
    expect(screen.getByRole("button", { name: /esgotado/i })).toBeDisabled();
  });

  it("should show helper text when selections are missing", () => {
    renderWithProvider(
      <AddToBagButton product={mockProduct} selectedSize={null} selectedColor={null} />
    );
    expect(screen.getByText(/selecione tamanho e cor/i)).toBeInTheDocument();
  });
});
