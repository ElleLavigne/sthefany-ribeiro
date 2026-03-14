"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Product, ProductColor } from "@/types/product";
import { Badge } from "@/components/ui/Badge/Badge";
import { formatPrice, getDiscountPercent, formatInstallments } from "@/lib/utils/formatPrice";
import { useBag } from "@/hooks/useBag";
import { cn } from "@/lib/utils/cn";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addProductToBag } = useBag();

  const hasDiscount =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? getDiscountPercent(product.compareAtPrice!, product.price)
    : 0;

  const defaultColor: ProductColor = product.colors[0];

  function handleAddToBag() {
    if (!selectedSize) return;
    addProductToBag(product, selectedSize, defaultColor);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickAddOpen(false);
      setSelectedSize(null);
    }, 1500);
  }

  return (
    <div className="group flex flex-col w-96 shrink-0">
      {/* Imagem */}
      <div className="relative h-136.5 overflow-hidden bg-stone-50 mb-3">
        <Link
          href={`/products/${product.slug}`}
          aria-label={`Ver detalhes de ${product.name}`}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge variant="new">Novo</Badge>}
          {hasDiscount && <Badge variant="sale">-{discountPercent}%</Badge>}
        </div>

        {/* Botão sacola — aparece no hover ou quick-add aberto */}
        {!quickAddOpen && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={() => setQuickAddOpen(true)}
              className="w-full bg-brand-brown text-white text-[10px] tracking-widest uppercase py-3 font-medium hover:bg-brand-olive transition-colors"
            >
              Adicionar à Sacola
            </button>
          </div>
        )}

        {/* Quick-add inline */}
        {quickAddOpen && (
          <div className="absolute inset-x-0 bottom-0 bg-white/95 p-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-widest uppercase text-stone-600 font-medium">
                Tamanho
              </p>
              <button
                onClick={() => { setQuickAddOpen(false); setSelectedSize(null); }}
                aria-label="Fechar"
                className="text-stone-400 hover:text-stone-950 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
                  className={cn(
                    "min-w-9 h-8 px-2 border text-[10px] tracking-wide font-medium transition-all",
                    selectedSize === size
                      ? "border-brand-brown bg-brand-brown text-white"
                      : "border-stone-400 text-stone-600 hover:border-brand-brown"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={handleAddToBag}
              disabled={!selectedSize || added}
              className={cn(
                "w-full py-2 text-[10px] tracking-widest uppercase font-medium transition-colors",
                added
                  ? "bg-brand-olive text-white"
                  : selectedSize
                  ? "bg-brand-brown text-white hover:bg-brand-olive"
                  : "bg-stone-50 text-stone-400 cursor-not-allowed"
              )}
            >
              {added ? "Adicionado ✓" : "Confirmar"}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-medium text-stone-950 hover:text-brand-olive transition-colors leading-snug"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-stone-950">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-stone-400 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
        <p className="text-[10px] text-stone-400">
          {formatInstallments(product.price)}
          {" "}sem juros
        </p>
      </div>
    </div>
  );
}
