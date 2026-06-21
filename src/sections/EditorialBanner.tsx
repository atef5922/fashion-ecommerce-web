import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ruler, Sparkles, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fashionImages } from "@/data/images";

const storyPoints = [
  { label: "Weightless layers", icon: Wind },
  { label: "Precision proportion", icon: Ruler },
  { label: "Polished from 9 to late", icon: Sparkles }
];

export function EditorialBanner() {
  return (
    <section className="relative overflow-hidden bg-[#11100f] text-white">
      <div className="grid min-h-[680px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative order-2 min-h-[420px] overflow-hidden lg:order-1 lg:min-h-[680px]">
          <Image src={fashionImages.campaigns.tailoring} alt="Soft tailoring campaign" fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover transition duration-[1400ms] hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.58))]" />
          <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2 md:bottom-8 md:left-8 md:right-8">
            {storyPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.label} className="border border-white/18 bg-white/10 p-3 backdrop-blur-xl">
                  <Icon className="mb-3 size-4 text-luxury-gold" />
                  <p className="text-[10px] font-semibold uppercase leading-4 tracking-[0.14em] text-white/78">{point.label}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="order-1 flex items-center px-5 py-14 sm:px-8 md:px-12 lg:order-2 lg:px-16">
          <div className="max-w-2xl">
            <p className="type-eyebrow text-luxury-gold">Campaign 2026 / Soft Tailoring</p>
            <h2 className="type-section-title mt-5 max-w-3xl text-white">The office-to-arrival uniform, edited down to its strongest line.</h2>
            <p className="type-body-sm mt-6 max-w-xl text-white/70 md:text-base md:leading-8">
              Air-light layers, clean waistlines, and tailoring that keeps its shape through movement. Built for buyers who want polish without costume.
            </p>
            <div className="mt-8 grid gap-4 border-y border-white/12 py-6 sm:grid-cols-3">
              <Metric value="16" label="capsule pieces" />
              <Metric value="3" label="neutral palettes" />
              <Metric value="24h" label="client styling reply" />
            </div>
            <Link href="/shop?query=tailoring" className="mt-8 inline-block">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-luxury-ink">
                Explore edit <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-4xl leading-none text-white">{value}</p>
      <p className="fine-label mt-2 text-white/55">{label}</p>
    </div>
  );
}
