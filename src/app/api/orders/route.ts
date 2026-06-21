import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCatalogSeeded } from "@/lib/server/catalog";
import { calculateCouponDiscount, getCouponStatus } from "@/lib/server/coupons";
import { requireServerUser } from "@/lib/server/auth";
import { ensureUserProfile } from "@/lib/server/profile";
import type { CreateOrderRequest } from "@/types/checkout.types";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/currency";

function formatOrderNumber() {
  return `BRN-${Date.now().toString().slice(-8)}`;
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;

  await ensureCatalogSeeded();

  const data = (await request.json()) as CreateOrderRequest & { notes?: string; paymentMethod?: string };

  if (!Array.isArray(data.items) || data.items.length === 0) {
    return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });
  }

  const requestedQuantities = new Map<string, number>();
  for (const item of data.items) {
    requestedQuantities.set(item.product.id, (requestedQuantities.get(item.product.id) ?? 0) + item.quantity);
  }

  const profile = await ensureUserProfile(user);

  const estimatedDelivery = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5);

  try {
    const order = await prisma.$transaction(async (tx) => {
      const productIds = [...requestedQuantities.keys()];
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds }
        },
        select: {
          id: true,
          name: true,
          stock: true,
          status: true,
          price: true
        }
      });

      if (products.length !== productIds.length) {
        throw new Error("One or more products could not be found. Please refresh your cart and try again.");
      }

      const productMap = new Map(products.map((product) => [product.id, product]));
      const subtotal = data.items.reduce((sum, item) => {
        const product = productMap.get(item.product.id);
        return sum + Number(product?.price ?? item.product.price) * item.quantity;
      }, 0);

      let couponCode: string | null = null;
      let discountAmount = 0;

      if (data.couponCode?.trim()) {
        const coupon = await tx.coupon.findUnique({
          where: {
            code: data.couponCode.trim().toUpperCase()
          }
        });

        if (!coupon) {
          throw new Error("Coupon not found.");
        }

        const couponStatus = getCouponStatus(coupon);
        if (couponStatus === "Expired") {
          throw new Error("This coupon has expired.");
        }

        if (!coupon.isActive) {
          throw new Error("This coupon is inactive.");
        }

        if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
          throw new Error("This coupon has reached its usage limit.");
        }

        couponCode = coupon.code;
        discountAmount = calculateCouponDiscount(subtotal, coupon);
      }

      const discountedSubtotal = Math.max(0, subtotal - discountAmount);
      const shippingAmount = discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
      const taxAmount = Math.round(discountedSubtotal * 0.0825 * 100) / 100;
      const totalAmount = discountedSubtotal + shippingAmount + taxAmount;

      for (const [productId, quantity] of requestedQuantities) {
        const product = productMap.get(productId);

        if (!product || product.status !== "ACTIVE") {
          throw new Error("One or more items are no longer available for purchase.");
        }

        if (product.stock < quantity) {
          throw new Error(`${product.name} has only ${product.stock} item${product.stock === 1 ? "" : "s"} left in stock.`);
        }
      }

      for (const [productId, quantity] of requestedQuantities) {
        const updated = await tx.product.updateMany({
          where: {
            id: productId,
            stock: { gte: quantity }
          },
          data: {
            stock: { decrement: quantity }
          }
        });

        if (updated.count !== 1) {
          const product = productMap.get(productId);
          throw new Error(`${product?.name ?? "This product"} went out of stock while you were checking out. Please review your cart and try again.`);
        }
      }

      const createdOrder = await tx.order.create({
        data: {
          orderNumber: formatOrderNumber(),
          status: "PENDING",
          couponCode,
          subtotal: new Prisma.Decimal(subtotal),
          discount: new Prisma.Decimal(discountAmount),
          shipping: new Prisma.Decimal(shippingAmount),
          tax: new Prisma.Decimal(taxAmount),
          total: new Prisma.Decimal(totalAmount),
          currency: "BDT",
          paymentMethod: data.paymentMethod ?? "cash_on_delivery",
          estimatedDelivery,
          shippingJson: data.shipping,
          billingJson: data.billing,
          notes: data.notes,
          userId: profile.id,
          items: {
            create: data.items.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              color: item.color,
              size: item.size,
              unitPrice: new Prisma.Decimal(item.product.price)
            }))
          }
        }
      });

      if (couponCode) {
        await tx.coupon.update({
          where: { code: couponCode },
          data: {
            usageCount: {
              increment: 1
            }
          }
        });
      }

      await tx.cartItem.deleteMany({ where: { userId: profile.id } });

      return {
        createdOrder,
        totals: {
          subtotal,
          discount: discountAmount,
          shipping: shippingAmount,
          tax: taxAmount,
          total: totalAmount
        }
      };
    });

    return NextResponse.json({
      orderId: order.createdOrder.orderNumber,
      status: "pending",
      createdAt: order.createdOrder.createdAt.toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString(),
      totals: order.totals
    });
  } catch (orderError) {
    const message = orderError instanceof Error ? orderError.message : "Order could not be placed. Please try again.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
