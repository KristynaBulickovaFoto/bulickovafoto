import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvailabilityCalendar } from "@/components/sections/AvailabilityCalendar";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const supabase = await createClient();

  const { data: bookedDates } = await supabase
    .from("booked_dates")
    .select("*")
    .order("date");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kalendář dostupnosti</h1>

      <AvailabilityCalendar
        bookedDates={bookedDates ?? []}
        monthsToShow={4}
      />

      <h2 className="text-xl font-bold">Obsazené termíny</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead>Popis</TableHead>
            <TableHead>Potvrzeno</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(bookedDates ?? []).map((date) => (
            <TableRow key={date.id}>
              <TableCell className="font-medium">{date.date}</TableCell>
              <TableCell>{date.label ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={date.is_confirmed ? "default" : "secondary"}>
                  {date.is_confirmed ? "Potvrzeno" : "Předběžně"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(!bookedDates || bookedDates.length === 0) && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádné obsazené termíny.
        </p>
      )}
    </div>
  );
}
