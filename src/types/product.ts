export type ProductCategory = "Women" | "Men" | "Kids" | "Accessories";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  collection: string;
  price: number;
  compareAtPrice?: number;
  colors: string[];
  colorVariants: Record<string, {
    images: string[];
    inStock: boolean;
    stockCount: number;
  }>;
  sizes: string[];
  images: string[];
  hoverImage: string;
  description: string;
  details: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isFeatured: boolean;
  isSale: boolean;
};
