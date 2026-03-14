import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/types/collection";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group block relative overflow-hidden bg-[#F5F5F5] aspect-[4/5]"
      aria-label={`Ver coleção ${collection.name}`}
    >
      {/* Imagem */}
      <Image
        src={collection.coverImage}
        alt={`Coleção ${collection.name}`}
        fill
        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

      {/* Texto */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3 className="font-heading text-2xl md:text-3xl font-light text-white tracking-widest uppercase mb-1">
          {collection.name}
        </h3>
        <p className="text-white/70 text-xs tracking-widest uppercase font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 transform transition-transform">
          Ver coleção →
        </p>
      </div>
    </Link>
  );
}
