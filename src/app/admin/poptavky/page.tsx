import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { SHOOT_TYPES, INQUIRY_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const supabase = await createClient();

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Poptávky</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jméno</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Stav</TableHead>
            <TableHead>Přijato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(inquiries ?? []).map((inquiry) => {
            const shootLabel =
              SHOOT_TYPES.find((t) => t.value === inquiry.shoot_type)?.label ??
              inquiry.shoot_type;
            const statusInfo =
              INQUIRY_STATUSES.find((s) => s.value === inquiry.status);

            return (
              <TableRow key={inquiry.id}>
                <TableCell className="font-medium">{inquiry.name}</TableCell>
                <TableCell>{inquiry.email}</TableCell>
                <TableCell>{shootLabel}</TableCell>
                <TableCell>{inquiry.preferred_date ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{statusInfo?.label ?? inquiry.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(inquiry.created_at).toLocaleDateString("cs")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {(!inquiries || inquiries.length === 0) && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádné poptávky.
        </p>
      )}
    </div>
  );
}
