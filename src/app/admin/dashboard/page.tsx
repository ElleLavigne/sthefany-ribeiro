"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@config/firebase";
import { AdminShell } from "@/components/admin/AdminShell";
import Link from "next/link";

interface Stats {
  products: number;
  collections: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: 0, collections: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [prodSnap, colSnap] = await Promise.all([
        getCountFromServer(collection(db, "products")),
        getCountFromServer(collection(db, "collections")),
      ]);
      setStats({
        products: prodSnap.data().count,
        collections: colSnap.data().count,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-950">Dashboard</h1>
        <p className="text-sm text-stone-400 mt-1">Visão geral do catálogo</p>
      </div>

      {loading ? (
        <p className="text-stone-400">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/products"
            className="bg-white rounded-xl border border-stone-200 p-6 hover:border-brand-olive/30 transition-colors"
          >
            <p className="text-sm font-medium text-stone-400">Produtos</p>
            <p className="text-3xl font-semibold text-stone-950 mt-1">
              {stats.products}
            </p>
            <p className="text-sm text-brand-olive mt-3">Gerenciar →</p>
          </Link>

          <Link
            href="/admin/collections"
            className="bg-white rounded-xl border border-stone-200 p-6 hover:border-brand-olive/30 transition-colors"
          >
            <p className="text-sm font-medium text-stone-400">Coleções</p>
            <p className="text-3xl font-semibold text-stone-950 mt-1">
              {stats.collections}
            </p>
            <p className="text-sm text-brand-olive mt-3">Gerenciar →</p>
          </Link>
        </div>
      )}
    </AdminShell>
  );
}
