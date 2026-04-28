"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  LogOut,
  ExternalLink,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/auth";
import { CommandPalette, type SearchItem } from "./CommandPalette";

export type ActivityItem = {
  id: string;
  type: "inquiry" | "gallery" | "blog" | "booking";
  title: string;
  subtitle?: string;
  href: string;
  timestamp: string;
  isUrgent?: boolean;
};

type Props = {
  profile: { full_name: string; email: string; avatar_url: string | null };
  activity: ActivityItem[];
  searchData: SearchItem[];
};

const TITLE_MAP: { test: RegExp; label: string }[] = [
  { test: /^\/admin$/, label: "Dashboard" },
  { test: /^\/admin\/poptavky/, label: "Poptávky" },
  { test: /^\/admin\/klienti(\/.+)?/, label: "Klienti" },
  { test: /^\/admin\/portfolio(\/.+)?/, label: "Portfolio" },
  { test: /^\/admin\/blog(\/.+)?/, label: "Blog" },
  { test: /^\/admin\/sluzby(\/.+)?/, label: "Služby" },
  { test: /^\/admin\/reference(\/.+)?/, label: "Reference" },
  { test: /^\/admin\/kalendar/, label: "Kalendář" },
  { test: /^\/admin\/nastaveni/, label: "Nastavení" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AdminTopbar({ profile, activity, searchData }: Props) {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const title = TITLE_MAP.find((t) => t.test.test(pathname))?.label ?? "Admin";

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  const urgentCount = activity.filter((a) => a.isUrgent).length;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/60 sm:px-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Admin</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
          <span className="font-semibold">{title}</span>
        </div>

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="ml-auto flex w-full max-w-xs items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/60 sm:max-w-sm"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Hledat všude...</span>
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
            {isMac ? "⌘" : "Ctrl"}+K
          </kbd>
        </button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {urgentCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] font-bold text-white">
                    {urgentCount}
                  </span>
                )}
              </Button>
            }
          />
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nedávno
              </p>
              {urgentCount > 0 && (
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-medium text-pink-700">
                  {urgentCount} potřebuje pozornost
                </span>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {activity.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted-foreground">
                  Žádná nová aktivita
                </p>
              ) : (
                activity.slice(0, 8).map((a) => (
                  <Link
                    key={a.id}
                    href={a.href}
                    className="block border-b border-border/40 px-3 py-2 text-xs transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <div className="flex items-start gap-2">
                      {a.isUrgent && (
                        <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-pink-500" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{a.title}</p>
                        {a.subtitle && (
                          <p className="truncate text-muted-foreground">
                            {a.subtitle}
                          </p>
                        )}
                        <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                          {formatDistanceToNow(new Date(a.timestamp), {
                            addSuffix: true,
                            locale: cs,
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-border bg-background px-1 py-1 transition-colors hover:bg-muted"
              >
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-100 text-[11px] font-bold text-pink-700">
                    {getInitials(profile.full_name)}
                  </span>
                )}
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{profile.full_name}</span>
                  <span className="truncate text-[11px] font-normal text-muted-foreground">
                    {profile.email}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/admin/nastaveni" />}>
              Nastavení
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/" />}>
              <ExternalLink className="h-3.5 w-3.5" />
              Zobrazit web
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Odhlásit se
                  </button>
                </form>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        items={searchData}
      />
    </>
  );
}
