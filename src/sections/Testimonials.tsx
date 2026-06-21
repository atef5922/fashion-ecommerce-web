import { Quote, ShieldCheck, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="section-padding bg-luxury-ivory dark:bg-background">
      <div className="luxury-container">
        <div className="mb-8 grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="type-eyebrow text-luxury-burgundy dark:text-luxury-gold">Client proof</p>
            <h2 className="type-section-title mt-3">The feeling after arrival</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["4.8 average fit score", "96% kept after delivery", "24h styling response"].map((item) => (
              <div key={item} className="border border-border bg-card p-4 text-sm font-medium dark:border-luxury-dark-border dark:bg-luxury-dark-card">
                <ShieldCheck className="mb-3 size-4 text-luxury-burgundy dark:text-luxury-gold" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <blockquote key={testimonial.name} className={`group border border-border bg-card p-6 shadow-soft transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(23,23,23,0.1)] dark:border-luxury-dark-border dark:bg-luxury-dark-card md:p-8 ${index === 1 ? "md:mt-10" : ""}`}>
              <Quote className="mb-7 size-8 text-luxury-burgundy/40 dark:text-luxury-gold/60" />
              <div className="mb-5 flex gap-1 text-luxury-clay dark:text-luxury-gold" aria-label="5 star review">
                {Array.from({ length: 5 }).map((_, star) => <Star key={star} className="size-3.5 fill-current" />)}
              </div>
              <p className="type-card-title">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="mt-8 border-t border-border pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {testimonial.name}, {testimonial.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
