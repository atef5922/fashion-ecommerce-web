"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fashionImages } from "@/data/images";

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let context: { revert: () => void } | undefined;
    let isMounted = true;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollTriggerModule]) => {
      if (!isMounted || !root.current) {
        return;
      }

      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        gsap.set([".hero-kicker", ".hero-word", ".hero-copy", ".hero-panel"], { clearProps: "all" });
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline
          .from(".hero-kicker", { y: 22, opacity: 0, duration: 0.7 })
          .from(".hero-word", { yPercent: 110, rotate: 1.5, opacity: 0, stagger: 0.08, duration: 1.05 }, "-=0.25")
          .from(".hero-copy", { y: 24, opacity: 0, duration: 0.75, clearProps: "transform,opacity" }, "-=0.5")
          .from(".hero-panel", { y: 26, opacity: 0, scale: 0.97, duration: 0.9, clearProps: "transform,opacity" }, "-=0.55")
          .set([".hero-kicker", ".hero-word", ".hero-copy", ".hero-panel"], { clearProps: "transform,opacity" });
        gsap.fromTo(".hero-image", { scale: 1.12 }, { scale: 1, duration: 1.9, ease: "power2.out" });
        gsap.to(".hero-image", {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }, element);
    });

    return () => {
      isMounted = false;
      context?.revert();
    };
  }, []);

  return (
    <section ref={root} className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-luxury-ink text-white md:min-h-[calc(100vh-5rem)]">
      <Image
        src={fashionImages.hero.main}
        alt="Editorial fashion campaign"
        fill
        priority
        sizes="100vw"
        className="hero-image object-cover object-center opacity-85"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.86),rgba(0,0,0,0.34)_44%,rgba(0,0,0,0.06)_74%),linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.6))]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-luxury-ink/80 to-transparent" />
      <div className="luxury-container relative grid min-h-[calc(100svh-4rem)] items-end gap-7 pb-8 pt-20 md:min-h-[calc(100vh-5rem)] md:grid-cols-[minmax(0,1fr)_335px] md:items-center md:gap-8 md:pt-24 lg:grid-cols-[minmax(0,1fr)_385px] lg:gap-12 lg:pb-20 xl:grid-cols-[minmax(0,1fr)_410px] xl:pb-0">
        <div className="max-w-[49rem] self-center">
          <p className="hero-kicker fine-label mb-4 text-white/72 dark:text-white/72 md:mb-5">BORNO / NEW COLLECTION 2026</p>
          <h1 className="font-display text-[clamp(3rem,7.55vw,7.85rem)] font-semibold leading-[0.92] tracking-normal text-white md:leading-[0.87]">
            <span className="block overflow-hidden pb-2"><span className="hero-word inline-block">Modern restraint,</span></span>
            <span className="block overflow-hidden pb-2"><span className="hero-word inline-block italic">soft power.</span></span>
          </h1>
          <div className="hero-copy mt-6 grid max-w-[34rem] gap-5 md:mt-8 md:gap-6">
            <p className="max-w-[32rem] text-[0.96rem] leading-7 text-white/80 md:text-[1.02rem] md:leading-8">
              Editorial tailoring, liquid satin, and sculptural essentials arranged for a wardrobe that reads expensive before it says a word.
            </p>
            <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-white/90 bg-white text-luxury-ink shadow-[0_16px_38px_rgba(0,0,0,0.22)] hover:border-white hover:bg-white/12 hover:text-white sm:w-auto">
                  SHOP COLLECTION <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full border border-white/18 bg-white/5 text-white hover:border-white/30 hover:bg-white/10 sm:w-auto">
                  DISCOVER BORNO
                </Button>
              </Link>
            </div>
            <div className="grid max-w-xl grid-cols-3 gap-3 border-t border-white/16 pt-5 text-white/68">
              <HeroFact value="42" label="new arrivals" />
              <HeroFact value="3" label="capsule edits" />
              <HeroFact value="24h" label="styling reply" />
            </div>
          </div>
        </div>
        <div className="hero-panel relative z-10 mb-6 mt-16 hidden w-full justify-self-end translate-x-3 translate-y-0 rounded-[1.15rem] border border-white/16 bg-black/20 p-3 shadow-[0_26px_70px_rgba(0,0,0,0.28)] opacity-100 backdrop-blur-xl transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_32px_90px_rgba(0,0,0,0.34)] md:block lg:mt-24 lg:translate-x-4 xl:translate-x-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[0.85rem]">
            <Image
              src={fashionImages.hero.feature}
              alt="Featured evening edit"
              fill
              sizes="(min-width: 1280px) 410px, (min-width: 1024px) 385px, 335px"
              className="object-cover object-center transition duration-[1400ms] ease-out hover:scale-[1.03]"
            />
          </div>
          <div className="mt-5 flex items-end justify-between gap-6">
            <div>
              <p className="fine-label text-white/60 dark:text-white/60">Featured edit</p>
              <h2 className="font-display text-[clamp(1.55rem,2.35vw,2.25rem)] font-semibold leading-none">Evening satin</h2>
            </div>
            <Link href="/shop" className="fine-label whitespace-nowrap border-b border-white/50 pb-1 text-white/80 dark:text-white/80">
              Explore
            </Link>
          </div>
        </div>
      </div>
      <div className="luxury-container pointer-events-none absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 text-white/60 dark:text-white/60 xl:block">
        <div className="flex max-w-[calc(100%-30rem)] items-center gap-5">
          <span className="fine-label shrink-0 dark:text-white/60">Scroll</span>
          <span className="h-px flex-1 bg-white/35" />
          <span className="fine-label shrink-0 dark:text-white/60">Crafted for conversion</span>
        </div>
      </div>
    </section>
  );
}


function HeroFact({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold leading-none text-white md:text-3xl">{value}</p>
      <p className="mt-2 text-[0.62rem] font-semibold uppercase leading-4 tracking-[0.14em] text-white/52">{label}</p>
    </div>
  );
}
