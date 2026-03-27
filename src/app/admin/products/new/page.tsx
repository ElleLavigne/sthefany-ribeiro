"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-950">Novo produto</h1>
        <p className="text-sm text-stone-400 mt-1">Preencha as informações do produto</p>
      </div>
      <ProductForm />
    </AdminShell>
  );
}
