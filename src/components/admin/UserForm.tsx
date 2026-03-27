"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@config/firebase";

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: "super" | "admin";
  createdAt: string;
}

interface UserFormProps {
  initialData?: UserData;
  isEditing?: boolean;
}

export function UserForm({ initialData, isEditing }: UserFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"super" | "admin">(initialData?.role || "admin");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (isEditing && initialData) {
        await setDoc(
          doc(db, "adminUsers", initialData.uid),
          {
            email: initialData.email,
            name,
            role,
            createdAt: initialData.createdAt,
          }
        );
      } else {
        if (!password || password.length < 6) {
          setError("A senha deve ter no mínimo 6 caracteres.");
          setSaving(false);
          return;
        }

        // App secundário para criar o usuário sem deslogar o super atual
        const secondaryApp = initializeApp(
          {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          },
          "secondary"
        );
        const secondaryAuth = getAuth(secondaryApp);

        try {
          const credential = await createUserWithEmailAndPassword(
            secondaryAuth,
            email,
            password
          );

          await setDoc(doc(db, "adminUsers", credential.user.uid), {
            email,
            name,
            role,
            createdAt: new Date().toISOString(),
          });
        } finally {
          await deleteApp(secondaryApp);
        }
      }

      router.push("/admin/users");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      if (message.includes("email-already-in-use")) {
        setError("Este e-mail já está cadastrado.");
      } else {
        setError(`Erro ao salvar usuário: ${message}`);
      }
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-olive focus:border-transparent";
  const labelClass = "block text-sm font-medium text-stone-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div>
        <label className={labelClass}>Nome</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Nome do usuário"
        />
      </div>

      <div>
        <label className={labelClass}>E-mail</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isEditing}
          className={`${inputClass} ${isEditing ? "bg-stone-100 text-stone-400 cursor-not-allowed" : ""}`}
          placeholder="usuario@email.com"
        />
        {isEditing && (
          <p className="text-xs text-stone-400 mt-1">O e-mail não pode ser alterado.</p>
        )}
      </div>

      {!isEditing && (
        <div>
          <label className={labelClass}>Senha</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="Mínimo 6 caracteres"
          />
        </div>
      )}

      <div>
        <label className={labelClass}>Tipo de acesso</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "super" | "admin")}
          className={inputClass}
        >
          <option value="admin">Administrador</option>
          <option value="super">Superusuário</option>
        </select>
        <p className="text-xs text-stone-400 mt-1">
          Administradores podem criar e editar produtos/coleções. Superusuários também podem excluir e gerenciar usuários.
        </p>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-brand-brown text-white text-sm font-medium rounded-lg hover:bg-brand-olive transition-colors disabled:opacity-50"
        >
          {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar usuário"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/users")}
          className="px-6 py-2.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
