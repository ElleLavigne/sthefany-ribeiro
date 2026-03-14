"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "../Container/Container";
import { useBag } from "@/hooks/useBag";
import { brand } from "@config/brand";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Catalogo" },
  { href: "/sobre-nos", label: "Sobre Nos" },
];

const navLabels: Record<string, string> = {
  "/": "Home",
  "/collections": "Catálogo",
  "/sobre-nos": "Sobre Nós",
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openBag } = useBag();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-brand-cream border-b border-brand-warm/30">
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg md:text-xl font-semibold tracking-widest uppercase text-brand-brown"
            aria-label={`${brand.name} — Ir para a página inicial`}
          >
            {brand.name}
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegacao principal">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs font-medium tracking-widest uppercase transition-colors",
                    isActive
                      ? "text-brand-olive border-b border-brand-olive pb-0.5"
                      : "text-brand-brown/70 hover:text-brand-brown"
                  )}
                >
                  {navLabels[link.href]}
                </Link>
              );
            })}
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-4">
            <button
              onClick={openBag}
              aria-label={`Sacola de compras — ${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
              className="relative flex items-center text-brand-brown hover:text-brand-olive transition-colors"
            >
              <BagIcon />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1.5 -right-2 w-4 h-4 bg-brand-olive text-white text-[9px] rounded-full flex items-center justify-center font-semibold"
                  aria-hidden="true"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            <button
              className="md:hidden text-brand-brown"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <MenuIcon open={mobileMenuOpen} />
            </button>
          </div>
        </div>
      </Container>

      {/* Nav mobile */}
      <div
        className={cn(
          "md:hidden bg-brand-cream border-t border-brand-warm/20 overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-64" : "max-h-0"
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <Container>
          <nav className="py-4 flex flex-col gap-4" aria-label="Navegacao mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium tracking-widest uppercase text-brand-brown/70 hover:text-brand-brown transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {navLabels[link.href]}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
    </header>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}
