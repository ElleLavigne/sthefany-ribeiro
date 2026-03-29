import type { Collection } from "@/types/collection";
import { db } from "@config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export async function getCollections(): Promise<Collection[]> {
  const snap = await getDocs(collection(db, "collections"));
  const collections = snap.docs.map((d) => d.data() as Collection);
  return collections.sort((a, b) => a.order - b.order);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const snap = await getDoc(doc(db, "collections", slug));
  if (!snap.exists()) return undefined;
  return snap.data() as Collection;
}

export async function getCollectionSlugs(): Promise<string[]> {
  const collections = await getCollections();
  return collections.map((c) => c.slug);
}
