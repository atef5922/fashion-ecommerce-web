import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAdmin } from "@/lib/server/auth";

export async function GET() {
  const { error } = await requireServerAdmin();
  if (error) return error;

  const customers = await prisma.userProfile.findMany({
    include: {
      orders: true
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(
    customers.map((customer) => {
      const spent = customer.orders.reduce((sum, order) => sum + Number(order.total), 0);
      const status = spent >= 50000 ? "VIP" : "Active";

      return {
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email,
        orders: customer.orders.length,
        spent,
        status
      };
    })
  );
}
