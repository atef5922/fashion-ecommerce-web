import Image from "next/image";
import Link from "next/link";
import { fashionImages } from "@/data/images";

const collections = [
  {
    eyebrow: "Discount",
    title: "Sale Pieces",
    subtitle: "Private markdowns on selected signatures",
    image: fashionImages.collections.evening,
    href: "/shop?edit=discount"
  },
  {
    eyebrow: "New",
    title: "New Arrivals",
    subtitle: "Fresh silhouettes just added to the edit",
    image: fashionImages.campaigns.newsletter,
    href: "/shop?edit=new&sort=new"
  },
  {
    eyebrow: "Popular",
    title: "Most Wanted",
    subtitle: "Customer-loved pieces with proven polish",
    image: fashionImages.collections.accessories,
    href: "/shop?edit=popular"
  }
];

export function TrendingCollections() {
  return (
    <section className="py-12 bg-white dark:bg-luxury-dark-surface md:py-16">
      <div className="luxury-container">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="type-eyebrow text-luxury-burgundy dark:text-luxury-gold">Trending rooms</p>
            <h2 className="mt-2 font-display text-[clamp(2.2rem,5vw,4.8rem)] font-semibold leading-none">Wardrobe moments</h2>
          </div>
          <p className="type-body-sm hidden max-w-md text-muted-foreground md:block">Guided edits for faster discovery, stronger imagery, and a clearer route into the collection.</p>
        </div>
        <div className="grid overflow-hidden border border-border bg-luxury-ink dark:border-luxury-dark-border md:grid-cols-3">
          {collections.map(({ eyebrow, title, subtitle, image, href }) => (
            <Link
              key={title}
              href={href}
              className="group relative block min-h-[340px] overflow-hidden border-b border-white/18 bg-luxury-ink text-center text-white last:border-b-0 md:min-h-[430px] md:border-b-0 md:border-r md:last:border-r-0"
            >
              <Image
                src={image}
                alt={title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/22 transition duration-500 group-hover:bg-black/34" />
              <div className="absolute inset-x-0 top-8 px-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white">{eyebrow}</p>
              </div>
              <div className="absolute inset-x-0 top-1/2 mx-auto grid max-w-sm -translate-y-1/2 place-items-center px-6">
                <h3 className="text-balance font-sans text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[0.98] tracking-normal text-white">
                  {title}
                </h3>
                <p className="mt-4 text-sm font-medium leading-6 text-white/82">{subtitle}</p>
              </div>
              <div className="absolute inset-x-0 bottom-9">
                <span className="inline-flex border-b border-white/70 pb-1 text-xs font-bold uppercase tracking-[0.08em] text-white transition duration-300 group-hover:tracking-[0.16em]">
                  Shop now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
