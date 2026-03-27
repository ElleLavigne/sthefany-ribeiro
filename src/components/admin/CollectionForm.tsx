"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import type { Collection } from "@/types/collection";

interface CollectionFormProps {
  initialData?: Collection;
  isEditing?: boolean;
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CollectionForm({ initialData, isEditing }: CollectionFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [order, setOrder] = useState(initialData?.order?.toString() || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const slug = isEditing ? initialData!.slug : generateSlug(name);

      const collection: Collection = {
        id: initialData?.id || `col_${Date.now()}`,
        slug,
        name,
        description,
        coverImage,
        order: parseInt(order) || 0,
      };

      await setDoc(doc(db, "collections", slug), collection);
      router.push("/admin/collections");
    } catch {
      setError("Erro ao salvar coleção. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-olive focus:border-transparent";
  const labelClass = "block text-sm font-medium text-stone-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className={labelClass}>Nome da coleção</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Verão 2025"
        />
      </div>

      <div>
        <label className={labelClass}>Descrição</label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="Descrição da coleção..."
        />
      </div>

      <div>
        <label className={labelClass}>URL da imagem de capa</label>
        <input
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className={inputClass}
          placeholder="/images/collections/colecao.jpg"
        />
      </div>

      <div>
        <label className={labelClass}>Ordem de exibição</label>
        <input
          type="number"
          min="0"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className={inputClass}
          placeholder="1"
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-brand-brown text-white text-sm font-medium rounded-lg hover:bg-brand-olive transition-colors disabled:opacity-50"
        >
          {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar coleção"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/collections")}
          className="px-6 py-2.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
