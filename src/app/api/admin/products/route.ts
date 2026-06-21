import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbProductToAdminProduct, ensureCatalogSeeded } from "@/lib/server/catalog";
import { requireServerAdmin } from "@/lib/server/auth";
import type { AdminProduct } from "@/types/admin/admin.types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function resolveCategoryId(name: string) {
  const normalizedName = name.trim();
  const slug = slugify(normalizedName);
  const category = await prisma.category.upsert({
    where: { slug },
    update: {
      name: normalizedName
    },
    create: {
      name: normalizedName,
      slug,
      isVisible: true
    }
  });

  return category.id;
}

export async function GET() {
  const { error } = await requireServerAdmin();
  if (error) return error;

  await ensureCatalogSeeded();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(products.map(dbProductToAdminProduct));
}

export async function POST(request: NextRequest) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const body = (await request.json()) as Omit<AdminProduct, "id">;
  const categoryId = await resolveCategoryId(body.category);
  const created = await prisma.product.create({
    data: {
      slug: `${slugify(body.title)}-${Date.now().toString().slice(-5)}`,
      name: body.title,
      description: JSON.stringify({
        text: `${body.title} from ${body.vendor}, curated by the BORNO admin catalog.`,
        details: ["Admin-managed product", `${body.stock} units in stock`, `${body.status} status`],
        category: body.category,
        collection: "BORNO Collection",
        colors: [body.category === "Accessories" ? "Black" : "Champagne"],
        sizes: body.category === "Accessories" ? ["One Size"] : ["XS", "S", "M", "L", "XL"],
        isNew: true,
        isFeatured: body.status === "Active",
        isSale: false
      }),
      price: new Prisma.Decimal(body.price),
      brand: body.vendor,
      stock: body.stock,
      imageUrls: [],
      categoryId,
      status: body.status === "Draft" ? "DRAFT" : body.status === "Archived" ? "ARCHIVED" : "ACTIVE"
    }
  });

  return NextResponse.json(dbProductToAdminProduct(created));
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const body = (await request.json()) as AdminProduct;
  const categoryId = await resolveCategoryId(body.category);
  const updated = await prisma.product.update({
    where: { id: body.id },
    data: {
      name: body.title,
      price: new Prisma.Decimal(body.price),
      stock: body.stock,
      brand: body.vendor,
      categoryId,
      status: body.status === "Draft" ? "DRAFT" : body.status === "Archived" ? "ARCHIVED" : "ACTIVE",
      description: JSON.stringify({
        text: `${body.title} from ${body.vendor}, curated by the BORNO admin catalog.`,
        details: ["Admin-managed product", `${body.stock} units in stock`, `${body.status} status`],
        category: body.category,
        collection: "BORNO Collection",
        colors: [body.category === "Accessories" ? "Black" : "Champagne"],
        sizes: body.category === "Accessories" ? ["One Size"] : ["XS", "S", "M", "L", "XL"],
        isNew: true,
        isFeatured: body.status === "Active",
        isSale: false
      })
    }
  });

  return NextResponse.json(dbProductToAdminProduct(updated));
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Product id is required." }, { status: 400 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
