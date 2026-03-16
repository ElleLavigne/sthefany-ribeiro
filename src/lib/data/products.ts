import type { Product } from "@/types/product";
import productsData from "@data/products.json";

const products = productsData as Product[];

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  return products.filter((p) => p.collectionSlug === collectionSlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured && p.inStock);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew && p.inStock);
}

export function getProductSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function getLowestPriceByTag(tag: string): number | null {
  const matched = products.filter((p) => p.inStock && p.tags.includes(tag));
  if (matched.length === 0) return null;
  return Math.min(...matched.map((p) => p.price));
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.slug !== product.slug &&
        (p.collectionSlug === product.collectionSlug ||
          p.tags.some((tag) => product.tags.includes(tag)))
    )
    .slice(0, limit);
}
