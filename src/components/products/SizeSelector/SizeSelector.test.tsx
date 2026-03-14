import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SizeSelector } from "./SizeSelector";

const sizes = ["PP", "P", "M", "G", "GG"];

describe("SizeSelector", () => {
  it("should render all sizes", () => {
    render(<SizeSelector sizes={sizes} selectedSize={null} onChange={jest.fn()} />);
    sizes.forEach((size) => {
      expect(screen.getByRole("button", { name: `Tamanho ${size}` })).toBeInTheDocument();
    });
  });

  it("should mark selected size as pressed", () => {
    render(<SizeSelector sizes={sizes} selectedSize="M" onChange={jest.fn()} />);
    const selectedBtn = screen.getByRole("button", { name: /tamanho m — selecionado/i });
    expect(selectedBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("should call onChange with the clicked size", async () => {
    const onChange = jest.fn();
    render(<SizeSelector sizes={sizes} selectedSize={null} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: /tamanho g$/i }));
    expect(onChange).toHaveBeenCalledWith("G");
  });

  it("should apply selected styles to selected size", () => {
    render(<SizeSelector sizes={sizes} selectedSize="P" onChange={jest.fn()} />);
    const selected = screen.getByRole("button", { name: /tamanho p — selecionado/i });
    expect(selected).toHaveClass("bg-[#111111]");
  });
});
