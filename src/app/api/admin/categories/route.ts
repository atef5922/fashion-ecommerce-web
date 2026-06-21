import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAdmin } from "@/lib/server/auth";
import type { AdminCategory } from "@/types/admin/admin.types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function mapCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    products: category._count.products,
    status: category.isVisible ? "Visible" : "Hidden"
  } satisfies AdminCategory));
}

export async function GET() {
  const { error } = await requireServerAdmin();
  if (error) return error;

  return NextResponse.json(await mapCategories());
}

export async function POST(request: NextRequest) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const body = (await request.json()) as Pick<AdminCategory, "name" | "status">;
  const name = body.name.trim();

  if (!name) {
    return NextResponse.json({ message: "Category name is required." }, { status: 400 });
  }

  await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
      isVisible: body.status !== "Hidden"
    }
  });

  return NextResponse.json(await mapCategories());
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const body = (await request.json()) as AdminCategory;
  const name = body.name.trim();

  if (!name) {
    return NextResponse.json({ message: "Category name is required." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    const current = await tx.category.findUnique({
      where: { id: body.id },
      include: { products: true }
    });

    if (!current) {
      throw new Error("Category not found.");
    }

    await tx.category.update({
      where: { id: body.id },
      data: {
        name,
        slug: slugify(name),
        isVisible: body.status !== "Hidden"
      }
    });

    for (const product of current.products) {
      try {
        const metadata = JSON.parse(product.description) as { category?: string };
        metadata.category = name;

        await tx.product.update({
          where: { id: product.id },
          data: {
            description: JSON.stringify(metadata)
          }
        });
      } catch {
        // Keep legacy descriptions untouched if they are not JSON.
      }
    }
  });

  return NextResponse.json(await mapCategories());
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Category id is required." }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  if (!category) {
    return NextResponse.json({ message: "Category not found." }, { status: 404 });
  }

  if (category._count.products > 0) {
    return NextResponse.json({ message: "Reassign or archive products before deleting this category." }, { status: 400 });
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json(await mapCategories());
}
