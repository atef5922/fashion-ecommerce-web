"use client";

import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";

export function NewArrivals() {
  const products = useStorefrontProducts();

  return (
    <section className="section-padding bg-white dark:bg-luxury-dark-surface">
      <div className="luxury-container">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <SectionHeader eyebrow="Fresh arrivals" title="New pieces with presence" description="Sharp silhouettes, sensual fabrics, and accessories that finish the room." />
          <Link href="/shop" className="mb-12 hidden fine-label border-b border-luxury-ink pb-1 md:block">View all products</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
          {products.filter((product) => product.isNew || product.isFeatured).slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/shop"><Button variant="outline">View all products</Button></Link>
        </div>
      </div>
    </section>
  );
}
