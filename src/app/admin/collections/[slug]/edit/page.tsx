"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionForm } from "@/components/admin/CollectionForm";
import type { Collection } from "@/types/collection";

export default function EditCollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollection() {
      const snap = await getDoc(doc(db, "collections", slug));
      if (snap.exists()) {
        setCollection(snap.data() as Collection);
      }
      setLoading(false);
    }
    fetchCollection();
  }, [slug]);

  return (
    <AdminShell>
      {loading ? (
        <p className="text-stone-400">Carregando...</p>
      ) : collection ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-stone-950">Editar coleção</h1>
            <p className="text-sm text-stone-400 mt-1">{collection.name}</p>
          </div>
          <CollectionForm initialData={collection} isEditing />
        </>
      ) : (
        <p className="text-stone-600">Coleção não encontrada.</p>
      )}
    </AdminShell>
  );
}
