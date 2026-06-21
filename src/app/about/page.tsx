import Image from "next/image";
import { fashionImages } from "@/data/images";

export default function AboutPage() {
  return (
    <div>
      <section className="container grid gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="type-eyebrow text-luxury-burgundy">About Mugnee</p>
          <h1 className="type-page-title mt-4">A quieter way to dress beautifully.</h1>
        </div>
        <p className="type-body self-end text-muted-foreground">
          Mugnee Atelier creates considered silhouettes for modern wardrobes: precise tailoring, fluid layers, tactile knits, and accessories selected with quiet restraint.
        </p>
      </section>
      <section className="relative min-h-[620px]">
        <Image src={fashionImages.campaigns.about} alt="Atelier clothing rail" fill sizes="100vw" className="object-cover" />
      </section>
      <section className="container grid gap-6 py-16 md:grid-cols-3">
        {["Modern Craft", "Responsible Materials", "Lasting Wardrobes"].map((item) => (
          <div key={item} className="border border-border bg-card p-8 dark:border-luxury-dark-border dark:bg-luxury-dark-card">
            <h2 className="type-subsection-title">{item}</h2>
            <p className="type-body-sm mt-4 text-muted-foreground">Each detail is shaped around comfort, longevity, and a composed sense of everyday elegance.</p>
          </div>
        ))}
      </section>
    </div>
  );
}
