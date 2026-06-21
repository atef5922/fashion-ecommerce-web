"use client";

import { useEffect } from "react";

export function useLenis() {
  useEffect(() => {
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
    let frame = 0;
    let disposed = false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const raf = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(raf);
    };

    import("lenis").then(({ default: Lenis }) => {
      if (disposed) return;
      lenis = new Lenis({
        duration: 0.9,
        smoothWheel: true
      });
      frame = requestAnimationFrame(raf);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);
}
