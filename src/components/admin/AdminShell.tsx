"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const baseNavItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Produtos" },
  { href: "/admin/collections", label: "Coleções" },
];

const superOnlyItems = [
  { href: "/admin/users", label: "Usuários" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = user?.role === "super"
    ? [...baseNavItems, ...superOnlyItems]
    : baseNavItems;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-400">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    router.replace("/admin");
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="text-lg font-semibold text-stone-950">
                SR Admin
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname.startsWith(item.href)
                        ? "bg-brand-olive/10 text-brand-olive"
                        : "text-stone-600 hover:text-stone-950 hover:bg-stone-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-stone-950">{user.name}</p>
                <p className="text-xs text-stone-400">
                  {user.role === "super" ? "Superusuário" : "Administrador"}
                </p>
              </div>
              <button
                onClick={signOut}
                className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden border-t border-stone-200 px-4 py-2 flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-brand-olive/10 text-brand-olive"
                  : "text-stone-600 hover:text-stone-950"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
