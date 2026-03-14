"use client";

import { useBagContext } from "@/context/BagContext";
import type { Product, ProductColor } from "@/types/product";

/**
 * Hook de interface para a sacola de compras.
 * Fornece actions tipadas e dados derivados para uso nos componentes.
 */
export function useBag() {
  const ctx = useBagContext();

  function addProductToBag(
    product: Product,
    selectedSize: string,
    selectedColor: ProductColor,
    quantity = 1
  ) {
    ctx.addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      selectedSize,
      selectedColor,
      quantity,
      price: product.price,
      image: product.images[0],
    });
    ctx.openBag();
  }

  function isInBag(productId: string): boolean {
    return ctx.state.items.some((item) => item.productId === productId);
  }

  return {
    items: ctx.state.items,
    isOpen: ctx.state.isOpen,
    totalItems: ctx.totalItems,
    totalPrice: ctx.totalPrice,
    addProductToBag,
    removeItem: ctx.removeItem,
    updateQuantity: ctx.updateQuantity,
    clearBag: ctx.clearBag,
    openBag: ctx.openBag,
    closeBag: ctx.closeBag,
    isInBag,
  };
}
