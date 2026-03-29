import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container/Container";
import { ProductDetail } from "@/components/products/ProductDetail/ProductDetail";
import { ProductGrid } from "@/components/products/ProductGrid/ProductGrid";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/lib/data/products";
import { getCollectionBySlug } from "@/lib/data/collections";
import { formatPrice } from "@/lib/utils/formatPrice";
import { brand } from "@config/brand";

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${brand.name}`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : [],
    },
    other: {
      "product:price:amount": String(product.price / 100),
      "product:price:currency": "BRL",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const collection = await getCollectionBySlug(product.collectionSlug);
  const related = await getRelatedProducts(product, 4);

  return (
    <div className="py-8 md:py-16">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Localização" className="mb-8">
          <ol className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#111111]/50 font-body">
            <li>
              <Link href="/" className="hover:text-[#111111] transition-colors">
                Início
              </Link>
            </li>
            <li aria-hidden="true">·</li>
            {collection && (
              <>
                <li>
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="hover:text-[#111111] transition-colors"
                  >
                    {collection.name}
                  </Link>
                </li>
                <li aria-hidden="true">·</li>
              </>
            )}
            <li className="text-[#111111]" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Produto */}
        <ProductDetail product={product} />

        {/* Produtos relacionados */}
        {related.length > 0 && (
          <section
            aria-label="Você também pode gostar"
            className="mt-24 md:mt-32 pt-16 border-t border-[#E5E5E5]"
          >
            <div className="mb-12">
              <p className="text-[10px] tracking-widest uppercase text-[#111111]/50 mb-3 font-body">
                Continue explorando
              </p>
              <h2 className="font-heading text-2xl md:text-3xl font-light tracking-widest uppercase">
                Você também pode gostar
              </h2>
            </div>
            <ProductGrid products={related} columns={4} />
          </section>
        )}
      </Container>
    </div>
  );
}
