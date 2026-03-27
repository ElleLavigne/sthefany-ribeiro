"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@config/firebase";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import type { Collection } from "@/types/collection";

export default function AdminCollectionsPage() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  async function fetchCollections() {
    const q = query(collection(db, "collections"), orderBy("order"));
    const snap = await getDocs(q);
    setCollections(snap.docs.map((d) => d.data() as Collection));
    setLoading(false);
  }

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Tem certeza que deseja excluir a coleção "${name}"?`)) return;
    setDeleting(slug);
    await deleteDoc(doc(db, "collections", slug));
    setCollections((prev) => prev.filter((c) => c.slug !== slug));
    setDeleting(null);
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-950">Coleções</h1>
          <p className="text-sm text-stone-400 mt-1">
            {collections.length} coleção{collections.length !== 1 ? "ões" : ""}
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="px-4 py-2 bg-brand-brown text-white text-sm font-medium rounded-lg hover:bg-brand-olive transition-colors"
        >
          + Nova coleção
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
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Ordem</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Descrição</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((col) => (
                  <tr key={col.slug} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3 text-stone-600">{col.order}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-stone-950">{col.name}</p>
                        <p className="text-xs text-stone-400">{col.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600 max-w-xs truncate">
                      {col.description}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/collections/${col.slug}/edit`}
                          className="px-3 py-1 text-sm text-brand-olive hover:bg-brand-olive/10 rounded-lg transition-colors"
                        >
                          Editar
                        </Link>
                        {user?.role === "super" && (
                          <button
                            onClick={() => handleDelete(col.slug, col.name)}
                            disabled={deleting === col.slug}
                            className="px-3 py-1 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === col.slug ? "..." : "Excluir"}
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
    </AdminShell>
  );
}
