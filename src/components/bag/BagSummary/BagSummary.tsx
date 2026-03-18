"use client";

import Link from "next/link";
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
  const { items, totalPrice, closeBag } = useBag();
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

      <Link
        href="/collections"
        onClick={closeBag}
        className="flex items-center justify-center w-full border border-stone-950 text-stone-950 py-3 text-[10px] tracking-widest uppercase font-medium hover:bg-stone-950 hover:text-white transition-colors"
      >
        Continuar Comprando
      </Link>

      {/* Pagamento */}
      <div className="pt-4 border-t border-brand-warm/30 space-y-3">
        <p className="text-[10px] tracking-widest uppercase text-stone-950 font-semibold">
          Formas de pagamento
        </p>
        <div className="flex flex-wrap gap-3">
          <PaymentMethod icon={<CreditCardIcon />} label="Crédito" />
          <PaymentMethod icon={<DebitCardIcon />} label="Débito" />
          <PaymentMethod icon={<PixIcon />} label="Pix" />
          <PaymentMethod icon={<CashIcon />} label="Espécie" />
        </div>
        <p className="text-[10px] text-stone-950 leading-relaxed">
          Aceitamos todos os cartões, exceto Credshop.
        </p>
      </div>
    </div>
  );
}

function PaymentMethod({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-stone-950">
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}

function CreditCardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function DebitCardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
      <circle cx="18" cy="16" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PixIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.17 10.83l-2.34-2.34a2.5 2.5 0 00-3.54 0L4.46 11.32a2.5 2.5 0 000 3.54l2.83 2.83a2.5 2.5 0 003.54 0l2.34-2.34" />
      <path d="M10.83 13.17l2.34 2.34a2.5 2.5 0 003.54 0l2.83-2.83a2.5 2.5 0 000-3.54l-2.83-2.83a2.5 2.5 0 00-3.54 0l-2.34 2.34" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M2 10h1M21 10h1M2 14h1M21 14h1" />
    </svg>
  );
}
