"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminShell } from "@/components/admin/AdminShell";
import { UserForm } from "@/components/admin/UserForm";

export default function NewUserPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "super") {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-950">Novo usuário</h1>
        <p className="text-sm text-stone-400 mt-1">Criar acesso ao painel administrativo</p>
      </div>
      <UserForm />
    </AdminShell>
  );
}
