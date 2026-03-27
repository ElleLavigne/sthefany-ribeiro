"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import type { Product, ProductColor } from "@/types/product";

interface ProductFormProps {
  initialData?: Product;
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

export function ProductForm({ initialData, isEditing }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [details, setDetails] = useState(initialData?.details.join("\n") || "");
  const [price, setPrice] = useState(initialData ? String(initialData.price / 100) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialData?.compareAtPrice ? String(initialData.compareAtPrice / 100) : ""
  );
  const [sizes, setSizes] = useState(initialData?.sizes.join(", ") || "");
  const [collectionSlug, setCollectionSlug] = useState(initialData?.collectionSlug || "");
  const [isNew, setIsNew] = useState(initialData?.isNew ?? false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [inStock, setInStock] = useState(initialData?.inStock ?? true);
  const [tags, setTags] = useState(initialData?.tags.join(", ") || "");
  const [images, setImages] = useState(initialData?.images.join("\n") || "");
  const [colors, setColors] = useState<ProductColor[]>(initialData?.colors || [{ name: "", hex: "#000000" }]);

  function addColor() {
    setColors([...colors, { name: "", hex: "#000000" }]);
  }

  function removeColor(index: number) {
    setColors(colors.filter((_, i) => i !== index));
  }

  function updateColor(index: number, field: keyof ProductColor, value: string) {
    const updated = [...colors];
    updated[index] = { ...updated[index], [field]: value };
    setColors(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const slug = isEditing ? initialData!.slug : generateSlug(name);
      const priceInCents = Math.round(parseFloat(price) * 100);
      const compareInCents = compareAtPrice
        ? Math.round(parseFloat(compareAtPrice) * 100)
        : null;

      const product: Product = {
        id: initialData?.id || `prod_${Date.now()}`,
        slug,
        name,
        description,
        details: details.split("\n").filter((d) => d.trim()),
        price: priceInCents,
        compareAtPrice: compareInCents,
        images: images.split("\n").filter((i) => i.trim()),
        sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: colors.filter((c) => c.name.trim()),
        collectionSlug,
        isNew,
        isFeatured,
        inStock,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        createdAt: initialData?.createdAt || new Date().toISOString(),
      };

      await setDoc(doc(db, "products", slug), product);
      router.push("/admin/products");
    } catch {
      setError("Erro ao salvar produto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-olive focus:border-transparent";
  const labelClass = "block text-sm font-medium text-stone-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Nome */}
      <div>
        <label className={labelClass}>Nome do produto</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Vestido Linho Off-White"
        />
      </div>

      {/* Descrição */}
      <div>
        <label className={labelClass}>Descrição</label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="Descrição do produto..."
        />
      </div>

      {/* Detalhes */}
      <div>
        <label className={labelClass}>Detalhes (um por linha)</label>
        <textarea
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className={inputClass}
          placeholder={"100% Linho natural\nComprimento midi\nLavar à mão"}
        />
      </div>

      {/* Preço + Preço comparativo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Preço (R$)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
            placeholder="599.00"
          />
        </div>
        <div>
          <label className={labelClass}>Preço anterior (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            className={inputClass}
            placeholder="Deixe vazio se não houver"
          />
        </div>
      </div>

      {/* Coleção */}
      <div>
        <label className={labelClass}>Slug da coleção</label>
        <input
          required
          value={collectionSlug}
          onChange={(e) => setCollectionSlug(e.target.value)}
          className={inputClass}
          placeholder="essenciais, verao-2025, noite, studio"
        />
      </div>

      {/* Tamanhos */}
      <div>
        <label className={labelClass}>Tamanhos (separados por vírgula)</label>
        <input
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
          className={inputClass}
          placeholder="PP, P, M, G, GG"
        />
      </div>

      {/* Cores */}
      <div>
        <label className={labelClass}>Cores</label>
        <div className="space-y-2">
          {colors.map((color, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={color.name}
                onChange={(e) => updateColor(i, "name", e.target.value)}
                className={inputClass}
                placeholder="Nome da cor"
              />
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(i, "hex", e.target.value)}
                className="w-10 h-10 rounded-lg border border-stone-300 cursor-pointer p-0.5"
              />
              {colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(i)}
                  className="px-2 py-1 text-red-700 text-sm hover:bg-red-50 rounded-lg"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addColor}
          className="mt-2 text-sm text-brand-olive hover:underline"
        >
          + Adicionar cor
        </button>
      </div>

      {/* Imagens */}
      <div>
        <label className={labelClass}>URLs das imagens (uma por linha)</label>
        <textarea
          rows={3}
          value={images}
          onChange={(e) => setImages(e.target.value)}
          className={inputClass}
          placeholder={"/images/products/produto-01.jpg\n/images/products/produto-02.jpg"}
        />
        {images.trim() && (
          <div className="flex gap-3 mt-3 flex-wrap">
            {images
              .split("\n")
              .filter((url) => url.trim())
              .map((url, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-lg overflow-hidden border border-stone-200 bg-stone-100"
                >
                  <img
                    src={url.trim()}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className={labelClass}>Tags (separadas por vírgula)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputClass}
          placeholder="vestido, linho, verão, midi"
        />
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
            className="rounded border-stone-300 text-brand-olive focus:ring-brand-olive"
          />
          Novo
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded border-stone-300 text-brand-olive focus:ring-brand-olive"
          />
          Destaque
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="rounded border-stone-300 text-brand-olive focus:ring-brand-olive"
          />
          Em estoque
        </label>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {/* Botões */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-brand-brown text-white text-sm font-medium rounded-lg hover:bg-brand-olive transition-colors disabled:opacity-50"
        >
          {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-2.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
