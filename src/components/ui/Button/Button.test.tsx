import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("should render children", () => {
    render(<Button>Adicionar</Button>);
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
  });

  it("should apply primary variant classes by default", () => {
    render(<Button>Clique</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("bg-[#111111]");
  });

  it("should apply secondary variant classes", () => {
    render(<Button variant="secondary">Clique</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("border");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Clique</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should not call onClick when disabled", async () => {
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>Clique</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("should show loading spinner and be disabled when loading", () => {
    render(<Button loading>Salvando</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("should accept custom className", () => {
    render(<Button className="w-full">Clique</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });
});
