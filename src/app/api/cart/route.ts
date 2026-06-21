import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCatalogSeeded, findStorefrontProductById } from "@/lib/server/catalog";
import { requireServerUser } from "@/lib/server/auth";
import type { CartItem } from "@/types/cart";

type SaveCartPayload = {
  items: CartItem[];
};

export async function GET() {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;
  await ensureCatalogSeeded();

  const cartItems = await prisma.cartItem.findMany({
    where: { user: { supabaseUserId: user.id } },
    include: { product: true },
    orderBy: { createdAt: "desc" }
  });

  const items = await Promise.all(
    cartItems.map(async (item) => {
      const product = await findStorefrontProductById(item.productId);
      if (!product) return null;
      return {
        userId: user.id,
        product,
        quantity: item.quantity,
        size: item.size ?? product.sizes[0],
        color: item.color ?? product.colors[0]
      };
    })
  );

  return NextResponse.json({
    userId: user.id,
    items: items.filter(Boolean)
  });
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;
  await ensureCatalogSeeded();

  const body = (await request.json()) as SaveCartPayload;
  const items = Array.isArray(body.items) ? body.items : [];

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
    await tx.cartItem.deleteMany({ where: { userId: profile.id } });

    for (const item of items) {
      await tx.cartItem.create({
        data: {
          userId: profile.id,
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        }
      });
    }
  });

  return NextResponse.json({ success: true });
}
