"use client";

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { useBag } from "@/hooks/useBag";
import { BagItem } from "../BagItem/BagItem";
import { BagSummary } from "../BagSummary/BagSummary";

export function BagSidebar() {
  const { isOpen, closeBag, items, totalItems } = useBag();

  // Fechar com Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeBag();
    },
    [isOpen, closeBag]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Bloquear scroll do body quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeBag}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sacola de compras"
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-white z-50",
          "flex flex-col shadow-2xl",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header da sidebar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E5]">
          <h2 className="font-heading text-lg tracking-widest uppercase font-light">
            Sacola{" "}
            {totalItems > 0 && (
              <span className="font-body text-sm font-normal text-[#111111]/50">
                ({totalItems} {totalItems === 1 ? "item" : "itens"})
              </span>
            )}
          </h2>
          <button
            onClick={closeBag}
            aria-label="Fechar sacola"
            className="p-1 text-[#111111]/60 hover:text-[#111111] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Itens */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <BagEmptyIcon />
              <p className="font-heading text-xl font-light tracking-widest uppercase">
                Sacola vazia
              </p>
              <p className="text-xs text-[#111111]/50 font-body">
                Adicione peças à sua sacola para continuar.
              </p>
            </div>
          ) : (
            <div className="py-2">
              {items.map((item) => (
                <BagItem key={`${item.productId}-${item.selectedSize}-${item.selectedColor.hex}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Resumo */}
        {items.length > 0 && (
          <div className="px-6 pb-8">
            <BagSummary />
          </div>
        )}
      </div>
    </>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function BagEmptyIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E5E5E5"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
