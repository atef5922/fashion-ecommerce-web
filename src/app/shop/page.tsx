"use client";

import { useProductFilters } from "@/hooks/useProductFilters";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopToolbar } from "@/components/shop/ShopToolbar";

export default function ShopPage() {
  const storefrontProducts = useStorefrontProducts();
  const { filters, filteredProducts, priceBounds, setFilters, resetFilters } = useProductFilters(storefrontProducts);

  return (
    <div className="container py-8 md:py-20">
      <div className="mb-8 md:mb-12">
        <p className="type-eyebrow text-luxury-burgundy">Collection</p>
        <h1 className="type-page-title mt-3">Shop</h1>
      </div>
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} setFilters={setFilters} resetFilters={resetFilters} priceBounds={priceBounds} />
        </div>
        <div>
          <div className="mb-4 lg:hidden">
            <FilterDrawer filters={filters} setFilters={setFilters} resetFilters={resetFilters} priceBounds={priceBounds} count={filteredProducts.length} />
          </div>
          <ShopToolbar filters={filters} setFilters={setFilters} resetFilters={resetFilters} count={filteredProducts.length} />
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
