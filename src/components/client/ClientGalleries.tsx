"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { cs } from "date-fns/locale";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryLink = {
  id: string;
  label: string;
  url: string;
  type: string;
  sort_order: number;
};

type Gallery = {
  id: string;
  title: string;
  description: string | null;
  status: "active" | "archived";
  notified_at: string | null;
  created_at: string;
  client_gallery_links: GalleryLink[];
};

export function ClientGalleries({ galleries }: { galleries: Gallery[] }) {
  const [showArchive, setShowArchive] = useState(false);
  const [query, setQuery] = useState("");

  const active = useMemo(
    () => galleries.filter((g) => g.status === "active"),
    [galleries],
  );
  const archived = useMemo(
    () => galleries.filter((g) => g.status === "archived"),
    [galleries],
  );

  const showSearch = active.length > 5;

  const filtered = useMemo(() => {
    const list = showArchive ? archived : active;
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q),
    );
  }, [active, archived, showArchive, query]);

  if (active.length === 0 && archived.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/50 py-20 text-center">
        <p className="font-medium">Zatím žádné galerie</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Jakmile budou fotky připravené, objeví se tady.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat..."
            className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {query ? `Nic nenalezeno pro „${query}"` : "Žádné galerie"}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((g) => {
            const isNew =
              g.notified_at &&
              differenceInDays(new Date(), new Date(g.notified_at)) <= 3;
            const linkCount = g.client_gallery_links.length;
            return (
              <li key={g.id}>
                <Link
                  href={`/klient/galerie/${g.id}`}
                  className={cn(
                    "group flex h-full flex-col rounded-xl border border-border/40 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                    showArchive && "opacity-70",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display text-lg font-bold leading-tight group-hover:text-primary">
                      {g.title}
                    </h2>
                    {isNew && (
                      <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
                        Nové
                      </span>
                    )}
                  </div>
                  {g.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {g.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
                    <span>
                      {format(new Date(g.created_at), "d. M. yyyy", { locale: cs })}
                    </span>
                    <span className="flex items-center gap-2">
                      <span>
                        {linkCount}{" "}
                        {linkCount === 1
                          ? "odkaz"
                          : linkCount >= 2 && linkCount <= 4
                            ? "odkazy"
                            : "odkazů"}
                      </span>
                      <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {archived.length > 0 && (
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setShowArchive((s) => !s);
              setQuery("");
            }}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {showArchive
              ? `← Zpět na aktivní (${active.length})`
              : `Zobrazit archiv (${archived.length})`}
          </button>
        </div>
      )}
    </div>
  );
}
