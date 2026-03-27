"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/types/product";

export default function EditProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const snap = await getDoc(doc(db, "products", slug));
      if (snap.exists()) {
        setProduct(snap.data() as Product);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  return (
    <AdminShell>
      {loading ? (
        <p className="text-stone-400">Carregando...</p>
      ) : product ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-stone-950">Editar produto</h1>
            <p className="text-sm text-stone-400 mt-1">{product.name}</p>
            {product.images[0] && (
              <div className="mt-4 w-40 h-52 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <ProductForm initialData={product} isEditing />
        </>
      ) : (
        <p className="text-stone-600">Produto não encontrado.</p>
      )}
    </AdminShell>
  );
}
