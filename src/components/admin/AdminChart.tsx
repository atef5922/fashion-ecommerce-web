type AdminChartPoint = {
  label: string;
  revenue: number;
  orders: number;
  customers: number;
};

export function AdminChart({ data }: { data: AdminChartPoint[] }) {
  const maxRevenue = Math.max(...data.map((point) => point.revenue), 1);
  const maxOrders = Math.max(...data.map((point) => point.orders), 1);
  const maxCustomers = Math.max(...data.map((point) => point.customers), 1);

  return (
    <section className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="type-card-title">Store analytics</h2>
          <p className="mt-1 text-sm text-muted-foreground">Revenue, orders, and new customers over the last six months.</p>
        </div>
        <span className="fine-label text-luxury-burgundy dark:text-luxury-gold">Live DB data</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2"><span className="size-2 bg-luxury-ink dark:bg-luxury-gold" /> Revenue</span>
        <span className="flex items-center gap-2"><span className="size-2 bg-luxury-burgundy/70 dark:bg-luxury-dark-secondary" /> Orders</span>
        <span className="flex items-center gap-2"><span className="size-2 bg-luxury-olive/70 dark:bg-luxury-gold/60" /> Customers</span>
      </div>
      <div className="mt-8 flex h-72 items-end gap-4">
        {data.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-56 w-full items-end justify-center gap-1 border-b border-border">
              <span className="w-4 bg-luxury-ink dark:bg-luxury-gold" style={{ height: `${Math.max((point.revenue / maxRevenue) * 100, point.revenue > 0 ? 8 : 0)}%` }} />
              <span className="w-4 bg-luxury-burgundy/70 dark:bg-luxury-dark-secondary" style={{ height: `${Math.max((point.orders / maxOrders) * 100, point.orders > 0 ? 8 : 0)}%` }} />
              <span className="w-4 bg-luxury-olive/70 dark:bg-luxury-gold/60" style={{ height: `${Math.max((point.customers / maxCustomers) * 100, point.customers > 0 ? 8 : 0)}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{point.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
