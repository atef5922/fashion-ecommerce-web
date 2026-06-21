import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, ShieldCheck } from "lucide-react";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { Button } from "@/components/ui/button";
import { fashionImages } from "@/data/images";

export function FlashSale() {
  return (
    <section className="bg-luxury-burgundy text-white">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[420px] overflow-hidden md:min-h-[560px]">
          <Image src={fashionImages.campaigns.sale} alt="Private sale collection" fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover transition duration-[1200ms] hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.62))]" />
          <div className="absolute bottom-5 left-5 right-5 border border-white/18 bg-black/20 p-4 backdrop-blur-xl md:bottom-8 md:left-8 md:right-auto md:w-80">
            <p className="fine-label text-luxury-gold">Client access window</p>
            <p className="mt-3 text-sm leading-6 text-white/78">Sale inventory is reserved in small batches to avoid overselling and keep fulfillment calm.</p>
          </div>
        </div>
        <div className="flex items-center p-6 md:p-12 lg:p-16">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 border border-white/18 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
              <Clock3 className="size-4 text-luxury-gold" /> Private flash sale
            </div>
            <h2 className="type-section-title mt-4 text-white">Selected signatures, released in a quieter sale room.</h2>
            <p className="type-body-sm mt-5 text-white/72">A short edit of best-performing silhouettes with limited sizing, transparent stock, and premium packaging still included.</p>
            <div className="mt-8">
              <CountdownTimer targetDate={new Date("2026-06-30T23:59:59")} />
            </div>
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-white/65">
                <span>Reserved inventory</span>
                <span>68%</span>
              </div>
              <div className="h-2 bg-white/18">
                <div className="h-full w-[68%] bg-luxury-gold" />
              </div>
            </div>
            <div className="mt-6 flex items-start gap-2 text-xs leading-5 text-white/66">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-luxury-gold" /> Sale pieces remain eligible for guided size support and signature packaging.
            </div>
            <Link href="/shop?sort=price-desc" className="mt-8 inline-block">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-luxury-ink">
                Shop sale <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
