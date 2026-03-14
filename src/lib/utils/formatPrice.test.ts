import { formatPrice, getDiscountPercent } from "./formatPrice";

describe("formatPrice", () => {
  it("should format cents to BRL currency string", () => {
    expect(formatPrice(59900)).toBe("R$\u00a0599,00");
  });

  it("should format zero", () => {
    expect(formatPrice(0)).toBe("R$\u00a00,00");
  });

  it("should format values with cents", () => {
    expect(formatPrice(9990)).toBe("R$\u00a099,90");
  });

  it("should format large values", () => {
    expect(formatPrice(1299900)).toBe("R$\u00a012.999,00");
  });
});

describe("getDiscountPercent", () => {
  it("should calculate correct discount percentage", () => {
    expect(getDiscountPercent(89900, 59900)).toBe(33);
  });

  it("should return 0 when prices are equal", () => {
    expect(getDiscountPercent(59900, 59900)).toBe(0);
  });

  it("should return 0 when discounted is higher", () => {
    expect(getDiscountPercent(50000, 60000)).toBe(0);
  });

  it("should return 0 when original is 0", () => {
    expect(getDiscountPercent(0, 0)).toBe(0);
  });

  it("should calculate 50% discount", () => {
    expect(getDiscountPercent(100000, 50000)).toBe(50);
  });
});
