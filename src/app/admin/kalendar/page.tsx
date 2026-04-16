"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvailabilityCalendar } from "@/components/sections/AvailabilityCalendar";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

export default function AdminCalendarPage() {
  const [bookedDates, setBookedDates] = useState<Tables<"booked_dates">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // New date form
  const [newDate, setNewDate] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newConfirmed, setNewConfirmed] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const { data } = await supabase
      .from("booked_dates")
      .select("*")
      .order("date");
    setBookedDates(data ?? []);
    setIsLoading(false);
  }

  async function addDate() {
    if (!newDate) {
      toast.error("Vyberte datum.");
      return;
    }
    setIsAdding(true);
    const { data, error } = await supabase
      .from("booked_dates")
      .insert({
        date: newDate,
        label: newLabel || null,
        is_confirmed: newConfirmed,
      })
      .select()
      .single();

    if (error) {
      toast.error("Nepodařilo se přidat termín.");
    } else if (data) {
      setBookedDates((prev) =>
        [...prev, data].sort((a, b) => a.date.localeCompare(b.date))
      );
      setNewDate("");
      setNewLabel("");
      setNewConfirmed(true);
      toast.success("Termín přidán!");
    }
    setIsAdding(false);
  }

  async function deleteDate(id: string) {
    if (!confirm("Opravdu smazat tento termín?")) return;
    const { error } = await supabase
      .from("booked_dates")
      .delete()
      .eq("id", id);
    if (error) toast.error("Nepodařilo se smazat.");
    else {
      setBookedDates((prev) => prev.filter((d) => d.id !== id));
      toast.success("Termín smazán!");
    }
  }

  async function toggleConfirmed(id: string, current: boolean) {
    const { error } = await supabase
      .from("booked_dates")
      .update({ is_confirmed: !current })
      .eq("id", id);
    if (error) toast.error("Nepodařilo se změnit stav.");
    else {
      setBookedDates((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, is_confirmed: !current } : d
        )
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kalendář dostupnosti</h1>

      <AvailabilityCalendar bookedDates={bookedDates} monthsToShow={4} />

      {/* Add date form */}
      <Card>
        <CardHeader>
          <CardTitle>Přidat obsazený termín</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-date">Datum *</Label>
              <Input
                id="new-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="min-w-[200px] flex-1 space-y-2">
              <Label htmlFor="new-label">Popis</Label>
              <Input
                id="new-label"
                placeholder="např. Svatba Novákovi"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 pb-0.5">
              <Switch
                id="new-confirmed"
                checked={newConfirmed}
                onCheckedChange={setNewConfirmed}
              />
              <Label htmlFor="new-confirmed">Potvrzeno</Label>
            </div>
            <Button onClick={addDate} disabled={isAdding}>
              {isAdding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Přidat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <h2 className="text-xl font-bold">Obsazené termíny</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead>Popis</TableHead>
            <TableHead>Potvrzeno</TableHead>
            <TableHead className="w-[80px]">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookedDates.map((date) => (
            <TableRow key={date.id}>
              <TableCell className="font-medium">{date.date}</TableCell>
              <TableCell>{date.label ?? "—"}</TableCell>
              <TableCell>
                <Badge
                  variant={date.is_confirmed ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => toggleConfirmed(date.id, date.is_confirmed)}
                >
                  {date.is_confirmed ? "Potvrzeno" : "Předběžně"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deleteDate(date.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {bookedDates.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádné obsazené termíny.
        </p>
      )}
    </div>
  );
}
