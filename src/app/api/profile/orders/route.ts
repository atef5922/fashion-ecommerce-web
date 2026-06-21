import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerUser } from "@/lib/server/auth";

function formatOrderStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export async function GET() {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;

  const profile = await prisma.userProfile.findUnique({
    where: { supabaseUserId: user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  if (!profile) {
    return NextResponse.json([]);
  }

  return NextResponse.json(
    profile.orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: formatOrderStatus(order.status),
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      shipping: Number(order.shipping),
      tax: Number(order.tax),
      couponCode: order.couponCode ?? null,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt.toISOString(),
      estimatedDelivery: order.estimatedDelivery?.toISOString() ?? null,
      shippingAddress: order.shippingJson,
      billingAddress: order.billingJson,
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        color: item.color,
        size: item.size
      }))
    }))
  );
}
