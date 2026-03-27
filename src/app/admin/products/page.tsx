"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@config/firebase";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import type { Product } from "@/types/product";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; name: string } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const q = query(collection(db, "products"), orderBy("name"));
    const snap = await getDocs(q);
    setProducts(snap.docs.map((d) => d.data() as Product));
    setLoading(false);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.slug);
    await deleteDoc(doc(db, "products", deleteTarget.slug));
    setProducts((prev) => prev.filter((p) => p.slug !== deleteTarget.slug));
    setDeleting(null);
    setDeleteTarget(null);
  }

  function formatPrice(cents: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-950">Produtos</h1>
          <p className="text-sm text-stone-400 mt-1">
            {products.length} produto{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-brand-brown text-white text-sm font-medium rounded-lg hover:bg-brand-olive transition-colors"
        >
          + Novo produto
        </Link>
      </div>

      {loading ? (
        <p className="text-stone-400">Carregando...</p>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left px-4 py-3 font-medium text-stone-600 w-12">Foto</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Coleção</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Preço</th>
                  <th className="text-center px-4 py-3 font-medium text-stone-600">Estoque</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.slug} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">
                            —
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-stone-950">{product.name}</p>
                        <p className="text-xs text-stone-400">{product.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{product.collectionSlug}</td>
                    <td className="px-4 py-3 text-stone-950">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.inStock ? "Em estoque" : "Esgotado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.slug}/edit`}
                          className="px-3 py-1 text-sm text-brand-olive hover:bg-brand-olive/10 rounded-lg transition-colors"
                        >
                          Editar
                        </Link>
                        {user?.role === "super" && (
                          <button
                            onClick={() => setDeleteTarget({ slug: product.slug, name: product.name })}
                            disabled={deleting === product.slug}
                            className="px-3 py-1 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === product.slug ? "..." : "Excluir"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Excluir produto"
        message={`O produto "${deleteTarget?.name}" será removido permanentemente e não aparecerá mais no site. Essa ação não pode ser desfeita.`}
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        loading={!!deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
