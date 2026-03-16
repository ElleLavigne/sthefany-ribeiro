import type { Product } from "@/types/product";
import { ProductCard } from "../ProductCard/ProductCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll/RevealOnScroll";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-center text-sm text-[#111111]/50 py-16">
        Nenhum produto encontrado.
      </p>
    );
  }

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-14`}>
      {products.map((product, index) => (
        <RevealOnScroll key={product.id} delay={(index % (columns === 3 ? 3 : 4)) * 100}>
          <ProductCard product={product} />
        </RevealOnScroll>
      ))}
    </div>
  );
}
