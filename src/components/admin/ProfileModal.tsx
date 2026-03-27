"use client";

import { useState, useEffect, useRef } from "react";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth } from "@config/firebase-auth";
import { db } from "@config/firebase";
import { useAuth, type UserRole } from "@/context/AuthContext";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState<"info" | "password">("info");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setName(user?.name || "");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
      setTab("info");
      closeRef.current?.focus();
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open || !user) return null;

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
      await updateDoc(doc(db, "adminUsers", user!.uid), { name });
      setSuccess("Nome atualizado! Recarregue a página para ver a mudança.");
    } catch {
      setError("Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setSaving(true);

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser || !firebaseUser.email) throw new Error("Usuário não encontrado.");

      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);

      setSuccess("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("wrong-password") || message.includes("invalid-credential")) {
        setError("Senha atual incorreta.");
      } else {
        setError("Erro ao alterar senha. Tente novamente.");
      }
    } finally {
      setSaving(false);
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
          <h2 className="text-lg font-semibold text-stone-950">Meu perfil</h2>
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
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-950">{user.email}</p>
              <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                user.role === "super"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {roleLabels[user.role]}
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
            Alterar senha
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
                  value={user.email}
                  disabled
                  className={`${inputClass} bg-stone-100 text-stone-400 cursor-not-allowed`}
                />
                <p className="text-xs text-stone-400 mt-1">O e-mail não pode ser alterado.</p>
              </div>

              <div>
                <label className={labelClass}>Permissão</label>
                <input
                  value={roleLabels[user.role]}
                  disabled
                  className={`${inputClass} bg-stone-100 text-stone-400 cursor-not-allowed`}
                />
              </div>

              {error && <p className="text-sm text-red-700">{error}</p>}
              {success && <p className="text-sm text-green-700">{success}</p>}

              <button
                type="submit"
                disabled={saving || name === user.name}
                className="w-full py-2.5 bg-brand-brown text-white text-sm font-medium rounded-lg hover:bg-brand-olive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className={labelClass}>Senha atual</label>
                <input
                  required
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className={labelClass}>Nova senha</label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className={labelClass}>Confirmar nova senha</label>
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Repita a nova senha"
                />
              </div>

              {error && <p className="text-sm text-red-700">{error}</p>}
              {success && <p className="text-sm text-green-700">{success}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-brand-brown text-white text-sm font-medium rounded-lg hover:bg-brand-olive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Alterando..." : "Alterar senha"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
