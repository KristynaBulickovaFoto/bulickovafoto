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

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Služby a ceny</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Název</TableHead>
            <TableHead>Cena</TableHead>
            <TableHead>Stav</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(services ?? []).map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.title}</TableCell>
              <TableCell>{service.price_text ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={service.is_published ? "default" : "secondary"}>
                  {service.is_published ? "Publikováno" : "Skryto"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(!services || services.length === 0) && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádné služby.
        </p>
      )}
    </div>
  );
}
