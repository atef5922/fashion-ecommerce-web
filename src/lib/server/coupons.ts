import type { Coupon } from "@prisma/client";

export function getCouponStatus(coupon: Pick<Coupon, "isActive" | "expiresAt">) {
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return "Expired" as const;
  }

  return coupon.isActive ? ("Active" as const) : ("Inactive" as const);
}

export function calculateCouponDiscount(subtotal: number, coupon: Pick<Coupon, "type" | "value">) {
  if (subtotal <= 0) return 0;

  const rawDiscount =
    coupon.type === "PERCENTAGE"
      ? subtotal * (Number(coupon.value) / 100)
      : Number(coupon.value);

  return Math.max(0, Math.min(subtotal, Math.round(rawDiscount * 100) / 100));
}
