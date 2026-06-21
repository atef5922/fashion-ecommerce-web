import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbProductToStorefrontProduct, ensureCatalogSeeded } from "@/lib/server/catalog";

export async function GET() {
  await ensureCatalogSeeded();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(products.map(dbProductToStorefrontProduct));
}
