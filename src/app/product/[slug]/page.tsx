import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { RecentlyViewedProducts } from "@/components/product/RecentlyViewedProducts";
import { RecentlyViewedTracker } from "@/components/product/RecentlyViewedTracker";
import { products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <RecentlyViewedTracker product={product} />
      <ProductDetail product={product} />
      <section className="container grid gap-4 pb-16 md:grid-cols-3">
        {products.slice(0, 3).map((item) => (
          <div key={item.id} className="border border-border bg-card p-6 dark:border-luxury-dark-border dark:bg-luxury-dark-card">
            <p className="type-eyebrow text-muted-foreground">Frequently bought together</p>
            <h3 className="type-card-title mt-3">{item.name}</h3>
          </div>
        ))}
      </section>
      <ReviewsSection product={product} />
      <RelatedProducts slug={product.slug} />
      <RecentlyViewedProducts currentProductId={product.id} />
    </>
  );
}
