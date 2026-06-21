import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCatalogSeeded, findStorefrontProductById } from "@/lib/server/catalog";
import { requireServerUser } from "@/lib/server/auth";
import type { WishlistProduct } from "@/types/wishlist";

type SaveWishlistPayload = {
  products: WishlistProduct[];
};

export async function GET() {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;
  await ensureCatalogSeeded();

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { user: { supabaseUserId: user.id } },
    include: { product: true },
    orderBy: { createdAt: "desc" }
  });

  const products = await Promise.all(
    wishlistItems.map(async (item) => {
      const product = await findStorefrontProductById(item.productId);
      if (!product) return null;
      return { ...product, userId: user.id };
    })
  );

  return NextResponse.json({
    userId: user.id,
    products: products.filter(Boolean)
  });
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;
  await ensureCatalogSeeded();

  const body = (await request.json()) as SaveWishlistPayload;
  const products = Array.isArray(body.products) ? body.products : [];

  const profile = await prisma.userProfile.upsert({
    where: { supabaseUserId: user.id },
    update: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role === "admin" ? "ADMIN" : "CUSTOMER"
    },
    create: {
      supabaseUserId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role === "admin" ? "ADMIN" : "CUSTOMER"
    }
  });

  await prisma.$transaction(async (tx) => {
    await tx.wishlistItem.deleteMany({ where: { userId: profile.id } });

    for (const product of products) {
      await tx.wishlistItem.create({
        data: {
          userId: profile.id,
          productId: product.id
        }
      });
    }
  });

  return NextResponse.json({ success: true });
}
