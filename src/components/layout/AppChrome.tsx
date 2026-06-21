"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CartFlyAnimation } from "@/components/commerce/CartFlyAnimation";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SearchModal } from "@/components/layout/SearchModal";
import { PageLoader } from "@/components/ui/PageLoader";
import { PageTransition } from "@/components/ui/PageTransition";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { TrustMarquee } from "@/sections/TrustMarquee";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <>
        <PageLoader />
        {children}
      </>
    );
  }

  return (
    <>
      <PageLoader />
      <TrustMarquee />
      <Navbar />
      <CartFlyAnimation />
      <SearchModal />
      <CartDrawer />
      <PageTransition>{children}</PageTransition>
      <ScrollToTop />
      <Footer />
    </>
  );
}
