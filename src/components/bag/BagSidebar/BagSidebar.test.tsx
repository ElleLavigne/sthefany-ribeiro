import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BagSidebar } from "./BagSidebar";
import { BagProvider } from "@/context/BagContext";

function renderWithProvider() {
  return render(
    <BagProvider>
      <BagSidebar />
    </BagProvider>
  );
}

describe("BagSidebar", () => {
  it("should not be visible when closed", () => {
    renderWithProvider();
    const dialog = screen.getByRole("dialog", { name: /sacola/i });
    expect(dialog).toHaveClass("translate-x-full");
  });

  it("should show empty state when bag has no items", () => {
    renderWithProvider();
    // Sidebar needs to be opened to show content
    expect(screen.getByText("Sacola vazia")).toBeInTheDocument();
  });

  it("should render close button", () => {
    renderWithProvider();
    expect(screen.getByRole("button", { name: "Fechar sacola" })).toBeInTheDocument();
  });

  it("should have dialog role and aria-modal", () => {
    renderWithProvider();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });
});
