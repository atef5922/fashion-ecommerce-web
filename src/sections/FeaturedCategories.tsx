import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";

export function FeaturedCategories() {
  return (
    <section className="section-padding relative overflow-hidden bg-luxury-ivory dark:bg-background">
      <div className="pointer-events-none absolute -left-28 top-16 hidden size-72 rounded-full border border-luxury-gold/20 md:block" />
      <div className="pointer-events-none absolute right-10 top-24 hidden size-36 rounded-full border border-foreground/10 dark:border-white/10 lg:block" />
      <div className="luxury-container relative">
        <div className="grid gap-4 md:gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionHeader eyebrow="Boutique departments" title="Curated by silhouette" description="Move through refined worlds shaped around occasion, proportion, and mood." />
          <div className="mb-8 grid gap-5 md:mb-12 lg:ml-auto">
            <p className="type-body-sm max-w-xl text-muted-foreground">
              Each department is built like a boutique wall: fewer distractions, stronger imagery, and a clear route into the collection.
            </p>
            <div className="hidden items-center gap-4 text-muted-foreground md:flex">
              <span className="grid size-14 place-items-center rounded-full border border-border bg-background/50 font-display text-xl text-foreground shadow-soft dark:bg-luxury-dark-card/60">
                04
              </span>
              <span className="fine-label max-w-36 leading-5 text-muted-foreground">edited departments</span>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4 md:gap-3">
          {categories.map((category, index) => (
            <Reveal key={category.title}>
              <Link
                href={category.href}
                className={`group relative block overflow-hidden border border-transparent bg-muted shadow-none transition duration-500 hover:-translate-y-2 hover:border-luxury-gold/35 hover:shadow-soft dark:hover:border-luxury-gold/25 ${index === 1 ? "md:mt-14" : ""} ${index === 2 ? "md:mt-6" : ""}`}
              >
                <div className="relative aspect-[3/4]">
                  <Image src={category.image} alt={category.title} fill sizes="(min-width: 768px) 25vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-black/0 transition duration-500 group-hover:from-black/84" />
                  <div className="absolute left-5 top-5 grid size-12 place-items-center rounded-full border border-white/45 bg-black/12 text-[0.72rem] font-semibold tracking-[0.16em] text-white backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:border-white/80 md:left-6 md:top-6 md:size-14">
                    0{index + 1}
                  </div>
                  <div className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-white group-hover:text-luxury-ink md:right-6 md:top-6">
                    <ArrowUpRight className="size-4" />
                  </div>
                  <div className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full border border-white/15 transition duration-700 group-hover:scale-125 group-hover:border-white/25" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
                  <h3 className="type-subsection-title">{category.title}</h3>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <p className="max-w-48 text-xs leading-5 text-white/72">Explore the edit with pieces selected for proportion and polish.</p>
                    <span className="hidden size-2 shrink-0 rounded-full bg-white md:block" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
