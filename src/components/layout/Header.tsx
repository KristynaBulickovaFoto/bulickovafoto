"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { MobileNav } from "./MobileNav";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Kristýna Bulíčková Fotografka"
            width={180}
            height={90}
            className="h-12 w-auto md:h-[60px]"
            priority
          />
        </Link>

        {/* Desktop nav — Cormorant Garamond serif for editorial elegance */}
        <ul className="hidden items-center gap-0 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="group relative">
              {item.children ? (
                <>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-1.5 px-5 py-2 font-nav text-[13px] font-medium tracking-wide transition-colors duration-200 hover:text-primary",
                      pathname.startsWith(item.href)
                        ? "text-primary"
                        : "text-foreground/55"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                    {pathname.startsWith(item.href) && (
                      <span className="absolute bottom-0.5 left-5 right-5 h-[1.5px] rounded-full bg-primary/70" />
                    )}
                  </Link>
                  {/* Dropdown */}
                  <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-[220px] rounded-xl border border-border/30 bg-white/98 p-2 shadow-2xl backdrop-blur-xl">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block rounded-lg px-4 py-2.5 font-nav text-[13px] font-medium tracking-wide transition-colors hover:bg-primary/5 hover:text-primary",
                              pathname === child.href
                                ? "text-primary"
                                : "text-foreground/55"
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "relative px-5 py-2 font-nav text-[13px] font-medium tracking-wide transition-colors duration-200 hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-foreground/55"
                  )}
                >
                  {item.label}
                  {pathname === item.href && (
                    <span className="absolute bottom-0.5 left-5 right-5 h-[1.5px] rounded-full bg-primary/70" />
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* CTA + Portal + Mobile */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden font-nav text-[13px] font-medium tracking-wide text-foreground/55 transition-colors duration-200 hover:text-primary sm:inline-flex"
          >
            Portál
          </Link>
          <Link
            href="/kontakt"
            className="hidden rounded-full bg-primary px-6 py-2.5 font-nav text-xs font-semibold tracking-wide text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md sm:inline-flex"
          >
            Nezávazná poptávka
          </Link>
          <MobileNav />
        </div>
      </nav>

      {/* Subtle bottom separator line */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
    </header>
  );
}
