import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAdmin } from "@/lib/server/auth";

function formatStatus(status: "PENDING" | "APPROVED" | "HIDDEN") {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export async function GET() {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      product: true
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(
    reviews.map((review) => ({
      id: review.id,
      product: review.product.name,
      customer: `${review.user.firstName} ${review.user.lastName}`.trim() || review.user.email,
      rating: review.rating,
      body: review.body,
      status: formatStatus(review.status)
    }))
  );
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const body = (await request.json()) as { id?: string; status?: string };
  if (!body.id || !body.status) {
    return NextResponse.json({ message: "Review id and status are required." }, { status: 400 });
  }

  const normalized = body.status.toUpperCase();
  if (!["PENDING", "APPROVED", "HIDDEN"].includes(normalized)) {
    return NextResponse.json({ message: "Invalid review status." }, { status: 400 });
  }

  const review = await prisma.review.update({
    where: { id: body.id },
    data: { status: normalized as "PENDING" | "APPROVED" | "HIDDEN" },
    include: {
      user: true,
      product: true
    }
  });

  return NextResponse.json({
    id: review.id,
    product: review.product.name,
    customer: `${review.user.firstName} ${review.user.lastName}`.trim() || review.user.email,
    rating: review.rating,
    body: review.body,
    status: formatStatus(review.status)
  });
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Review id is required." }, { status: 400 });
  }

  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
