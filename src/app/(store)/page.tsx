import { HeroSection } from "@/components/home/HeroSection/HeroSection";
import { PromoCards } from "@/components/home/PromoCards/PromoCards";
import { ProductListWithFilters } from "@/components/products/ProductListWithFilters/ProductListWithFilters";
import { Container } from "@/components/layout/Container/Container";
import { getProducts } from "@/lib/data/products";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <HeroSection />
      <PromoCards />

      {/* Produtos com filtros */}
      <section aria-label="Produtos" className="py-16 md:py-24">
        <Container>
          <div className="mb-10">
            <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-2 font-medium">
              Todos os produtos
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-widest uppercase text-stone-950">
              Colecao
            </h2>
          </div>

          <ProductListWithFilters products={products} defaultColumns={3} />
        </Container>
      </section>
    </>
  );
}
