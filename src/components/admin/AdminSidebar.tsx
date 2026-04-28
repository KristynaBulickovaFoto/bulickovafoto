"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Users,
  MessageSquare,
  FileText,
  Package,
  Star,
  CalendarDays,
  Settings,
  ArrowLeft,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminCounts = {
  newInquiries: number;
  needsReply: number;
  clients: number;
  freeDates: number;
  portfolio: number;
  blogDrafts: number;
  services: number;
  testimonials: number;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  count?: number;
  badgeTone?: "default" | "warn";
};

const SECTION_TITLES = ["Workflow", "Obsah", "Konfigurace"] as const;

function buildSections(counts: AdminCounts): {
  title: (typeof SECTION_TITLES)[number];
  items: NavItem[];
}[] {
  return [
    {
      title: "Workflow",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        {
          label: "Poptávky",
          href: "/admin/poptavky",
          icon: MessageSquare,
          count: counts.newInquiries || undefined,
          badgeTone: counts.newInquiries > 0 ? "warn" : "default",
        },
        {
          label: "Klienti",
          href: "/admin/klienti",
          icon: Users,
          count: counts.clients || undefined,
        },
        {
          label: "Kalendář",
          href: "/admin/kalendar",
          icon: CalendarDays,
          count: counts.freeDates || undefined,
        },
      ],
    },
    {
      title: "Obsah",
      items: [
        {
          label: "Portfolio",
          href: "/admin/portfolio",
          icon: Images,
          count: counts.portfolio || undefined,
        },
        {
          label: "Blog",
          href: "/admin/blog",
          icon: FileText,
          count: counts.blogDrafts || undefined,
          badgeTone: "warn",
        },
        {
          label: "Služby",
          href: "/admin/sluzby",
          icon: Package,
          count: counts.services || undefined,
        },
        {
          label: "Reference",
          href: "/admin/reference",
          icon: Star,
          count: counts.testimonials || undefined,
        },
      ],
    },
    {
      title: "Konfigurace",
      items: [{ label: "Nastavení", href: "/admin/nastaveni", icon: Settings }],
    },
  ];
}

const QUICK_ADD = [
  { label: "Galerie portfolia", href: "/admin/portfolio" },
  { label: "Blog článek", href: "/admin/blog" },
  { label: "Služba", href: "/admin/sluzby" },
  { label: "Reference", href: "/admin/reference" },
  { label: "Volný termín", href: "/admin/kalendar" },
];

export function AdminSidebar({ counts }: { counts: AdminCounts }) {
  const pathname = usePathname();
  const sections = buildSections(counts);

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center justify-between gap-2 px-5 py-4">
        <Link href="/admin" className="text-lg font-bold tracking-tight">
          <span className="text-sidebar-foreground">Kristýna</span>
          <span className="text-sidebar-primary">Foto</span>
        </Link>
        <span className="rounded-md bg-sidebar-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-primary">
          Admin
        </span>
      </div>

      {/* Quick add */}
      <div className="px-3 pb-3">
        <details className="group rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-medium text-sidebar-foreground/80 marker:hidden">
            <Plus className="h-3.5 w-3.5" />
            Rychle přidat
          </summary>
          <div className="border-t border-sidebar-border/60 p-1">
            {QUICK_ADD.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="block rounded-md px-2 py-1.5 text-xs text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                + {q.label}
              </Link>
            ))}
          </div>
        </details>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.count !== undefined && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                          item.badgeTone === "warn"
                            ? "bg-pink-500 text-white"
                            : "bg-sidebar-foreground/10 text-sidebar-foreground/70",
                        )}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border/60 px-3 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Zpět na web
        </Link>
      </div>
    </aside>
  );
}
