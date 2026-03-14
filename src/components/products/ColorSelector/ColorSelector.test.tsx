import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColorSelector } from "./ColorSelector";
import type { ProductColor } from "@/types/product";

const colors: ProductColor[] = [
  { name: "Off-White", hex: "#F5F0E8" },
  { name: "Areia", hex: "#C8B89A" },
];

describe("ColorSelector", () => {
  it("should render all color options", () => {
    render(<ColorSelector colors={colors} selectedColor={null} onChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: /off-white/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /areia/i })).toBeInTheDocument();
  });

  it("should mark selected color as pressed", () => {
    render(
      <ColorSelector colors={colors} selectedColor={colors[0]} onChange={jest.fn()} />
    );
    const selectedBtn = screen.getByRole("button", { name: /off-white — selecionada/i });
    expect(selectedBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("should call onChange with the clicked color", async () => {
    const onChange = jest.fn();
    render(<ColorSelector colors={colors} selectedColor={null} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: /areia$/i }));
    expect(onChange).toHaveBeenCalledWith(colors[1]);
  });

  it("should display selected color name", () => {
    render(
      <ColorSelector colors={colors} selectedColor={colors[0]} onChange={jest.fn()} />
    );
    expect(screen.getByText("Off-White")).toBeInTheDocument();
  });
});
