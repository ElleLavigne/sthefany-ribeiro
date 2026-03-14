import { brand } from "@config/brand";

/** Formata centavos para moeda brasileira. Ex: 59900 → "R$ 599,00" */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat(brand.currency.locale, {
    style: "currency",
    currency: brand.currency.code,
  }).format(cents / 100);
}

/** Calcula percentual de desconto. Ex: (89900, 59900) → 33 */
export function getDiscountPercent(original: number, discounted: number): number {
  if (original <= 0 || discounted >= original) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

/** Formata parcelamento. Ex: (59900, 3) → "3x de R$ 199,67" */
export function formatInstallments(cents: number, count = 3): string {
  const value = cents / 100 / count;
  return `${count}x de ${new Intl.NumberFormat(brand.currency.locale, {
    style: "currency",
    currency: brand.currency.code,
  }).format(value)}`;
}
