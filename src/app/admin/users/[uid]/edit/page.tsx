"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import { useAuth } from "@/context/AuthContext";
import { AdminShell } from "@/components/admin/AdminShell";
import { UserForm } from "@/components/admin/UserForm";

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: "super" | "admin";
  createdAt: string;
}

export default function EditUserPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const uid = params.uid as string;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "super") {
      router.replace("/admin/dashboard");
      return;
    }

    async function fetchUser() {
      const snap = await getDoc(doc(db, "adminUsers", uid));
      if (snap.exists()) {
        setUserData({ uid: snap.id, ...snap.data() } as UserData);
      }
      setLoading(false);
    }
    fetchUser();
  }, [uid, user, router]);

  return (
    <AdminShell>
      {loading ? (
        <p className="text-stone-400">Carregando...</p>
      ) : userData ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-stone-950">Editar usuário</h1>
            <p className="text-sm text-stone-400 mt-1">{userData.name}</p>
          </div>
          <UserForm initialData={userData} isEditing />
        </>
      ) : (
        <p className="text-stone-600">Usuário não encontrado.</p>
      )}
    </AdminShell>
  );
}
