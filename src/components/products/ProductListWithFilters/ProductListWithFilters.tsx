"use client";

import { useState, useMemo } from "react";
import type { Product, ProductColor } from "@/types/product";
import { ProductGrid } from "../ProductGrid/ProductGrid";
import { cn } from "@/lib/utils/cn";

const CATEGORIES = ["Vestido", "Conjuntos", "T-shirt", "Blusas"] as const;
type Category = (typeof CATEGORIES)[number];

const SIZES_DEFAULT = ["P", "M", "G"] as const;
const SIZES_UNIQUE = ["Tamanho único"] as const;

const UNIQUE_SIZE_CATEGORIES: Category[] = ["Vestido", "Conjuntos"];

// Tags do JSON que mapeiam para cada categoria
const TAG_TO_CATEGORY: Record<string, Category> = {
  vestido: "Vestido",
  conjunto: "Conjuntos",
  "t-shirt": "T-shirt",
  tshirt: "T-shirt",
  blusa: "Blusas",
};

function getCategory(tags: string[]): Category | null {
  for (const tag of tags) {
    const normalized = tag
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (TAG_TO_CATEGORY[normalized]) return TAG_TO_CATEGORY[normalized];
  }
  return null;
}

interface ProductListWithFiltersProps {
  products: Product[];
  defaultColumns?: 2 | 3 | 4;
}

export function ProductListWithFilters({ products, defaultColumns = 3 }: ProductListWithFiltersProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [activeSize, setActiveSize] = useState<string | null>(null);

  // Tamanhos dependem da categoria ativa
  const sizes = UNIQUE_SIZE_CATEGORIES.includes(activeCategory as Category)
    ? [...SIZES_UNIQUE]
    : [...SIZES_DEFAULT];

  const colors = useMemo(() => {
    const seen = new Set<string>();
    const result: ProductColor[] = [];
    for (const p of products) {
      for (const c of p.colors) {
        if (!seen.has(c.hex)) {
          seen.add(c.hex);
          result.push(c);
        }
      }
    }
    return result;
  }, [products]);

  // Filtrar produtos
  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return products.filter((p) => {
      if (search) {
        const nameLower = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (!nameLower.includes(searchLower)) return false;
      }
      if (activeCategory) {
        const cat = getCategory(p.tags);
        if (cat !== activeCategory) return false;
      }
      if (activeColor) {
        if (!p.colors.some((c) => c.hex === activeColor)) return false;
      }
      if (activeSize) {
        if (!p.sizes.includes(activeSize)) return false;
      }
      return true;
    });
  }, [products, search, activeCategory, activeColor, activeSize]);

  const hasFilters = activeCategory || activeColor || activeSize || search;

  function handleCategoryClick(cat: Category) {
    const next = activeCategory === cat ? null : cat;
    setActiveCategory(next);
    // Reset size when switching to/from unique-size category
    setActiveSize(null);
  }

  function clearFilters() {
    setSearch("");
    setActiveCategory(null);
    setActiveColor(null);
    setActiveSize(null);
  }

  return (
    <div>
      {/* Barra de pesquisa */}
      <div className="relative mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          className="w-full px-4 py-2.5 pl-10 border border-brand-warm/40 rounded-lg text-sm text-stone-950 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-olive focus:border-transparent bg-white"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-8 pb-4 border-b border-brand-warm/30">
        {/* Categoria */}
        <FilterGroup label="Categoria">
          {CATEGORIES.map((cat) => (
            <FilterChip
              key={cat}
              active={activeCategory === cat}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </FilterChip>
          ))}
        </FilterGroup>

        {/* Cores */}
        <FilterGroup label="Cores">
          <div className="flex flex-wrap gap-1.5">
            {colors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setActiveColor(activeColor === color.hex ? null : color.hex)}
                aria-pressed={activeColor === color.hex}
                aria-label={`Filtrar por ${color.name}`}
                title={color.name}
                className={cn(
                  "w-6 h-6 rounded-full border transition-all",
                  activeColor === color.hex
                    ? "ring-2 ring-brand-olive ring-offset-1"
                    : "ring-0 hover:ring-1 hover:ring-brand-warm hover:ring-offset-1",
                  color.hex === "#FFFFFF" || color.hex.startsWith("#F")
                    ? "border-stone-400"
                    : "border-transparent"
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </FilterGroup>

        {/* Tamanho */}
        <FilterGroup label="Tamanho">
          {sizes.map((size) => (
            <FilterChip
              key={size}
              active={activeSize === size}
              onClick={() => setActiveSize(activeSize === size ? null : size)}
            >
              {size}
            </FilterChip>
          ))}
        </FilterGroup>

        {/* Limpar */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-[10px] tracking-widest uppercase text-red-700 hover:text-red-700/70 transition-colors underline underline-offset-2 ml-auto font-medium"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Contador */}
      <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-6">
        {filtered.length} {filtered.length === 1 ? "peça" : "peças"}
        {hasFilters && " encontradas"}
      </p>

      <ProductGrid products={filtered} columns={defaultColumns} />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] tracking-widest uppercase text-stone-600 font-semibold shrink-0">
        {label}:
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "px-3 py-1 text-[10px] tracking-widest uppercase font-medium border transition-all",
        active
          ? "bg-brand-brown border-brand-brown text-white"
          : "border-brand-warm text-stone-600 hover:border-brand-brown hover:text-brand-brown"
      )}
    >
      {children}
    </button>
  );
}
