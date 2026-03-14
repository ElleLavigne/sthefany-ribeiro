export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  details: string[];
  price: number; // em centavos
  compareAtPrice: number | null;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  collectionSlug: string;
  isNew: boolean;
  isFeatured: boolean;
  inStock: boolean;
  tags: string[];
  createdAt: string; // ISO 8601
}
