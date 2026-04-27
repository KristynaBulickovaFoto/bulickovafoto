"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  addMonths,
  subMonths,
  addDays,
  isBefore,
  isSameMonth,
  startOfDay,
} from "date-fns";
import { cs } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  Check,
  CalendarDays,
  Sparkles,
  Eraser,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

const DAY_NAMES = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

type BookedDate = Tables<"booked_dates">;

type Props = {
  initialDates: BookedDate[];
};

function parseDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00");
}

function rangeBetween(a: string, b: string) {
  const start = a < b ? a : b;
  const end = a < b ? b : a;
  const out: string[] = [];
  let d = parseDate(start);
  const last = parseDate(end);
  while (d <= last) {
    out.push(format(d, "yyyy-MM-dd"));
    d = addDays(d, 1);
  }
  return out;
}

export function AdminCalendar({ initialDates }: Props) {
  const [availableDates, setAvailableDates] = useState(initialDates);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Drag-paint state
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragCurrent, setDragCurrent] = useState<string | null>(null);
  const dragModeRef = useRef<"add" | "add-maybe" | "remove" | null>(null);
  const [dragModeUi, setDragModeUi] = useState<"add" | "add-maybe" | "remove" | null>(null);

  const supabase = createClient();

  const dateMap = useMemo(() => {
    const map = new Map<string, BookedDate>();
    availableDates.forEach((d) => map.set(d.date, d));
    return map;
  }, [availableDates]);

  const today = startOfDay(new Date());

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const startDay = (getDay(start) + 6) % 7;

  const dragRange = useMemo(() => {
    if (!dragStart || !dragCurrent) return new Set<string>();
    return new Set(rangeBetween(dragStart, dragCurrent));
  }, [dragStart, dragCurrent]);

  // Apply drag on mouseup anywhere on window
  useEffect(() => {
    if (!dragStart) return;

    const handleUp = () => {
      const startVal = dragStart;
      const currentVal = dragCurrent ?? dragStart;
      const mode = dragModeRef.current;
      setDragStart(null);
      setDragCurrent(null);
      dragModeRef.current = null;
      setDragModeUi(null);

      if (!mode) return;

      const dates = rangeBetween(startVal, currentVal).filter(
        (d) => !isBefore(parseDate(d), today),
      );

      if (dates.length === 0) return;

      // Single cell, no movement → just select (open panel)
      if (dates.length === 1 && startVal === currentVal) {
        const only = dates[0];
        const existing = dateMap.get(only);
        setSelectedDate(only);
        setLabel(existing?.label ?? "");
        return;
      }

      if (mode === "add") {
        void bulkAdd(dates, true);
      } else if (mode === "add-maybe") {
        void bulkAdd(dates, false);
      } else {
        void bulkRemove(dates);
      }
    };

    window.addEventListener("mouseup", handleUp);
    return () => window.removeEventListener("mouseup", handleUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragStart, dragCurrent]);

  function handleMouseDown(dateStr: string, day: Date, shiftKey: boolean) {
    if (isBefore(day, today)) return;
    const existing = dateMap.get(dateStr);
    const mode: "add" | "add-maybe" | "remove" = existing
      ? "remove"
      : shiftKey
      ? "add-maybe"
      : "add";
    dragModeRef.current = mode;
    setDragModeUi(mode);
    setDragStart(dateStr);
    setDragCurrent(dateStr);
  }

  function handleMouseEnter(dateStr: string, day: Date) {
    if (!dragStart) return;
    if (isBefore(day, today)) return;
    setDragCurrent(dateStr);
  }

  async function bulkAdd(dates: string[], confirmed: boolean) {
    const toInsert = dates.filter((d) => !dateMap.has(d));
    if (toInsert.length === 0) return;

    const tempPrefix = `temp-${Date.now()}-`;
    const optimistic: BookedDate[] = toInsert.map((d, i) => ({
      id: `${tempPrefix}${i}`,
      date: d,
      inquiry_id: null,
      label: null,
      is_confirmed: confirmed,
      created_at: new Date().toISOString(),
    }));

    setAvailableDates((prev) =>
      [...prev, ...optimistic].sort((a, b) => a.date.localeCompare(b.date)),
    );

    const { data, error } = await supabase
      .from("booked_dates")
      .insert(toInsert.map((d) => ({ date: d, label: null, is_confirmed: confirmed })))
      .select();

    if (error || !data) {
      setAvailableDates((prev) => prev.filter((d) => !d.id.startsWith(tempPrefix)));
      toast.error("Nepodařilo se přidat termíny.");
      return;
    }

    setAvailableDates((prev) =>
      [...prev.filter((d) => !d.id.startsWith(tempPrefix)), ...data].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    );

    const insertedIds = data.map((d) => d.id);
    const kind = confirmed ? "volných" : "možných";
    toast.success(
      `Přidáno ${data.length} ${kind} ${plural(data.length, "termín", "termíny", "termínů")}`,
      {
        action: {
          label: "Zpět",
          onClick: () => undoAdd(insertedIds),
        },
      },
    );
  }

  async function bulkRemove(dates: string[]) {
    const toRemove = dates
      .map((d) => dateMap.get(d))
      .filter((d): d is BookedDate => Boolean(d));
    if (toRemove.length === 0) return;

    const ids = toRemove.map((d) => d.id);
    setAvailableDates((prev) => prev.filter((d) => !ids.includes(d.id)));
    if (selectedDate && dates.includes(selectedDate)) setSelectedDate(null);

    const { error } = await supabase.from("booked_dates").delete().in("id", ids);

    if (error) {
      setAvailableDates((prev) =>
        [...prev, ...toRemove].sort((a, b) => a.date.localeCompare(b.date)),
      );
      toast.error("Nepodařilo se odebrat termíny.");
      return;
    }

    toast.success(`Odebráno ${ids.length} ${plural(ids.length, "termín", "termíny", "termínů")}`, {
      action: {
        label: "Zpět",
        onClick: () => undoRemove(toRemove),
      },
    });
  }

  async function undoAdd(ids: string[]) {
    const removed = availableDates.filter((d) => ids.includes(d.id));
    setAvailableDates((prev) => prev.filter((d) => !ids.includes(d.id)));
    const { error } = await supabase.from("booked_dates").delete().in("id", ids);
    if (error) {
      setAvailableDates((prev) =>
        [...prev, ...removed].sort((a, b) => a.date.localeCompare(b.date)),
      );
      toast.error("Zpět se nezdařilo.");
    }
  }

  async function undoRemove(items: BookedDate[]) {
    setAvailableDates((prev) =>
      [...prev, ...items].sort((a, b) => a.date.localeCompare(b.date)),
    );
    const { data, error } = await supabase
      .from("booked_dates")
      .insert(
        items.map((d) => ({
          date: d.date,
          label: d.label,
          is_confirmed: d.is_confirmed,
          inquiry_id: d.inquiry_id,
        })),
      )
      .select();
    if (error || !data) {
      const oldIds = items.map((d) => d.id);
      setAvailableDates((prev) => prev.filter((d) => !oldIds.includes(d.id)));
      toast.error("Zpět se nezdařilo.");
      return;
    }
    const oldIds = items.map((d) => d.id);
    setAvailableDates((prev) =>
      [...prev.filter((d) => !oldIds.includes(d.id)), ...data].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    );
  }

  async function handleSave() {
    if (!selectedDate) return;
    const existing = dateMap.get(selectedDate);
    if (!existing) {
      void handleAddDirect(true);
      return;
    }

    setIsSaving(true);
    const prevLabel = existing.label;
    setAvailableDates((prev) =>
      prev.map((d) => (d.id === existing.id ? { ...d, label: label || null } : d)),
    );

    const { error } = await supabase
      .from("booked_dates")
      .update({ label: label || null })
      .eq("id", existing.id);

    if (error) {
      setAvailableDates((prev) =>
        prev.map((d) => (d.id === existing.id ? { ...d, label: prevLabel } : d)),
      );
      toast.error("Nepodařilo se uložit.");
    } else {
      toast.success("Uloženo.");
      setSelectedDate(null);
    }
    setIsSaving(false);
  }

  async function handleAddDirect(confirmed: boolean) {
    if (!selectedDate) return;
    setIsSaving(true);
    const { data, error } = await supabase
      .from("booked_dates")
      .insert({ date: selectedDate, label: label || null, is_confirmed: confirmed })
      .select()
      .single();

    if (error) {
      toast.error("Nepodařilo se přidat.");
    } else if (data) {
      setAvailableDates((prev) =>
        [...prev, data].sort((a, b) => a.date.localeCompare(b.date)),
      );
      toast.success(confirmed ? "Volný termín přidán!" : "Možná volný přidán!");
      setSelectedDate(null);
    }
    setIsSaving(false);
  }

  async function handleDelete() {
    if (!selectedDate) return;
    const existing = dateMap.get(selectedDate);
    if (!existing) return;

    setAvailableDates((prev) => prev.filter((d) => d.id !== existing.id));
    setSelectedDate(null);

    const { error } = await supabase
      .from("booked_dates")
      .delete()
      .eq("id", existing.id);

    if (error) {
      setAvailableDates((prev) =>
        [...prev, existing].sort((a, b) => a.date.localeCompare(b.date)),
      );
      toast.error("Nepodařilo se smazat.");
      return;
    }

    toast.success("Termín odebrán.", {
      action: {
        label: "Zpět",
        onClick: () => undoRemove([existing]),
      },
    });
  }

  async function toggleConfirmed() {
    if (!selectedDate) return;
    const existing = dateMap.get(selectedDate);
    if (!existing) return;

    const newVal = !existing.is_confirmed;
    setAvailableDates((prev) =>
      prev.map((d) => (d.id === existing.id ? { ...d, is_confirmed: newVal } : d)),
    );

    const { error } = await supabase
      .from("booked_dates")
      .update({ is_confirmed: newVal })
      .eq("id", existing.id);

    if (error) {
      setAvailableDates((prev) =>
        prev.map((d) => (d.id === existing.id ? { ...d, is_confirmed: !newVal } : d)),
      );
      toast.error("Změna se nezdařila.");
    }
  }

  const selectedEntry = selectedDate ? dateMap.get(selectedDate) : null;

  const monthCount = useMemo(
    () =>
      availableDates.filter((d) => isSameMonth(parseDate(d.date), currentMonth)).length,
    [availableDates, currentMonth],
  );

  const showingToday = isSameMonth(currentMonth, today);

  async function quickAddWeekdays(weekdays: number[]) {
    const dates = days
      .filter((d) => !isBefore(d, today))
      .filter((d) => weekdays.includes(getDay(d)))
      .map((d) => format(d, "yyyy-MM-dd"));
    if (dates.length === 0) {
      toast.info("V tomto měsíci už nejsou žádné takové dny.");
      return;
    }
    await bulkAdd(dates, true);
  }

  async function clearMonth() {
    const monthDates = availableDates.filter(
      (d) =>
        isSameMonth(parseDate(d.date), currentMonth) &&
        !isBefore(parseDate(d.date), today),
    );
    if (monthDates.length === 0) {
      toast.info("Žádné termíny k odebrání.");
      return;
    }
    if (!confirm(`Odebrat ${monthDates.length} termínů z tohoto měsíce?`)) return;
    await bulkRemove(monthDates.map((d) => d.date));
  }

  const monthOptions = useMemo(() => {
    const out: { value: string; label: string }[] = [];
    for (let i = -1; i < 24; i++) {
      const m = addMonths(today, i);
      out.push({
        value: format(m, "yyyy-MM"),
        label: format(m, "LLLL yyyy", { locale: cs }),
      });
    }
    return out;
  }, [today]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Calendar */}
      <div
        className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm sm:p-6"
        onMouseLeave={() => {
          // Cancel paint if mouse leaves grid mid-drag without releasing
          if (dragStart) setDragCurrent(dragStart);
        }}
      >
        {/* Month navigation */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-1 flex-col items-center gap-1">
            <Select
              value={format(currentMonth, "yyyy-MM")}
              onValueChange={(v) => {
                if (!v) return;
                const [y, m] = v.split("-").map(Number);
                setCurrentMonth(new Date(y, m - 1, 1));
              }}
            >
              <SelectTrigger className="h-8 w-auto gap-2 border-none bg-transparent px-3 text-base font-semibold capitalize hover:bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="capitalize">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {monthCount > 0 && (
              <p className="text-[11px] text-muted-foreground">
                {monthCount} {plural(monthCount, "volný termín", "volné termíny", "volných termínů")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!showingToday && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setCurrentMonth(new Date())}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Dnes
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-[11px]"
            onClick={() => quickAddWeekdays([6])}
          >
            <Sparkles className="h-3 w-3" />
            Soboty volné
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-[11px]"
            onClick={() => quickAddWeekdays([0, 6])}
          >
            <Sparkles className="h-3 w-3" />
            Víkendy volné
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-[11px]"
            onClick={() => quickAddWeekdays([1, 2, 3, 4, 5])}
          >
            <Sparkles className="h-3 w-3" />
            Všední dny
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-[11px] text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={clearMonth}
          >
            <Eraser className="h-3 w-3" />
            Vyčistit měsíc
          </Button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 select-none">
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="pb-2 text-center text-xs font-semibold text-muted-foreground"
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
            const isSelected = selectedDate === dateStr;
            const inDrag = dragRange.has(dateStr);
            const dragMode = dragModeUi;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleMouseDown(dateStr, day, e.shiftKey);
                }}
                onMouseEnter={() => handleMouseEnter(dateStr, day)}
                className={cn(
                  "relative flex h-11 flex-col items-center justify-center rounded-xl text-sm transition-all sm:h-14",
                  isPast && "cursor-default opacity-25",
                  !isPast && !entry && !isSelected && "hover:bg-muted text-muted-foreground",
                  isSelected && "ring-2 ring-primary ring-offset-2",
                  entry && entry.is_confirmed && "bg-emerald-100 font-semibold text-emerald-700",
                  entry && !entry.is_confirmed && "bg-amber-100 font-semibold text-amber-600",
                  isToday(day) && !entry && "font-bold text-foreground",
                  inDrag && dragMode === "add" && "ring-2 ring-emerald-400 ring-offset-1 bg-emerald-50",
                  inDrag && dragMode === "add-maybe" && "ring-2 ring-amber-400 ring-offset-1 bg-amber-50",
                  inDrag && dragMode === "remove" && "ring-2 ring-rose-400 ring-offset-1 opacity-60",
                )}
              >
                <span>{format(day, "d")}</span>
                {entry && (
                  <Check
                    className={cn(
                      "absolute bottom-0.5 h-2.5 w-2.5 sm:bottom-1 sm:h-3 sm:w-3",
                      entry.is_confirmed ? "text-emerald-600" : "text-amber-500",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-emerald-100" />
            Volný termín
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-amber-100" />
            Možná volný
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border border-border bg-muted/30" />
            Neoznačeno
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] text-muted-foreground/60">
          Klik = vybrat &middot; Tah = volný &middot; Shift+tah = možná &middot; Tah na zelený = odebrat
        </p>
      </div>

      {/* Side panel */}
      <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
        {selectedDate ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Vybraný den
              </p>
              <p className="mt-1 text-xl font-bold">
                {format(parseDate(selectedDate), "d. MMMM yyyy", {
                  locale: cs,
                })}
              </p>
              {selectedEntry ? (
                <Badge
                  variant="secondary"
                  className={cn(
                    "mt-2 cursor-pointer",
                    selectedEntry.is_confirmed
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200",
                  )}
                  onClick={toggleConfirmed}
                >
                  {selectedEntry.is_confirmed ? "Volný" : "Možná volný"}
                </Badge>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Zatím neoznačený — přidejte jako volný termín
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-label">Poznámka</Label>
              <Input
                id="date-label"
                placeholder="např. celý den, od 14h..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleSave();
                }}
              />
            </div>

            {selectedEntry ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Uložit
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleAddDirect(true)}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Volný
                </Button>
                <Button
                  onClick={() => handleAddDirect(false)}
                  disabled={isSaving}
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                >
                  Možná volný
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => setSelectedDate(null)}
            >
              Zrušit výběr
            </Button>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <Check className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
              Označte volné termíny
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Klikněte na den nebo táhněte přes více dnů.
            </p>
          </div>
        )}

        {/* Upcoming available dates */}
        {availableDates.filter((d) => !isBefore(parseDate(d.date), today)).length > 0 && (
          <>
            <div className="my-4 h-px bg-border/40" />
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Volné termíny (
                {availableDates.filter((d) => !isBefore(parseDate(d.date), today)).length}
                )
              </p>
              <ul className="max-h-[280px] space-y-1.5 overflow-y-auto">
                {availableDates
                  .filter((d) => !isBefore(parseDate(d.date), today))
                  .map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate(d.date);
                          setLabel(d.label ?? "");
                          setCurrentMonth(parseDate(d.date));
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                          selectedDate === d.date && "bg-muted",
                        )}
                      >
                        <span
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full",
                            d.is_confirmed ? "bg-emerald-500" : "bg-amber-500",
                          )}
                        />
                        <span className="flex-1 truncate font-medium">
                          {format(parseDate(d.date), "d. M.", {
                            locale: cs,
                          })}
                          {d.label && (
                            <span className="ml-1.5 font-normal text-muted-foreground">
                              {d.label}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}
