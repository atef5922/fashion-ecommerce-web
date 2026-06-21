"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/navigation";

export function MegaMenu({
  item,
  isOpen,
  onOpen,
  onClose,
  onNavigate
}: {
  item: NavItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const columns = item.columns ?? [];

  return (
    <div className="group static" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "fine-label relative py-3 text-luxury-ink/78 transition hover:text-luxury-ink after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-luxury-burgundy after:transition dark:text-luxury-dark-text dark:hover:text-luxury-gold dark:after:bg-luxury-gold",
          isOpen && "after:scale-x-100"
        )}
      >
        {item.label}
      </Link>

      <div
        className={cn(
          "absolute inset-x-0 top-full z-[90] transition duration-300",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="luxury-container pt-4">
          <div
            className={cn(
              "overflow-hidden border border-black/10 bg-white shadow-[0_30px_80px_rgba(17,17,17,0.14)] transition duration-300 dark:border-luxury-dark-border dark:bg-luxury-dark-card dark:shadow-[0_32px_90px_rgba(0,0,0,0.46)]",
              isOpen ? "translate-y-0" : "-translate-y-1"
            )}
          >
            <div className="grid min-h-[370px] grid-cols-[minmax(0,1fr)_280px]">
              <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(${Math.max(columns.length, 1)}, minmax(0, 1fr))` }}
              >
                {columns.map((column, index) => (
                  <div
                    key={`${item.label}-column-${index}`}
                    className="flex flex-col gap-8 px-8 py-8 first:pl-9 last:pr-9 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-black/10 dark:[&:not(:last-child)]:border-luxury-dark-border"
                  >
                    {column.sections.map((section) => (
                      <div key={section.heading}>
                        <Link
                          href={section.links?.[0]?.href ?? item.href}
                          onClick={onNavigate}
                          className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-luxury-ink dark:text-luxury-dark-text"
                        >
                          {section.heading}
                        </Link>
                        {section.links?.length ? (
                          <div className="mt-4 grid gap-3">
                            {section.links.map((link) => (
                              <Link
                                key={link.label}
                                href={link.href}
                                onClick={onNavigate}
                                className="text-[0.95rem] text-luxury-ink/74 transition hover:translate-x-1 hover:text-luxury-burgundy dark:text-luxury-dark-secondary dark:hover:text-luxury-gold"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {item.featured ? (
                <div className="border-l border-black/10 bg-[#faf7f2] p-6 dark:border-luxury-dark-border dark:bg-luxury-dark-surface">
                  <Link href={item.featuredHref ?? item.href} onClick={onNavigate} className="group/feature flex h-full flex-col">
                    <div className="relative aspect-[5/6] overflow-hidden">
                      <Image
                        src={item.featured}
                        alt={item.label}
                        fill
                        sizes="280px"
                        className="object-cover transition duration-700 group-hover/feature:scale-105"
                      />
                    </div>
                    <div className="mt-5">
                      <p className="fine-label text-luxury-burgundy dark:text-luxury-gold">
                        {item.featuredLabel ?? item.label}
                      </p>
                      <h3 className="mt-3 font-display text-[1.9rem] font-semibold leading-[0.95] text-luxury-ink dark:text-luxury-dark-text">
                        {item.featuredTitle ?? item.label}
                      </h3>
                      <span className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-luxury-ink/62 transition group-hover/feature:text-luxury-burgundy dark:text-luxury-dark-secondary dark:group-hover/feature:text-luxury-gold">
                        Explore the edit
                      </span>
                    </div>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
