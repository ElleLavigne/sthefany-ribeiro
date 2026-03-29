import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container/Container";
import { ProductGrid } from "@/components/products/ProductGrid/ProductGrid";
import { getCollectionBySlug, getCollectionSlugs } from "@/lib/data/collections";
import { getProductsByCollection } from "@/lib/data/products";

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) notFound();

  const products = await getProductsByCollection(slug);

  return (
    <div className="py-16 md:py-24">
      <Container>
        {/* Header da coleção */}
        <div className="mb-12 md:mb-16 max-w-2xl">
          <p className="text-[10px] tracking-widest uppercase text-[#111111]/50 mb-3 font-body">
            Coleção
          </p>
          <h1 className="font-heading text-3xl md:text-5xl font-light tracking-widest uppercase mb-4">
            {collection.name}
          </h1>
          <p className="font-body text-sm text-[#111111]/60 leading-relaxed">
            {collection.description}
          </p>
        </div>

        {/* Contador */}
        <p className="text-[10px] tracking-widest uppercase text-[#111111]/40 font-body mb-8">
          {products.length} {products.length === 1 ? "peça" : "peças"}
        </p>

        <ProductGrid products={products} columns={4} />
      </Container>
    </div>
  );
}
