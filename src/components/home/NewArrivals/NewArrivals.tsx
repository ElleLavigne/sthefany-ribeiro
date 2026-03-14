import Link from "next/link";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid/ProductGrid";
import { Container } from "@/components/layout/Container/Container";

interface NewArrivalsProps {
  products: Product[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  const newProducts = products.slice(0, 4);

  return (
    <section aria-label="Novidades" className="py-20 md:py-32 bg-[#F5F5F5]">
      <Container>
        <div className="flex items-end justify-between mb-10 md:mb-16">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-[#111111]/50 mb-3 font-body">
              Recém chegados
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-light tracking-widest uppercase">
              Novidades
            </h2>
          </div>
          <Link
            href="/collections"
            className="hidden md:block text-xs tracking-widest uppercase text-[#111111]/60 hover:text-[#111111] transition-colors underline underline-offset-4 font-body"
          >
            Ver todos
          </Link>
        </div>

        <ProductGrid products={newProducts} columns={4} />

        <div className="mt-12 text-center md:hidden">
          <Link
            href="/collections"
            className="text-xs tracking-widest uppercase text-[#111111]/60 hover:text-[#111111] transition-colors underline underline-offset-4 font-body"
          >
            Ver todos os produtos
          </Link>
        </div>
      </Container>
    </section>
  );
}
