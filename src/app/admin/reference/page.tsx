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

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reference</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Autor</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Obsah</TableHead>
            <TableHead>Stav</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(testimonials ?? []).map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.author_name}</TableCell>
              <TableCell>{t.author_role ?? "—"}</TableCell>
              <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                {t.content}
              </TableCell>
              <TableCell>
                <Badge variant={t.is_published ? "default" : "secondary"}>
                  {t.is_published ? "Publikováno" : "Skryto"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(!testimonials || testimonials.length === 0) && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádné reference.
        </p>
      )}
    </div>
  );
}
