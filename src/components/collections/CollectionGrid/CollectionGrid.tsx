import type { Collection } from "@/types/collection";
import { CollectionCard } from "../CollectionCard/CollectionCard";

interface CollectionGridProps {
  collections: Collection[];
}

export function CollectionGrid({ collections }: CollectionGridProps) {
  if (collections.length === 0) {
    return (
      <p className="text-center text-sm text-[#111111]/50 py-16">
        Nenhuma coleção disponível.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
