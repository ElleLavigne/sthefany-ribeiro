"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@config/firebase";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminUserData {
  uid: string;
  email: string;
  name: string;
  role: "super" | "admin";
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "super") {
      router.replace("/admin/dashboard");
      return;
    }
    fetchUsers();
  }, [user, router]);

  async function fetchUsers() {
    const snap = await getDocs(collection(db, "adminUsers"));
    setUsers(
      snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AdminUserData))
    );
    setLoading(false);
  }

  async function handleDelete(uid: string, name: string) {
    if (uid === user?.uid) {
      alert("Você não pode excluir seu próprio usuário.");
      return;
    }
    if (!confirm(`Tem certeza que deseja remover o acesso de "${name}"?`)) return;
    setDeleting(uid);
    await deleteDoc(doc(db, "adminUsers", uid));
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
    setDeleting(null);
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-950">Usuários</h1>
          <p className="text-sm text-stone-400 mt-1">
            Gerenciar acessos ao painel administrativo
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="px-4 py-2 bg-brand-brown text-white text-sm font-medium rounded-lg hover:bg-brand-olive transition-colors"
        >
          + Novo usuário
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
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">E-mail</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Criado em</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.uid} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-950">
                        {u.name}
                        {u.uid === user?.uid && (
                          <span className="ml-2 text-xs text-stone-400">(você)</span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.role === "super"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.role === "super" ? "Superusuário" : "Administrador"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("pt-BR")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/users/${u.uid}/edit`}
                          className="px-3 py-1 text-sm text-brand-olive hover:bg-brand-olive/10 rounded-lg transition-colors"
                        >
                          Editar
                        </Link>
                        {u.uid !== user?.uid && (
                          <button
                            onClick={() => handleDelete(u.uid, u.name)}
                            disabled={deleting === u.uid}
                            className="px-3 py-1 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === u.uid ? "..." : "Remover"}
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
