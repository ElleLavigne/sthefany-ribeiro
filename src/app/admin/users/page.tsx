"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@config/firebase";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAuth } from "@/context/AuthContext";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { UserProfileModal } from "@/components/admin/UserProfileModal";
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
  const [deleteTarget, setDeleteTarget] = useState<{ uid: string; name: string } | null>(null);
  const [profileTarget, setProfileTarget] = useState<AdminUserData | null>(null);

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

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    if (deleteTarget.uid === user?.uid) return;
    setDeleting(deleteTarget.uid);
    await deleteDoc(doc(db, "adminUsers", deleteTarget.uid));
    setUsers((prev) => prev.filter((u) => u.uid !== deleteTarget.uid));
    setDeleting(null);
    setDeleteTarget(null);
  }

  function handleProfileUpdated(updated: AdminUserData) {
    setUsers((prev) => prev.map((u) => (u.uid === updated.uid ? updated : u)));
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
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setProfileTarget(u)}
                          title="Configurações do perfil"
                          className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </button>
                        <Link
                          href={`/admin/users/${u.uid}/edit`}
                          className="px-3 py-1 text-sm text-brand-olive hover:bg-brand-olive/10 rounded-lg transition-colors"
                        >
                          Editar
                        </Link>
                        {u.uid !== user?.uid && (
                          <button
                            onClick={() => setDeleteTarget({ uid: u.uid, name: u.name })}
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

      <ConfirmModal
        open={!!deleteTarget}
        title="Remover usuário"
        message={`O acesso de "${deleteTarget?.name}" será removido permanentemente. Essa ação não pode ser desfeita.`}
        confirmLabel="Sim, remover"
        cancelLabel="Cancelar"
        loading={!!deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <UserProfileModal
        open={!!profileTarget}
        userData={profileTarget}
        onClose={() => setProfileTarget(null)}
        onUpdated={handleProfileUpdated}
      />
    </AdminShell>
  );
}
