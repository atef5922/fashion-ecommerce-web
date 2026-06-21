import { AdminChart } from "@/components/admin/AdminChart";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { getDashboardAnalytics } from "@/lib/server/analytics";
import { prisma } from "@/lib/prisma";
import { ensureCatalogSeeded } from "@/lib/server/catalog";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await ensureCatalogSeeded();

  const [orders, customers, products, lowStockProducts, analytics] = await Promise.all([
    prisma.order.findMany({
      include: { user: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.userProfile.count(),
    prisma.product.count(),
    prisma.product.findMany({
      where: {
        stock: {
          lte: 5
        }
      },
      orderBy: {
        stock: "asc"
      },
      take: 5
    }),
    getDashboardAnalytics()
  ]);

  const totalRevenue = analytics.monthly.reduce((sum, month) => sum + month.revenue, 0);
  const totalOrders = analytics.monthly.reduce((sum, month) => sum + month.orders, 0);
  const totalCustomers = analytics.monthly.reduce((sum, month) => sum + month.customers, 0);

  const adminStats = [
    { label: "Revenue", value: formatPrice(totalRevenue), change: "Last 6 months" },
    { label: "Orders", value: totalOrders.toString(), change: "Last 6 months" },
    { label: "Customers", value: customers.toString(), change: `${totalCustomers} new in 6 months` },
    { label: "Products", value: products.toString(), change: "Live in catalog" }
  ];

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Revenue, orders, customers, products, and store performance at a glance." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => <AdminStatCard key={stat.label} {...stat} />)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-6">
          <AdminChart data={analytics.monthly} />
          <section className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="type-card-title">Top selling products</h2>
              <span className="fine-label text-luxury-burgundy dark:text-luxury-gold">{analytics.topSellingProducts.length} ranked</span>
            </div>
            <div className="mt-5 grid gap-3">
              {analytics.topSellingProducts.length ? analytics.topSellingProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 border border-border p-3 dark:border-luxury-dark-border">
                  <div>
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{product.quantitySold} units sold</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(product.revenue)}</span>
                </div>
              )) : <p className="text-sm text-muted-foreground">Top selling products will appear after customer orders come in.</p>}
            </div>
          </section>
        </div>
        <div className="grid gap-6">
          <section className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="type-card-title">Latest orders</h2>
              <span className="fine-label text-luxury-burgundy dark:text-luxury-gold">{orders.length} recent</span>
            </div>
            <div className="mt-5 grid gap-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-border p-3 dark:border-luxury-dark-border">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{order.orderNumber}</span>
                    <AdminStatusBadge status={order.status.charAt(0) + order.status.slice(1).toLowerCase()} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{`${order.user.firstName} ${order.user.lastName}`.trim() || order.user.email}</span>
                    <span>{formatPrice(Number(order.total))}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 ? <p className="text-sm text-muted-foreground">Orders will appear here as soon as customers start checking out.</p> : null}
            </div>
          </section>

          <section className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="type-card-title">Low stock</h2>
              <span className="fine-label text-luxury-burgundy dark:text-luxury-gold">{lowStockProducts.length} items</span>
            </div>
            <div className="mt-5 grid gap-3">
              {lowStockProducts.length ? lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 border border-border p-3 dark:border-luxury-dark-border">
                  <div>
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{product.stock === 0 ? "Out of stock" : `${product.stock} units left`}</p>
                  </div>
                  <span className={`fine-label ${product.stock === 0 ? "text-luxury-burgundy" : "text-luxury-clay dark:text-luxury-gold"}`}>
                    {product.stock === 0 ? "Urgent" : "Low"}
                  </span>
                </div>
              )) : <p className="text-sm text-muted-foreground">No low-stock products right now.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
