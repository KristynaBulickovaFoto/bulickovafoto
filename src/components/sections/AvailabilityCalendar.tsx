"use client";

import { useMemo, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  addMonths,
  isBefore,
  startOfDay,
} from "date-fns";
import { cs } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BookedDate = {
  date: string;
  label: string | null;
  is_confirmed: boolean;
};

type AvailabilityCalendarProps = {
  bookedDates: BookedDate[];
  monthsToShow?: number;
};

const DAY_NAMES = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

export function AvailabilityCalendar({
  bookedDates,
  monthsToShow = 3,
}: AvailabilityCalendarProps) {
  const [offset, setOffset] = useState(0);

  const dateMap = useMemo(() => {
    return new Map(bookedDates.map((d) => [d.date, d]));
  }, [bookedDates]);

  const today = startOfDay(new Date());

  const months = useMemo(() => {
    const base = addMonths(new Date(), offset);
    return Array.from({ length: monthsToShow }, (_, i) => addMonths(base, i));
  }, [monthsToShow, offset]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Kdy mám volno
        </h2>
        <p className="mt-3 text-muted-foreground">
          Zelené dny jsou volné — vyberte si termín a ozvěte se mi
        </p>
      </div>

      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setOffset((o) => Math.max(o - 1, 0))}
          disabled={offset === 0}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-muted-foreground capitalize">
          {format(months[0], "LLLL", { locale: cs })} — {format(months[months.length - 1], "LLLL yyyy", { locale: cs })}
        </span>
        <button
          type="button"
          onClick={() => setOffset((o) => o + 1)}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((month) => {
          const start = startOfMonth(month);
          const end = endOfMonth(month);
          const days = eachDayOfInterval({ start, end });
          const startDay = (getDay(start) + 6) % 7;

          return (
            <div
              key={month.toISOString()}
              className="rounded-2xl border border-border/30 bg-card p-4 shadow-[0_1px_8px_-2px_rgba(0,0,0,0.04)] sm:p-5"
            >
              <h3 className="mb-3 text-center text-sm font-semibold capitalize">
                {format(month, "LLLL yyyy", { locale: cs })}
              </h3>

              <div className="grid grid-cols-7 gap-1">
                {DAY_NAMES.map((day) => (
                  <div
                    key={day}
                    className="pb-1 text-center text-[10px] font-semibold text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const entry = dateMap.get(dateStr);
                  const isPast = isBefore(day, today);

                  return (
                    <div
                      key={dateStr}
                      className={cn(
                        "relative flex h-8 items-center justify-center rounded-lg text-xs transition-colors",
                        isPast && "opacity-25",
                        isToday(day) && !entry && "font-bold text-foreground ring-1 ring-foreground/20",
                        entry && entry.is_confirmed && "bg-emerald-100 font-semibold text-emerald-700",
                        entry && !entry.is_confirmed && "bg-emerald-50 font-medium text-emerald-600/70",
                        !entry && !isPast && "text-muted-foreground"
                      )}
                    >
                      {format(day, "d")}
                      {entry && entry.is_confirmed && (
                        <Check className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 text-emerald-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-emerald-100" />
          <span>Volný termín</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-emerald-50 ring-1 ring-emerald-200" />
          <span>Možná volný</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border border-border" />
          <span>Neoznačeno</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
        >
          Chci se domluvit na termínu
        </Link>
      </div>
    </section>
  );
}
