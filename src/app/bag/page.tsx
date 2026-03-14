"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container/Container";
import { BagItem } from "@/components/bag/BagItem/BagItem";
import { BagSummary } from "@/components/bag/BagSummary/BagSummary";
import { useBag } from "@/hooks/useBag";

export default function BagPage() {
  const { items } = useBag();

  return (
    <div className="py-16 md:py-24">
      <Container>
        <h1 className="font-heading text-3xl md:text-5xl font-light tracking-widest uppercase mb-12">
          Sacola
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-2xl font-light tracking-widest uppercase mb-4">
              Sua sacola está vazia
            </p>
            <p className="text-sm text-[#111111]/50 font-body mb-8">
              Explore nossas coleções e adicione peças que você amou.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-[#111111]/80 transition-colors font-body"
            >
              Ver Coleções
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Lista de itens */}
            <div className="lg:col-span-2">
              {items.map((item) => (
                <BagItem
                  key={`${item.productId}-${item.selectedSize}-${item.selectedColor.hex}`}
                  item={item}
                />
              ))}
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BagSummary />
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
