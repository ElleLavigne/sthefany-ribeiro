"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionForm } from "@/components/admin/CollectionForm";

export default function NewCollectionPage() {
  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-950">Nova coleção</h1>
        <p className="text-sm text-stone-400 mt-1">Preencha as informações da coleção</p>
      </div>
      <CollectionForm />
    </AdminShell>
  );
}
