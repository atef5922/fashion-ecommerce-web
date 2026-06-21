import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAdmin } from "@/lib/server/auth";

const allowedStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

function formatOrderStatus(status: typeof allowedStatuses[number]) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export async function GET() {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: true
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(
    orders.map((order) => ({
      id: order.orderNumber,
      customer: `${order.user.firstName} ${order.user.lastName}`.trim() || order.user.email,
      total: Number(order.total),
      status: formatOrderStatus(order.status),
      date: order.createdAt.toISOString().slice(0, 10),
      items: order.items.length
    }))
  );
}

export async function PATCH(request: Request) {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const body = (await request.json()) as { orderId?: string; status?: string };

  if (!body.orderId || !body.status) {
    return NextResponse.json({ message: "Order id and status are required." }, { status: 400 });
  }

  const normalizedStatus = body.status.toUpperCase();

  if (!allowedStatuses.includes(normalizedStatus as typeof allowedStatuses[number])) {
    return NextResponse.json({ message: "Invalid order status." }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { orderNumber: body.orderId },
    data: {
      status: normalizedStatus as typeof allowedStatuses[number]
    },
    include: {
      user: true,
      items: true
    }
  });

  return NextResponse.json({
    id: updated.orderNumber,
    customer: `${updated.user.firstName} ${updated.user.lastName}`.trim() || updated.user.email,
    total: Number(updated.total),
    status: formatOrderStatus(updated.status),
    date: updated.createdAt.toISOString().slice(0, 10),
    items: updated.items.length
  });
}
