import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "./Header";
import { BagProvider } from "@/context/BagContext";

function renderWithProvider() {
  return render(
    <BagProvider>
      <Header />
    </BagProvider>
  );
}

describe("Header", () => {
  it("should render the brand name", () => {
    renderWithProvider();
    expect(screen.getByText("Stheany Ribeiro")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    renderWithProvider();
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/cat.logo/i).length).toBeGreaterThan(0);
  });

  it("should render bag button", () => {
    renderWithProvider();
    expect(
      screen.getByRole("button", { name: /sacola de compras/i })
    ).toBeInTheDocument();
  });

  it("should not show badge when bag is empty", () => {
    renderWithProvider();
    expect(screen.queryByText("9+")).not.toBeInTheDocument();
  });

  it("should toggle mobile menu when menu button is clicked", async () => {
    renderWithProvider();
    const menuButton = screen.getByRole("button", { name: "Abrir menu" });
    await userEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
  });

  it("logo should link to home page", () => {
    renderWithProvider();
    const logo = screen.getByRole("link", { name: /stheany ribeiro/i });
    expect(logo).toHaveAttribute("href", "/");
  });
});
