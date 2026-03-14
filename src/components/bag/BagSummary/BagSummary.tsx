"use client";

import { formatPrice } from "@/lib/utils/formatPrice";
import { useBag } from "@/hooks/useBag";
import { brand } from "@config/brand";

function buildWhatsAppMessage(
  items: ReturnType<typeof useBag>["items"],
  total: number
): string {
  const lines: string[] = ["*Olá! Gostaria de fazer um pedido:*", ""];
  for (const item of items) {
    const colorName =
      typeof item.selectedColor === "object" && item.selectedColor !== null
        ? (item.selectedColor as { name: string }).name
        : String(item.selectedColor);
    lines.push(
      `• ${item.name} — Tam. ${item.selectedSize} / ${colorName} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`
    );
  }
  lines.push("");
  lines.push(`*Total: ${formatPrice(total)}*`);
  return lines.join("\n");
}

export function BagSummary() {
  const { items, totalPrice } = useBag();
  const shippingThreshold = brand.shipping.freeAbove;
  const freeShipping = totalPrice >= shippingThreshold;
  const remaining = shippingThreshold - totalPrice;

  const whatsappNumber = brand.contact.whatsapp.replace(/\D/g, "");
  const whatsappHref =
    items.length > 0
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(items, totalPrice))}`
      : undefined;

  return (
    <div className="border-t border-brand-warm/30 pt-6 space-y-4">
      {/* Frete grátis */}
      {!freeShipping && (
        <p className="text-[10px] tracking-widest uppercase text-stone-400 text-center">
          Faltam {formatPrice(remaining)} para frete grátis
        </p>
      )}
      {freeShipping && (
        <p className="text-[10px] tracking-widest uppercase text-brand-olive text-center">
          Frete grátis aplicado ✓
        </p>
      )}

      {/* Total */}
      <div className="flex items-center justify-between py-3 border-t border-brand-warm/30">
        <span className="text-xs tracking-widest uppercase text-stone-600">Total</span>
        <span className="text-base font-semibold text-stone-950">{formatPrice(totalPrice)}</span>
      </div>

      {/* CTA */}
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-brand-brown text-white py-3 text-[10px] tracking-widest uppercase font-medium hover:bg-brand-olive transition-colors"
        >
          Finalizar pelo WhatsApp
        </a>
      ) : (
        <button
          disabled
          className="w-full bg-stone-200 text-stone-400 py-3 text-[10px] tracking-widest uppercase font-medium cursor-not-allowed"
        >
          Finalizar Compra
        </button>
      )}

      {/* Pagamento */}
      <div className="pt-4 border-t border-brand-warm/30 space-y-2">
        <p className="text-[10px] tracking-widest uppercase text-stone-600 font-semibold">
          Formas de pagamento
        </p>
        <p className="text-[10px] text-stone-400 leading-relaxed">
          Todos os cartões de crédito e débito (exceto Credshop), Pix e dinheiro (espécie).
        </p>
      </div>
    </div>
  );
}
