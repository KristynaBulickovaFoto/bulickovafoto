import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Klienti</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jméno</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Registrace</TableHead>
            <TableHead className="w-[100px]">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(clients ?? []).map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.full_name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone ?? "—"}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(client.created_at).toLocaleDateString("cs")}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" render={<Link href={`/admin/klienti/${client.id}`} />}>
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(!clients || clients.length === 0) && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádní klienti.
        </p>
      )}
    </div>
  );
}
