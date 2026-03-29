import type { Metadata } from "next";
import { Container } from "@/components/layout/Container/Container";
import { ProductListWithFilters } from "@/components/products/ProductListWithFilters/ProductListWithFilters";
import { getProducts } from "@/lib/data/products";
import { brand } from "@config/brand";

export const metadata: Metadata = {
  title: "Catalogo",
  description: `Explore todos os produtos de ${brand.name}.`,
};

export const revalidate = 60;

export default async function CollectionsPage() {
  const products = await getProducts();

  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-2 font-medium">
            {brand.name}
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-widest uppercase text-stone-950">
            Catalogo
          </h1>
        </div>

        <ProductListWithFilters products={products} defaultColumns={3} />
      </Container>
    </div>
  );
}
