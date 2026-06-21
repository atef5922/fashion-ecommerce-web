import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCouponStatus } from "@/lib/server/coupons";
import { requireServerAdmin } from "@/lib/server/auth";
import type { AdminCoupon } from "@/types/admin/admin.types";

function mapCoupon(coupon: {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: Prisma.Decimal;
  usageCount: number;
  usageLimit: number | null;
  expiresAt: Date | null;
  isActive: boolean;
}) {
  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type === "PERCENTAGE" ? "Percentage" : "Fixed",
    value: Number(coupon.value),
    usage: coupon.usageCount,
    usageLimit: coupon.usageLimit,
    expiresAt: coupon.expiresAt?.toISOString() ?? null,
    status: getCouponStatus(coupon)
  } satisfies AdminCoupon;
}

export async function GET() {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(coupons.map(mapCoupon));
}

export async function POST(request: NextRequest) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const body = (await request.json()) as Omit<AdminCoupon, "id" | "usage" | "status"> & { status?: AdminCoupon["status"] };

  const created = await prisma.coupon.create({
    data: {
      code: body.code.trim().toUpperCase(),
      type: body.type === "Percentage" ? "PERCENTAGE" : "FIXED",
      value: new Prisma.Decimal(body.value),
      usageLimit: body.usageLimit ?? null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      isActive: body.status !== "Inactive"
    }
  });

  return NextResponse.json(mapCoupon(created));
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const body = (await request.json()) as AdminCoupon;

  const updated = await prisma.coupon.update({
    where: { id: body.id },
    data: {
      code: body.code.trim().toUpperCase(),
      type: body.type === "Percentage" ? "PERCENTAGE" : "FIXED",
      value: new Prisma.Decimal(body.value),
      usageLimit: body.usageLimit ?? null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      isActive: body.status === "Active"
    }
  });

  return NextResponse.json(mapCoupon(updated));
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Coupon id is required." }, { status: 400 });
  }

  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
