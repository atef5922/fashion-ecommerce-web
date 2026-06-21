import { Prisma } from "@prisma/client";
import { products as staticProducts } from "@/data/products";
import { fashionImages } from "@/data/images";
import { prisma } from "@/lib/prisma";
import type { AdminProduct } from "@/types/admin/admin.types";
import type { Product, ProductCategory } from "@/types/product";

const categorySlugs: Record<ProductCategory, string> = {
  Women: "women",
  Men: "men",
  Kids: "kids",
  Accessories: "accessories"
};

function getStock(product: Product) {
  return product.colors.reduce((sum, color) => sum + (product.colorVariants[color]?.stockCount ?? 0), 0);
}

function getDetails(product: Product) {
  return product.details?.length ? product.details : ["Borno curated product"];
}

export async function ensureCatalogSeeded() {
  await prisma.category.createMany({
    data: Object.entries(categorySlugs).map(([name, slug]) => ({
      name,
      slug,
      isVisible: true
    })),
    skipDuplicates: true
  });

  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((category) => [category.name, category.id]));

  await prisma.product.createMany({
    data: staticProducts.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: JSON.stringify({
        text: product.description,
        details: getDetails(product),
        category: product.category,
        collection: product.collection,
        colors: product.colors,
        sizes: product.sizes,
        colorVariants: product.colorVariants,
        hoverImage: product.hoverImage,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: product.isNew,
        isFeatured: product.isFeatured,
        isSale: product.isSale
      }),
      price: new Prisma.Decimal(product.price),
      compareAt: product.compareAtPrice ? new Prisma.Decimal(product.compareAtPrice) : null,
      brand: product.brand,
      stock: getStock(product),
      imageUrls: product.images,
      categoryId: categoryMap.get(product.category)
    })),
    skipDuplicates: true
  });
}

type DbProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number];

function parseDbDescription(description: string) {
  try {
    return JSON.parse(description) as {
      text?: string;
      details?: string[];
      category?: ProductCategory;
      collection?: string;
      colors?: string[];
      sizes?: string[];
      colorVariants?: Product["colorVariants"];
      hoverImage?: string;
      rating?: number;
      reviewCount?: number;
      isNew?: boolean;
      isFeatured?: boolean;
      isSale?: boolean;
    };
  } catch {
    return {};
  }
}

function getImagesForCategory(category: ProductCategory) {
  if (category === "Men") return fashionImages.products.linenShirt;
  if (category === "Kids") return [fashionImages.categories.kids, fashionImages.products.cardigan[0]];
  if (category === "Accessories") return fashionImages.products.shoulderBag;
  return fashionImages.products.satinDress;
}

export function dbProductToStorefrontProduct(dbProduct: DbProduct): Product {
  const metadata = parseDbDescription(dbProduct.description);
  const category = (metadata.category ?? "Women") as ProductCategory;
  const images = dbProduct.imageUrls.length ? dbProduct.imageUrls : [...getImagesForCategory(category)];
  const defaultColor = metadata.colors?.[0] ?? (category === "Accessories" ? "Black" : "Champagne");
  const defaultSizes = metadata.sizes?.length ? metadata.sizes : category === "Accessories" ? ["One Size"] : ["XS", "S", "M", "L", "XL"];
  const defaultColorVariants =
    metadata.colorVariants && Object.keys(metadata.colorVariants).length
      ? metadata.colorVariants
      : {
          [defaultColor]: {
            images,
            inStock: dbProduct.stock > 0,
            stockCount: dbProduct.stock
          }
        };

  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    brand: dbProduct.brand ?? "BORNO",
    category,
    collection: metadata.collection ?? "BORNO Collection",
    price: Number(dbProduct.price),
    compareAtPrice: dbProduct.compareAt ? Number(dbProduct.compareAt) : undefined,
    colors: metadata.colors?.length ? metadata.colors : [defaultColor],
    colorVariants: defaultColorVariants,
    sizes: defaultSizes,
    images,
    hoverImage: metadata.hoverImage ?? images[1] ?? images[0],
    description: metadata.text ?? dbProduct.description,
    details: metadata.details?.length ? metadata.details : ["Borno managed product", `${dbProduct.stock} units in stock`],
    rating: metadata.rating ?? 4.8,
    reviewCount: metadata.reviewCount ?? 0,
    isNew: metadata.isNew ?? false,
    isFeatured: metadata.isFeatured ?? true,
    isSale: metadata.isSale ?? false
  };
}

export async function findStorefrontProductById(productId: string) {
  const staticProduct = staticProducts.find((product) => product.id === productId);
  if (staticProduct) {
    return staticProduct;
  }

  const dbProduct = await prisma.product.findUnique({ where: { id: productId } });
  return dbProduct ? dbProductToStorefrontProduct(dbProduct) : null;
}

export function dbProductToAdminProduct(dbProduct: DbProduct): AdminProduct {
  const metadata = parseDbDescription(dbProduct.description);
  return {
    id: dbProduct.id,
    title: dbProduct.name,
    category: (metadata.category ?? "Women") as AdminProduct["category"],
    price: Number(dbProduct.price),
    stock: dbProduct.stock,
    status: dbProduct.status === "DRAFT" ? "Draft" : dbProduct.status === "ARCHIVED" ? "Archived" : "Active",
    vendor: dbProduct.brand ?? "BORNO"
  };
}
