import { prisma } from "@/lib/prisma";

type MonthlyPoint = {
  label: string;
  revenue: number;
  orders: number;
  customers: number;
};

export type DashboardAnalytics = {
  monthly: MonthlyPoint[];
  topSellingProducts: Array<{
    id: string;
    name: string;
    quantitySold: number;
    revenue: number;
  }>;
};

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: getMonthKey(date),
      label: getMonthLabel(date),
      revenue: 0,
      orders: 0,
      customers: 0
    };
  });

  const monthMap = new Map(months.map((month) => [month.key, month]));

  const [orders, customers, orderItems] = await Promise.all([
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth() - 5, 1)
        }
      },
      select: {
        createdAt: true,
        total: true
      }
    }),
    prisma.userProfile.findMany({
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth() - 5, 1)
        }
      },
      select: {
        createdAt: true
      }
    }),
    prisma.orderItem.findMany({
      select: {
        quantity: true,
        unitPrice: true,
        product: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  ]);

  for (const order of orders) {
    const month = monthMap.get(getMonthKey(order.createdAt));
    if (!month) continue;
    month.revenue += Number(order.total);
    month.orders += 1;
  }

  for (const customer of customers) {
    const month = monthMap.get(getMonthKey(customer.createdAt));
    if (!month) continue;
    month.customers += 1;
  }

  const productMap = new Map<string, DashboardAnalytics["topSellingProducts"][number]>();

  for (const item of orderItems) {
    const existing = productMap.get(item.product.id) ?? {
      id: item.product.id,
      name: item.product.name,
      quantitySold: 0,
      revenue: 0
    };

    existing.quantitySold += item.quantity;
    existing.revenue += item.quantity * Number(item.unitPrice);
    productMap.set(item.product.id, existing);
  }

  const topSellingProducts = [...productMap.values()]
    .sort((a, b) => {
      if (b.quantitySold !== a.quantitySold) return b.quantitySold - a.quantitySold;
      return b.revenue - a.revenue;
    })
    .slice(0, 5);

  return {
    monthly: months,
    topSellingProducts
  };
}
