import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD, formatCurrency } from "@/lib/currency";
import { siteConfig } from "@/lib/constants";

export function TrustMarquee() {
  return (
    <div className="relative z-50 border-b border-black/10 bg-luxury-ivory/95 text-luxury-ink backdrop-blur-xl dark:border-luxury-dark-border dark:bg-luxury-dark-surface dark:text-luxury-dark-secondary">
      <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold/65 to-transparent" />
      <div className="luxury-container flex min-h-10 items-center justify-center py-2 text-center md:min-h-11 md:justify-between md:py-0">
        <p className="fine-label text-[0.62rem] text-luxury-ink/72 dark:text-luxury-dark-secondary md:text-[0.64rem]">
          {siteConfig.announcement}
        </p>

        <div className="hidden items-center gap-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-luxury-ink/58 dark:text-luxury-dark-secondary lg:flex">
          <span>Complimentary delivery over {formatCurrency(FREE_SHIPPING_THRESHOLD)}</span>
          <span aria-hidden="true" className="text-luxury-burgundy/35 dark:text-luxury-gold/45">/</span>
          <Link href="/contact" className="transition hover:text-luxury-ink dark:hover:text-luxury-gold">
            Client care
          </Link>
          <span aria-hidden="true" className="text-luxury-burgundy/35 dark:text-luxury-gold/45">/</span>
          <span>Bangladesh | BDT</span>
        </div>

        <div className="hidden md:block lg:hidden">
          <p className="fine-label text-[0.6rem] text-luxury-ink/60 dark:text-luxury-dark-secondary">
            Delivery over {formatCurrency(FREE_SHIPPING_THRESHOLD)} | Bangladesh
          </p>
        </div>

        <div className="md:hidden">
          <p className="fine-label text-[0.58rem] text-luxury-ink/68 dark:text-luxury-dark-secondary">
            Private sale and complimentary delivery over {formatCurrency(FREE_SHIPPING_THRESHOLD)}
          </p>
        </div>
      </div>
    </div>
  );
}
