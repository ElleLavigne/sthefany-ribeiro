import { renderHook, act } from "@testing-library/react";
import { BagProvider, useBagContext } from "../BagContext";
import type { BagItem } from "@/types/bag";

const mockItem: BagItem = {
  productId: "prod_001",
  slug: "vestido-linho-off-white",
  name: "Vestido Linho Off-White",
  selectedSize: "M",
  selectedColor: { name: "Off-White", hex: "#F5F0E8" },
  quantity: 1,
  price: 59900,
  image: "/images/products/vestido-01.jpg",
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <BagProvider>{children}</BagProvider>;
}

describe("BagContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should start with empty bag", () => {
    const { result } = renderHook(() => useBagContext(), { wrapper });
    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it("should add item to bag", () => {
    const { result } = renderHook(() => useBagContext(), { wrapper });
    act(() => {
      result.current.addItem(mockItem);
    });
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].productId).toBe("prod_001");
  });

  it("should increment quantity when same item is added", () => {
    const { result } = renderHook(() => useBagContext(), { wrapper });
    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem(mockItem);
    });
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].quantity).toBe(2);
  });

  it("should remove item from bag", () => {
    const { result } = renderHook(() => useBagContext(), { wrapper });
    act(() => {
      result.current.addItem(mockItem);
    });
    act(() => {
      result.current.removeItem("prod_001", "M", "#F5F0E8");
    });
    expect(result.current.state.items).toHaveLength(0);
  });

  it("should update item quantity", () => {
    const { result } = renderHook(() => useBagContext(), { wrapper });
    act(() => {
      result.current.addItem(mockItem);
    });
    act(() => {
      result.current.updateQuantity("prod_001", "M", "#F5F0E8", 3);
    });
    expect(result.current.state.items[0].quantity).toBe(3);
  });

  it("should remove item when quantity is set to 0", () => {
    const { result } = renderHook(() => useBagContext(), { wrapper });
    act(() => {
      result.current.addItem(mockItem);
    });
    act(() => {
      result.current.updateQuantity("prod_001", "M", "#F5F0E8", 0);
    });
    expect(result.current.state.items).toHaveLength(0);
  });

  it("should calculate totalItems correctly", () => {
    const { result } = renderHook(() => useBagContext(), { wrapper });
    act(() => {
      result.current.addItem({ ...mockItem, quantity: 2 });
      result.current.addItem({
        ...mockItem,
        productId: "prod_002",
        slug: "outro",
        selectedSize: "G",
        quantity: 3,
      });
    });
    expect(result.current.totalItems).toBe(5);
  });

  it("should calculate totalPrice correctly", () => {
    const { result } = renderHook(() => useBagContext(), { wrapper });
    act(() => {
      result.current.addItem({ ...mockItem, quantity: 2, price: 59900 });
    });
    expect(result.current.totalPrice).toBe(119800);
  });

  it("should clear the bag", () => {
    const { result } = renderHook(() => useBagContext(), { wrapper });
    act(() => {
      result.current.addItem(mockItem);
    });
    act(() => {
      result.current.clearBag();
    });
    expect(result.current.state.items).toHaveLength(0);
  });

  it("should open and close the bag", () => {
    const { result } = renderHook(() => useBagContext(), { wrapper });
    expect(result.current.state.isOpen).toBe(false);
    act(() => {
      result.current.openBag();
    });
    expect(result.current.state.isOpen).toBe(true);
    act(() => {
      result.current.closeBag();
    });
    expect(result.current.state.isOpen).toBe(false);
  });

  it("should throw when used outside provider", () => {
    // Suprimir o console.error do React durante este teste
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderHook(() => useBagContext());
    }).toThrow("useBagContext must be used within BagProvider");
    consoleSpy.mockRestore();
  });
});
