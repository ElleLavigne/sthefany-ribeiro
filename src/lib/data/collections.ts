import type { Collection } from "@/types/collection";
import collectionsData from "@data/collections.json";

const collections = collectionsData as Collection[];

export function getCollections(): Collection[] {
  return [...collections].sort((a, b) => a.order - b.order);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getCollectionSlugs(): string[] {
  return collections.map((c) => c.slug);
}
