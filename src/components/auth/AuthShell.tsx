import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerHref: string;
  footerAction: string;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footerText,
  footerHref,
  footerAction
}: AuthShellProps) {
  return (
    <main className="luxury-container grid min-h-[calc(100vh-8rem)] place-items-center py-12 md:py-20">
      <section className="grid w-full max-w-5xl overflow-hidden border border-border bg-card shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden bg-luxury-ink p-10 text-white dark:bg-luxury-dark-surface lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(200,169,126,0.24),transparent_24rem),radial-gradient(circle_at_80%_80%,rgba(93,31,46,0.34),transparent_22rem)]" />
          <div className="relative">
            <p className="type-eyebrow text-luxury-gold">Mugnee Atelier</p>
            <h2 className="type-section-title mt-5 text-white">Private client access</h2>
          </div>
          <p className="relative type-body-sm max-w-sm text-white/68">
            Save wishlists, manage orders, and receive early access to capsule drops and styling appointments.
          </p>
        </div>
        <div className="p-6 sm:p-8 md:p-10">
          <p className="type-eyebrow text-luxury-burgundy dark:text-luxury-gold">{eyebrow}</p>
          <h1 className="type-page-title mt-4">{title}</h1>
          <p className="type-body-sm mt-4 max-w-xl text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link href={footerHref} className="font-semibold text-luxury-burgundy underline-offset-4 hover:underline dark:text-luxury-gold">
              {footerAction}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
