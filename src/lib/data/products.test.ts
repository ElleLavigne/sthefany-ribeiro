import {
  getProducts,
  getProductBySlug,
  getProductsByCollection,
  getFeaturedProducts,
  getNewProducts,
  getProductSlugs,
  getRelatedProducts,
} from "./products";

describe("getProducts", () => {
  it("should return all products", () => {
    const result = getProducts();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return products with required fields", () => {
    const result = getProducts();
    result.forEach((p) => {
      expect(p).toHaveProperty("id");
      expect(p).toHaveProperty("slug");
      expect(p).toHaveProperty("name");
      expect(p).toHaveProperty("price");
      expect(p).toHaveProperty("images");
      expect(typeof p.price).toBe("number");
    });
  });
});

describe("getProductBySlug", () => {
  it("should return the correct product", () => {
    const result = getProductBySlug("vestido-linho-off-white");
    expect(result).toBeDefined();
    expect(result?.slug).toBe("vestido-linho-off-white");
  });

  it("should return undefined for non-existent slug", () => {
    const result = getProductBySlug("produto-nao-existe");
    expect(result).toBeUndefined();
  });
});

describe("getProductsByCollection", () => {
  it("should return products from a specific collection", () => {
    const result = getProductsByCollection("essenciais");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((p) => {
      expect(p.collectionSlug).toBe("essenciais");
    });
  });

  it("should return empty array for non-existent collection", () => {
    const result = getProductsByCollection("nao-existe");
    expect(result).toHaveLength(0);
  });
});

describe("getFeaturedProducts", () => {
  it("should return only featured and in-stock products", () => {
    const result = getFeaturedProducts();
    result.forEach((p) => {
      expect(p.isFeatured).toBe(true);
      expect(p.inStock).toBe(true);
    });
  });
});

describe("getNewProducts", () => {
  it("should return only new and in-stock products", () => {
    const result = getNewProducts();
    result.forEach((p) => {
      expect(p.isNew).toBe(true);
      expect(p.inStock).toBe(true);
    });
  });
});

describe("getProductSlugs", () => {
  it("should return array of strings", () => {
    const result = getProductSlugs();
    expect(Array.isArray(result)).toBe(true);
    result.forEach((slug) => expect(typeof slug).toBe("string"));
  });
});

describe("getRelatedProducts", () => {
  it("should not include the current product", () => {
    const product = getProductBySlug("vestido-linho-off-white")!;
    const related = getRelatedProducts(product);
    related.forEach((p) => {
      expect(p.slug).not.toBe(product.slug);
    });
  });

  it("should respect the limit parameter", () => {
    const product = getProductBySlug("vestido-linho-off-white")!;
    const related = getRelatedProducts(product, 2);
    expect(related.length).toBeLessThanOrEqual(2);
  });
});
