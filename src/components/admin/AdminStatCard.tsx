export function AdminStatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <article className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
      <p className="fine-label text-muted-foreground">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <strong className="text-3xl font-semibold">{value}</strong>
        <span className="text-xs font-semibold text-luxury-olive dark:text-luxury-gold">{change}</span>
      </div>
    </article>
  );
}
