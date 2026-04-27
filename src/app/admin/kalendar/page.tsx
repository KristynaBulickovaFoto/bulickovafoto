"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AdminCalendar } from "@/components/admin/AdminCalendar";
import type { Tables } from "@/lib/supabase/types";

export default function AdminCalendarPage() {
  const [bookedDates, setBookedDates] = useState<Tables<"booked_dates">[] | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("booked_dates")
      .select("*")
      .order("date")
      .then(({ data }) => setBookedDates(data ?? []));
  }, []);

  if (bookedDates === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kalendář</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Klikněte na den pro přidání nebo úpravu obsazení
        </p>
      </div>
      <AdminCalendar initialDates={bookedDates} />
    </div>
  );
}
