"use client";

import Image from "next/image";
import Link from "next/link";
import type { BagItem as BagItemType } from "@/types/bag";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useBag } from "@/hooks/useBag";

interface BagItemProps {
  item: BagItemType;
}

export function BagItem({ item }: BagItemProps) {
  const { removeItem, updateQuantity } = useBag();
  const colorKey = item.selectedColor.hex;

  return (
    <div className="flex gap-4 py-4 border-b border-[#E5E5E5] last:border-0">
      {/* Imagem */}
      <Link href={`/products/${item.slug}`} className="flex-shrink-0">
        <div className="relative w-20 h-24 bg-[#F5F5F5] overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover object-top"
            sizes="80px"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="font-body text-sm text-[#111111] hover:text-[#111111]/60 transition-colors line-clamp-2 mb-1 block"
        >
          {item.name}
        </Link>
        <p className="text-xs text-[#111111]/50 font-body mb-1">
          {item.selectedColor.name} · {item.selectedSize}
        </p>
        <p className="font-body text-sm font-medium">
          {formatPrice(item.price)}
        </p>

        {/* Controles de quantidade */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-[#E5E5E5]">
            <button
              onClick={() =>
                updateQuantity(item.productId, item.selectedSize, colorKey, item.quantity - 1)
              }
              aria-label="Diminuir quantidade"
              className="w-8 h-8 flex items-center justify-center text-[#111111]/60 hover:text-[#111111] transition-colors"
            >
              −
            </button>
            <span
              className="w-8 text-center font-body text-sm"
              aria-label={`Quantidade: ${item.quantity}`}
            >
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(item.productId, item.selectedSize, colorKey, item.quantity + 1)
              }
              aria-label="Aumentar quantidade"
              className="w-8 h-8 flex items-center justify-center text-[#111111]/60 hover:text-[#111111] transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.productId, item.selectedSize, colorKey)}
            aria-label={`Remover ${item.name} da sacola`}
            className="text-[10px] tracking-widest uppercase text-[#111111]/40 hover:text-[#111111] transition-colors font-body underline underline-offset-2"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
