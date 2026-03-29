import type { Product } from "@/types/product";
import { db } from "@config/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

async function fetchAllProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map((d) => d.data() as Product);
}

export async function getProducts(): Promise<Product[]> {
  return fetchAllProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const snap = await getDoc(doc(db, "products", slug));
  if (!snap.exists()) return undefined;
  return snap.data() as Product;
}

export async function getProductsByCollection(collectionSlug: string): Promise<Product[]> {
  const q = query(collection(db, "products"), where("collectionSlug", "==", collectionSlug));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Product);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products.filter((p) => p.isFeatured && p.inStock);
}

export async function getNewProducts(): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products.filter((p) => p.isNew && p.inStock);
}

export async function getProductSlugs(): Promise<string[]> {
  const products = await fetchAllProducts();
  return products.map((p) => p.slug);
}

export async function getLowestPriceByTag(tag: string): Promise<number | null> {
  const products = await fetchAllProducts();
  const matched = products.filter((p) => p.inStock && p.tags.includes(tag));
  if (matched.length === 0) return null;
  return Math.min(...matched.map((p) => p.price));
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products
    .filter(
      (p) =>
        p.slug !== product.slug &&
        (p.collectionSlug === product.collectionSlug ||
          p.tags.some((tag) => product.tags.includes(tag)))
    )
    .slice(0, limit);
}
