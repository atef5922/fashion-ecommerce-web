import { ProductGridSkeleton } from "@/components/shop/ProductGrid";

export default function ShopLoading() {
  return (
    <div className="container py-8 md:py-20">
      <div className="mb-8 md:mb-12">
        <div className="h-3 w-28 bg-muted dark:bg-luxury-dark-card" />
        <div className="mt-4 h-20 w-56 bg-muted dark:bg-luxury-dark-card" />
      </div>
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <div className="hidden space-y-5 lg:block">
          <div className="h-6 w-32 bg-muted dark:bg-luxury-dark-card" />
          <div className="h-28 bg-muted dark:bg-luxury-dark-card" />
          <div className="h-28 bg-muted dark:bg-luxury-dark-card" />
          <div className="h-28 bg-muted dark:bg-luxury-dark-card" />
        </div>
        <div>
          <div className="mb-8 h-11 bg-muted dark:bg-luxury-dark-card" />
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}
