"use client";

import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameMonth,
  isToday,
  addMonths,
} from "date-fns";
import { cs } from "date-fns/locale";
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
  const bookedSet = useMemo(() => {
    return new Set(bookedDates.map((d) => d.date));
  }, [bookedDates]);

  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: monthsToShow }, (_, i) => addMonths(now, i));
  }, [monthsToShow]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Dostupné termíny
        </h2>
        <p className="mt-3 text-muted-foreground">
          Podívejte se, kdy mám volno, a domluvme se na termínu
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((month) => {
          const start = startOfMonth(month);
          const end = endOfMonth(month);
          const days = eachDayOfInterval({ start, end });
          // Monday = 0, Sunday = 6 (Czech calendar starts with Monday)
          const startDay = (getDay(start) + 6) % 7;

          return (
            <div key={month.toISOString()} className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-center text-sm font-semibold capitalize">
                {format(month, "LLLL yyyy", { locale: cs })}
              </h3>

              <div className="grid grid-cols-7 gap-1">
                {DAY_NAMES.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const isBooked = bookedSet.has(dateStr);

                  return (
                    <div
                      key={dateStr}
                      className={cn(
                        "flex h-8 items-center justify-center rounded text-xs",
                        isToday(day) && "font-bold ring-2 ring-primary/30",
                        isBooked
                          ? "bg-primary/15 font-medium text-primary"
                          : isSameMonth(day, month)
                            ? "text-foreground"
                            : "text-muted-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-primary/15" />
          <span>Obsazeno</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border border-border" />
          <span>Volné</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/kontakt"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Chcete ověřit dostupnost? Napište mi →
        </Link>
      </div>
    </section>
  );
}
