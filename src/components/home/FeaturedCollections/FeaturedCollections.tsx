import type { Collection } from "@/types/collection";
import { CollectionCard } from "@/components/collections/CollectionCard/CollectionCard";
import { Container } from "@/components/layout/Container/Container";

interface FeaturedCollectionsProps {
  collections: Collection[];
}

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  const featured = collections.slice(0, 3);

  return (
    <section aria-label="Coleções em destaque" className="py-20 md:py-32">
      <Container>
        <div className="flex items-end justify-between mb-10 md:mb-16">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-[#111111]/50 mb-3 font-body">
              Nossas Coleções
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-light tracking-widest uppercase">
              Explore
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {featured.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </Container>
    </section>
  );
}
