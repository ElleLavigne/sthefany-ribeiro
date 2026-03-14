"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { useBag } from "@/hooks/useBag";
import type { Product, ProductColor } from "@/types/product";

interface AddToBagButtonProps {
  product: Product;
  selectedSize: string | null;
  selectedColor: ProductColor | null;
}

export function AddToBagButton({
  product,
  selectedSize,
  selectedColor,
}: AddToBagButtonProps) {
  const [added, setAdded] = useState(false);
  const { addProductToBag } = useBag();

  const isReady = selectedSize !== null && selectedColor !== null;

  async function handleAddToBag() {
    if (!isReady) return;
    addProductToBag(product, selectedSize!, selectedColor!);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!product.inStock) {
    return (
      <Button variant="secondary" disabled className="w-full">
        Esgotado
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      {!isReady && (
        <p className="text-[10px] tracking-widest uppercase text-[#111111]/50 font-body text-center">
          Selecione tamanho e cor para continuar
        </p>
      )}
      <Button
        variant="primary"
        onClick={handleAddToBag}
        disabled={!isReady || added}
        className="w-full"
        aria-label={
          added
            ? "Item adicionado à sacola"
            : !isReady
            ? "Selecione tamanho e cor"
            : `Adicionar ${product.name} à sacola`
        }
      >
        {added ? "Adicionado ✓" : "Adicionar à Sacola"}
      </Button>
    </div>
  );
}
