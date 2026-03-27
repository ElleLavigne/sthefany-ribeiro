"use client";

import { useState, useEffect, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { db } from "@config/firebase";
import { auth } from "@config/firebase-auth";
import type { UserRole } from "@/context/AuthContext";

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: "super" | "admin";
  createdAt: string;
}

interface UserProfileModalProps {
  open: boolean;
  userData: UserData | null;
  onClose: () => void;
  onUpdated: (updated: UserData) => void;
}

export function UserProfileModal({ open, userData, onClose, onUpdated }: UserProfileModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"super" | "admin">("admin");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState<"info" | "password">("info");
  const [sendingReset, setSendingReset] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && userData) {
      setName(userData.name);
      setRole(userData.role);
      setError("");
      setSuccess("");
      setTab("info");
      closeRef.current?.focus();
    }
  }, [open, userData]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open || !userData) return null;

  const roleLabels: Record<UserRole, string> = {
    super: "Superusuário",
    admin: "Administrador",
  };

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateDoc(doc(db, "adminUsers", userData!.uid), { name, role });
      onUpdated({ ...userData!, name, role });
      setSuccess("Perfil atualizado com sucesso!");
    } catch {
      setError("Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSendResetEmail() {
    setError("");
    setSuccess("");
    setSendingReset(true);

    try {
      await sendPasswordResetEmail(auth, userData!.email);
      setSuccess(`E-mail de redefinição enviado para ${userData!.email}`);
    } catch {
      setError("Erro ao enviar e-mail de redefinição.");
    } finally {
      setSendingReset(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-olive focus:border-transparent";
  const labelClass = "block text-sm font-medium text-stone-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-lg border border-stone-200 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-stone-950">Perfil do usuário</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info fixa */}
        <div className="px-6 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-olive/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-brand-olive">
                {userData.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-950">{userData.email}</p>
              <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                userData.role === "super"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {roleLabels[userData.role]}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100 px-6">
          <button
            type="button"
            onClick={() => { setTab("info"); setError(""); setSuccess(""); }}
            className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors mr-6 ${
              tab === "info"
                ? "border-brand-olive text-brand-olive"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            Informações
          </button>
          <button
            type="button"
            onClick={() => { setTab("password"); setError(""); setSuccess(""); }}
            className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              tab === "password"
                ? "border-brand-olive text-brand-olive"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            Senha
          </button>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-5">
          {tab === "info" ? (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div>
                <label className={labelClass}>Nome</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>E-mail</label>
                <input
                  value={userData.email}
                  disabled
                  className={`${inputClass} bg-stone-100 text-stone-400 cursor-not-allowed`}
                />
              </div>

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
              </div>

              <div>
                <label className={labelClass}>Criado em</label>
                <input
                  value={userData.createdAt ? new Date(userData.createdAt).toLocaleDateString("pt-BR") : "—"}
                  disabled
                  className={`${inputClass} bg-stone-100 text-stone-400 cursor-not-allowed`}
                />
              </div>

              {error && <p className="text-sm text-red-700">{error}</p>}
              {success && <p className="text-sm text-green-700">{success}</p>}

              <button
                type="submit"
                disabled={saving || (name === userData.name && role === userData.role)}
                className="w-full py-2.5 bg-brand-brown text-white text-sm font-medium rounded-lg hover:bg-brand-olive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-stone-500 leading-relaxed">
                Envie um e-mail de redefinição de senha para <strong className="text-stone-700">{userData.email}</strong>. O usuário receberá um link para criar uma nova senha.
              </p>

              {error && <p className="text-sm text-red-700">{error}</p>}
              {success && <p className="text-sm text-green-700">{success}</p>}

              <button
                type="button"
                onClick={handleSendResetEmail}
                disabled={sendingReset}
                className="w-full py-2.5 bg-brand-brown text-white text-sm font-medium rounded-lg hover:bg-brand-olive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingReset ? "Enviando..." : "Enviar e-mail de redefinição"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
