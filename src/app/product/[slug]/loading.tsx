export default function ProductLoading() {
  return (
    <section className="container grid gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="aspect-[3/4] bg-muted dark:bg-luxury-dark-card" />
        ))}
      </div>
      <aside className="top-28 lg:sticky">
        <div className="h-6 w-40 bg-muted dark:bg-luxury-dark-card" />
        <div className="mt-6 h-3 w-32 bg-muted dark:bg-luxury-dark-card" />
        <div className="mt-4 h-24 w-full bg-muted dark:bg-luxury-dark-card" />
        <div className="mt-6 h-5 w-28 bg-muted dark:bg-luxury-dark-card" />
        <div className="mt-6 space-y-3">
          <div className="h-3 w-full bg-muted dark:bg-luxury-dark-card" />
          <div className="h-3 w-4/5 bg-muted dark:bg-luxury-dark-card" />
          <div className="h-3 w-3/5 bg-muted dark:bg-luxury-dark-card" />
        </div>
        <div className="mt-8 grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 bg-muted dark:bg-luxury-dark-card" />
          ))}
        </div>
        <div className="mt-8 h-12 bg-muted dark:bg-luxury-dark-card" />
      </aside>
    </section>
  );
}
