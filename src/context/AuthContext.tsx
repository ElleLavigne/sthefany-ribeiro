"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@config/firebase";

export type UserRole = "super" | "admin";

interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const adminUser = await getAdminData(firebaseUser);
        setUser(adminUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function getAdminData(firebaseUser: User): Promise<AdminUser | null> {
    const snap = await getDoc(doc(db, "adminUsers", firebaseUser.uid));
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: data.name,
      role: data.role,
    };
  }

  async function signIn(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const adminUser = await getAdminData(credential.user);
    if (!adminUser) {
      await firebaseSignOut(auth);
      throw new Error("Acesso não autorizado.");
    }
    setUser(adminUser);
  }

  async function signOut() {
    await firebaseSignOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
