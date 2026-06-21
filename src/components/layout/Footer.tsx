import Link from "next/link";
import {
  ArrowUpRight,
  Facebook,
  Gift,
  Instagram,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  Twitter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FREE_SHIPPING_THRESHOLD, formatCurrency } from "@/lib/currency";

const footerLinks = {
  shop: [
    { label: "New arrivals", href: "/shop?sort=new" },
    { label: "Women", href: "/shop?category=Women" },
    { label: "Men", href: "/shop?category=Men" },
    { label: "Accessories", href: "/shop?category=Accessories" }
  ],
  service: [
    { label: "Wishlist", href: "/wishlist" },
    { label: "Cart", href: "/cart" },
    { label: "Journal", href: "/blog" },
    { label: "Contact", href: "/contact" }
  ],
  house: [
    { label: "About Mugnee", href: "/about" },
    { label: "Private styling", href: "/contact" },
    { label: "Returns", href: "/contact" },
    { label: "Accessibility", href: "/contact" }
  ]
};

const trustItems = [
  { label: `Free shipping over ${formatCurrency(FREE_SHIPPING_THRESHOLD)}`, icon: Truck },
  { label: "Easy returns", icon: RefreshCcw },
  { label: "Premium packaging", icon: Gift },
  { label: "Secure checkout", icon: ShieldCheck }
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
  { label: "Twitter", href: "https://twitter.com/", icon: Twitter }
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0f0f0e] text-white dark:bg-luxury-dark">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(200,169,126,0.16),transparent_34rem),radial-gradient(circle_at_85%_20%,rgba(93,31,46,0.2),transparent_30rem)]" />
      <div className="luxury-container relative">
        <div className="border-b border-white/10 py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="type-eyebrow mb-4 text-luxury-gold">Mugnee Atelier</p>
              <h2 className="type-section-title max-w-5xl">
                Dress with restraint. Arrive with presence.
              </h2>
            </div>
            <div className="border border-white/12 bg-white/[0.06] p-5 backdrop-blur-xl md:p-7">
              <div className="mb-5 flex items-start gap-3">
                <div className="grid size-10 place-items-center border border-luxury-gold/30 text-luxury-gold">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <h3 className="type-card-title">Join the private list</h3>
                  <p className="type-body-sm mt-2 text-white/65">
                    Early capsule access, styling notes, and reserved client appointments.
                  </p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <Input
                  type="email"
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
                  placeholder="Email address"
                  aria-label="Email address"
                />
                <Button type="button" variant="outline" className="border-white/40 text-white hover:bg-white hover:text-luxury-ink dark:border-luxury-gold/55 dark:text-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-luxury-dark">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 border border-white/10 bg-white/[0.035] px-4 py-3 text-white/75">
                <Icon className="size-4 text-luxury-gold" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em]">{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr_1fr] md:py-14">
          <div>
            <h2 className="type-subsection-title">Mugnee</h2>
            <p className="type-body-sm mt-5 max-w-sm text-white/65">
              Premium wardrobe signatures designed for modern elegance, daily movement, and lasting style.
            </p>
            <div className="mt-7 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-10 place-items-center border border-white/12 text-white/65 transition hover:border-luxury-gold hover:text-luxury-gold"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>

          <FooterColumn title="Shop" links={footerLinks.shop} />
          <FooterColumn title="Service" links={footerLinks.service} />
          <FooterColumn title="House" links={footerLinks.house} />

          <div>
            <h3 className="mb-5 fine-label text-white">Client care</h3>
            <div className="grid gap-4 text-sm text-white/65">
              <span className="flex items-center gap-2"><Phone className="size-4 text-luxury-gold" aria-hidden="true" /> +1 212 555 0198</span>
              <span className="flex items-center gap-2"><Mail className="size-4 text-luxury-gold" aria-hidden="true" /> studio@mugnee.com</span>
              <span className="flex items-center gap-2"><MapPin className="size-4 text-luxury-gold" aria-hidden="true" /> New York Atelier</span>
              <span className="flex items-center gap-2"><PackageCheck className="size-4 text-luxury-gold" aria-hidden="true" /> Signature packaging on every order</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Mugnee Atelier. All rights reserved.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/contact" className="transition hover:text-luxury-gold">Privacy</Link>
            <Link href="/contact" className="transition hover:text-luxury-gold">Terms</Link>
            <Link href="/contact" className="transition hover:text-luxury-gold">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <div>
      <h3 className="mb-5 fine-label text-white">{title}</h3>
      <div className="grid gap-3 text-sm text-white/65">
        {links.map((link) => (
          <Link key={link.label} href={link.href} className="group inline-flex w-fit items-center gap-2 transition hover:text-luxury-gold">
            {link.label}
            <ArrowUpRight className="size-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}
