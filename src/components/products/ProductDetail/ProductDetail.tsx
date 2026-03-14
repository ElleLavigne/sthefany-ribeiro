"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product, ProductColor } from "@/types/product";
import { SizeSelector } from "../SizeSelector/SizeSelector";
import { ColorSelector } from "../ColorSelector/ColorSelector";
import { AddToBagButton } from "../AddToBagButton/AddToBagButton";
import { formatPrice, getDiscountPercent } from "@/lib/utils/formatPrice";
import { Badge } from "@/components/ui/Badge/Badge";
import { cn } from "@/lib/utils/cn";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const hasDiscount =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Galeria de imagens */}
      <div className="space-y-3">
        {/* Imagem principal */}
        <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
          <Image
            src={product.images[selectedImage]}
            alt={`${product.name} — imagem ${selectedImage + 1}`}
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {product.isNew && (
            <div className="absolute top-4 left-4">
              <Badge variant="new">Novo</Badge>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                aria-label={`Ver imagem ${idx + 1}`}
                aria-pressed={selectedImage === idx}
                className={cn(
                  "relative w-20 h-24 flex-shrink-0 overflow-hidden bg-[#F5F5F5] border transition-all",
                  selectedImage === idx
                    ? "border-[#111111]"
                    : "border-transparent hover:border-[#E5E5E5]"
                )}
              >
                <Image
                  src={img}
                  alt={`${product.name} — miniatura ${idx + 1}`}
                  fill
                  className="object-cover object-top"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info do produto */}
      <div className="lg:pt-4 space-y-8">
        {/* Nome e preço */}
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-light tracking-widest uppercase mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-body text-xl font-medium">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="font-body text-sm text-[#111111]/50 line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
                <Badge variant="sale">
                  -{getDiscountPercent(product.compareAtPrice!, product.price)}%
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Seletores */}
        <div className="space-y-6">
          <ColorSelector
            colors={product.colors}
            selectedColor={selectedColor}
            onChange={setSelectedColor}
          />
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onChange={setSelectedSize}
          />
        </div>

        {/* Botão adicionar */}
        <AddToBagButton
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
        />

        {/* Descrição */}
        <div className="border-t border-[#E5E5E5] pt-6">
          <p className="font-body text-sm text-[#111111]/70 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Detalhes (acordeão) */}
        {product.details.length > 0 && (
          <div className="border-t border-[#E5E5E5]">
            <button
              className="w-full flex items-center justify-between py-4 text-[10px] tracking-widest uppercase font-body hover:text-[#111111]/60 transition-colors"
              onClick={() => setDetailsOpen(!detailsOpen)}
              aria-expanded={detailsOpen}
            >
              <span>Composição & Cuidados</span>
              <span aria-hidden="true">{detailsOpen ? "−" : "+"}</span>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                detailsOpen ? "max-h-96 pb-4" : "max-h-0"
              )}
            >
              <ul className="space-y-2">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="font-body text-xs text-[#111111]/70 flex items-start gap-2">
                    <span className="text-[#C8A882] mt-0.5" aria-hidden="true">—</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
