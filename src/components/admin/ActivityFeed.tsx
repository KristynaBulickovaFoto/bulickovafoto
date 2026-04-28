import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import {
  MessageSquare,
  Images,
  FileText,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FeedItem = {
  id: string;
  type: "inquiry" | "gallery" | "blog" | "booking";
  title: string;
  subtitle?: string;
  href: string;
  timestamp: string;
  isUrgent?: boolean;
};

const TYPE_ICON: Record<FeedItem["type"], LucideIcon> = {
  inquiry: MessageSquare,
  gallery: Images,
  blog: FileText,
  booking: CalendarDays,
};

const TYPE_TONE: Record<FeedItem["type"], string> = {
  inquiry: "bg-pink-100 text-pink-700",
  gallery: "bg-violet-100 text-violet-700",
  blog: "bg-indigo-100 text-indigo-700",
  booking: "bg-emerald-100 text-emerald-700",
};

export function ActivityFeed({ items }: { items: FeedItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        Žádná aktivita
      </p>
    );
  }

  return (
    <ol className="relative space-y-3">
      <span
        aria-hidden
        className="absolute left-[15px] top-2 bottom-2 w-px bg-border/50"
      />
      {items.map((item) => {
        const Icon = TYPE_ICON[item.type];
        return (
          <li key={item.id} className="relative">
            <Link
              href={item.href}
              className="flex gap-3 rounded-lg pr-2 transition-colors hover:bg-muted/40"
            >
              <span
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background",
                  TYPE_TONE[item.type],
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1 py-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  {item.isUrgent && (
                    <span className="shrink-0 rounded-full bg-pink-100 px-1.5 py-0.5 text-[9px] font-bold text-pink-700">
                      pozornost
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <p className="truncate text-[11px] text-muted-foreground">
                    {item.subtitle}
                  </p>
                )}
                <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                  {formatDistanceToNow(new Date(item.timestamp), {
                    addSuffix: true,
                    locale: cs,
                  })}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
