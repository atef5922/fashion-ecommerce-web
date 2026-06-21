import { products } from "@/data/products";
import type { Product } from "@/types/product";

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string) {
  const current = getProductBySlug(slug);
  if (!current) return products.slice(0, 4);
  return products
    .filter((product) => product.slug !== slug && product.category === current.category)
    .concat(products.filter((product) => product.slug !== slug && product.category !== current.category))
    .slice(0, 4);
}

function uniqueProducts(items: Product[]) {
  return Array.from(new Map(items.map((product) => [product.id, product])).values());
}

function withoutCurrent(slug: string) {
  return products.filter((product) => product.slug !== slug);
}

export function getRelatedProductGroups(slug: string) {
  const current = getProductBySlug(slug);
  const candidates = withoutCurrent(slug);

  if (!current) {
    return {
      sameCategory: products.slice(0, 8),
      similarStyle: products.filter((product) => product.isFeatured).slice(0, 8),
      recommended: products.slice(0, 8)
    };
  }

  const sameCategory = uniqueProducts([
    ...candidates.filter((product) => product.category === current.category),
    ...candidates.filter((product) => product.collection === current.collection),
    ...candidates
  ]).slice(0, 8);

  const currentStyleTokens = [
    current.collection,
    current.brand,
    ...current.details,
    current.description
  ].join(" ").toLowerCase();

  const similarStyle = candidates
    .map((product) => {
      const productStyleTokens = [
        product.collection,
        product.brand,
        ...product.details,
        product.description
      ].join(" ").toLowerCase();

      const score = [
        product.collection === current.collection ? 4 : 0,
        product.brand === current.brand ? 2 : 0,
        current.details.filter((detail) => productStyleTokens.includes(detail.toLowerCase().split(" ")[0])).length,
        currentStyleTokens.includes(product.category.toLowerCase()) ? 1 : 0
      ].reduce((sum, value) => sum + value, 0);

      return { product, score };
    })
    .sort((a, b) => b.score - a.score || Number(b.product.isFeatured) - Number(a.product.isFeatured))
    .map(({ product }) => product)
    .slice(0, 8);

  const recommended = uniqueProducts([
    ...candidates.filter((product) => product.isFeatured),
    ...candidates.filter((product) => product.rating >= 4.8),
    ...candidates.filter((product) => product.isNew),
    ...candidates
  ]).slice(0, 8);

  return {
    sameCategory,
    similarStyle,
    recommended
  };
}
