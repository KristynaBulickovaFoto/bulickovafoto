"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MessageSquare,
  Users,
  Images,
  FileText,
  Package,
  CalendarDays,
  LayoutDashboard,
  Star,
  Settings,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type SearchItem = {
  type: "inquiry" | "client" | "portfolio" | "blog" | "service";
  id: string;
  title: string;
  subtitle?: string;
  href: string;
};

const TYPE_META: Record<
  SearchItem["type"],
  { label: string; icon: LucideIcon }
> = {
  inquiry: { label: "Poptávka", icon: MessageSquare },
  client: { label: "Klient", icon: Users },
  portfolio: { label: "Portfolio", icon: Images },
  blog: { label: "Blog", icon: FileText },
  service: { label: "Služba", icon: Package },
};

type JumpItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  hint?: string;
};

const JUMP_ITEMS: JumpItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Poptávky", href: "/admin/poptavky", icon: MessageSquare },
  { label: "Klienti", href: "/admin/klienti", icon: Users },
  { label: "Kalendář", href: "/admin/kalendar", icon: CalendarDays },
  { label: "Portfolio", href: "/admin/portfolio", icon: Images },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Služby", href: "/admin/sluzby", icon: Package },
  { label: "Reference", href: "/admin/reference", icon: Star },
  { label: "Nastavení", href: "/admin/nastaveni", icon: Settings },
];

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: SearchItem[];
};

export function CommandPalette({ open, onOpenChange, items }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const q = query.trim().toLowerCase();

  const matchedJumps = useMemo(() => {
    if (!q) return JUMP_ITEMS;
    return JUMP_ITEMS.filter((j) => j.label.toLowerCase().includes(q));
  }, [q]);

  const matchedItems = useMemo(() => {
    if (!q) return items.slice(0, 12);
    return items
      .filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle?.toLowerCase().includes(q),
      )
      .slice(0, 30);
  }, [q, items]);

  const flatList = useMemo(
    () => [
      ...matchedJumps.map((j) => ({ kind: "jump" as const, data: j })),
      ...matchedItems.map((i) => ({ kind: "item" as const, data: i })),
    ],
    [matchedJumps, matchedItems],
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = flatList[activeIndex];
      if (target) go(target.data.href);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="top-[20%] max-w-xl translate-y-0 gap-0 p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Hledat</DialogTitle>
        <DialogDescription className="sr-only">
          Hledejte stránky, poptávky, klienty, portfolio, blog
        </DialogDescription>
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Hledat stránky, poptávky, klienty, články..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            esc
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-1.5">
          {matchedJumps.length > 0 && (
            <div className="mb-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Stránky
              </p>
              {matchedJumps.map((j, idx) => {
                const Icon = j.icon;
                const flatIdx = idx;
                return (
                  <button
                    key={j.href}
                    type="button"
                    onClick={() => go(j.href)}
                    onMouseEnter={() => setActiveIndex(flatIdx)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors",
                      flatIdx === activeIndex && "bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 font-medium">{j.label}</span>
                    {flatIdx === activeIndex && (
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {matchedItems.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Záznamy
              </p>
              {matchedItems.map((item, idx) => {
                const meta = TYPE_META[item.type];
                const Icon = meta.icon;
                const flatIdx = matchedJumps.length + idx;
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onClick={() => go(item.href)}
                    onMouseEnter={() => setActiveIndex(flatIdx)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors",
                      flatIdx === activeIndex && "bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.title}</p>
                      {item.subtitle && (
                        <p className="truncate text-[11px] text-muted-foreground">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {flatList.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nic nenalezeno pro „{query}"
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-3 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono">↑↓</kbd>
            navigace
          </span>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono">↵</kbd>
            otevřít
          </span>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono">⌘K</kbd>
            přepnout
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
