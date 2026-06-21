import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateCouponDiscount, getCouponStatus } from "@/lib/server/coupons";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { code?: string; subtotal?: number };
  const code = body.code?.trim().toUpperCase() ?? "";
  const subtotal = Number(body.subtotal ?? 0);

  if (!code) {
    return NextResponse.json({ message: "Coupon code is required." }, { status: 400 });
  }

  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return NextResponse.json({ message: "A valid cart subtotal is required." }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code }
  });

  if (!coupon) {
    return NextResponse.json({ message: "Coupon not found." }, { status: 404 });
  }

  const status = getCouponStatus(coupon);

  if (status === "Expired") {
    return NextResponse.json({ message: "This coupon has expired." }, { status: 400 });
  }

  if (!coupon.isActive) {
    return NextResponse.json({ message: "This coupon is inactive." }, { status: 400 });
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return NextResponse.json({ message: "This coupon has reached its usage limit." }, { status: 400 });
  }

  const discountAmount = calculateCouponDiscount(subtotal, coupon);

  return NextResponse.json({
    code: coupon.code,
    type: coupon.type === "PERCENTAGE" ? "Percentage" : "Fixed",
    value: Number(coupon.value),
    discountAmount
  });
}
