import { render, screen } from "@testing-library/react";
import { HeroSection } from "./HeroSection";

describe("HeroSection", () => {
  it("should render the brand name as heading", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("heading", { name: /stheany ribeiro/i })
    ).toBeInTheDocument();
  });

  it("should render a link to collections", () => {
    render(<HeroSection />);
    const link = screen.getByRole("link", { name: /ver cat/i });
    expect(link).toHaveAttribute("href", "/collections");
  });

  it("should have a section with accessible label", () => {
    render(<HeroSection />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });
});
