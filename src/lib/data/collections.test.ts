import { getCollections, getCollectionBySlug, getCollectionSlugs } from "./collections";

describe("getCollections", () => {
  it("should return all collections", () => {
    const result = getCollections();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return collections sorted by order", () => {
    const result = getCollections();
    for (let i = 1; i < result.length; i++) {
      expect(result[i].order).toBeGreaterThanOrEqual(result[i - 1].order);
    }
  });

  it("should return collections with required fields", () => {
    const result = getCollections();
    result.forEach((c) => {
      expect(c).toHaveProperty("id");
      expect(c).toHaveProperty("slug");
      expect(c).toHaveProperty("name");
      expect(c).toHaveProperty("coverImage");
    });
  });
});

describe("getCollectionBySlug", () => {
  it("should return the correct collection", () => {
    const result = getCollectionBySlug("essenciais");
    expect(result).toBeDefined();
    expect(result?.slug).toBe("essenciais");
  });

  it("should return undefined for non-existent slug", () => {
    const result = getCollectionBySlug("nao-existe");
    expect(result).toBeUndefined();
  });
});

describe("getCollectionSlugs", () => {
  it("should return an array of strings", () => {
    const result = getCollectionSlugs();
    expect(Array.isArray(result)).toBe(true);
    result.forEach((slug) => expect(typeof slug).toBe("string"));
  });

  it("should include known slugs", () => {
    const result = getCollectionSlugs();
    expect(result).toContain("essenciais");
    expect(result).toContain("verao-2025");
  });
});
