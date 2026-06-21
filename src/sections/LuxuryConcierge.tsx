import { Gift, RefreshCcw, Sparkles, Truck } from "lucide-react";

const services = [
  {
    title: "Free Shipping",
    description: "Complimentary delivery on considered orders, wrapped and dispatched with atelier-level care.",
    icon: Truck
  },
  {
    title: "Easy Returns",
    description: "A calm return experience with guided support, clear windows, and no unnecessary friction.",
    icon: RefreshCcw
  },
  {
    title: "Personal Styling",
    description: "Private wardrobe guidance for proportions, occasions, capsule edits, and finishing details.",
    icon: Sparkles
  },
  {
    title: "Premium Packaging",
    description: "Every piece arrives in tactile packaging designed for gifting, storage, and quiet ceremony.",
    icon: Gift
  }
];

export function LuxuryConcierge() {
  return (
    <section className="section-padding bg-white dark:bg-luxury-dark-surface">
      <div className="luxury-container">
        <div className="mb-8 grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="type-eyebrow text-luxury-burgundy dark:text-luxury-gold">Mugnee concierge</p>
            <h2 className="type-section-title mt-4">Service with a quieter kind of luxury</h2>
          </div>
          <div className="grid gap-3 border-y border-border py-5 text-sm text-muted-foreground dark:border-luxury-dark-border sm:grid-cols-3">
            <span>Wrapped by hand</span>
            <span>Styled on request</span>
            <span>Resolved before it feels like support</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group relative overflow-hidden border border-border bg-card p-6 shadow-[0_1px_0_rgba(23,23,23,0.06)] transition duration-500 hover:-translate-y-1.5 hover:border-luxury-ink/18 hover:shadow-[0_28px_80px_rgba(23,23,23,0.11)] dark:border-luxury-dark-border dark:bg-luxury-dark-card dark:hover:border-luxury-gold/35 dark:hover:shadow-[0_28px_80px_rgba(0,0,0,0.45)] md:p-7"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-luxury-burgundy via-luxury-gold to-transparent transition duration-700 group-hover:scale-x-100" />
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="grid size-12 place-items-center border border-luxury-ink/12 bg-luxury-ivory text-luxury-ink transition duration-500 group-hover:border-luxury-burgundy/30 group-hover:text-luxury-burgundy dark:border-luxury-dark-border dark:bg-luxury-dark-surface dark:text-luxury-gold">
                    <Icon className="size-5" />
                  </div>
                  <span className="fine-label text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="type-card-title">{service.title}</h3>
                <p className="type-body-sm mt-4 text-muted-foreground">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
