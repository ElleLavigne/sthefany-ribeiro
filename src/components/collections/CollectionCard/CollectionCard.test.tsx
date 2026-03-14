import { render, screen } from "@testing-library/react";
import { CollectionCard } from "./CollectionCard";
import type { Collection } from "@/types/collection";

const mockCollection: Collection = {
  id: "col_001",
  slug: "essenciais",
  name: "Essenciais",
  description: "Peças atemporais para o guarda-roupa.",
  coverImage: "/images/collections/essenciais.jpg",
  order: 1,
};

describe("CollectionCard", () => {
  it("should render the collection name", () => {
    render(<CollectionCard collection={mockCollection} />);
    expect(screen.getByText("Essenciais")).toBeInTheDocument();
  });

  it("should link to the correct collection page", () => {
    render(<CollectionCard collection={mockCollection} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/collections/essenciais");
  });

  it("should render an image with alt text", () => {
    render(<CollectionCard collection={mockCollection} />);
    const img = screen.getByAltText(/essenciais/i);
    expect(img).toBeInTheDocument();
  });

  it("should have accessible label", () => {
    render(<CollectionCard collection={mockCollection} />);
    const link = screen.getByRole("link", { name: /ver coleção essenciais/i });
    expect(link).toBeInTheDocument();
  });
});
