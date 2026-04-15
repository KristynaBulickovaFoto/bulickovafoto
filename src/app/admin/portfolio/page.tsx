import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default async function AdminPortfolioPage() {
  const supabase = await createClient();

  const { data: galleries } = await supabase
    .from("portfolio_galleries")
    .select("*, portfolio_categories(title)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <Button render={<Link href="/admin/portfolio/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Nová galerie
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Název</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Stav</TableHead>
            <TableHead className="w-[100px]">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(galleries ?? []).map((gallery) => (
            <TableRow key={gallery.id}>
              <TableCell className="font-medium">{gallery.title}</TableCell>
              <TableCell>
                {(gallery.portfolio_categories as unknown as { title: string } | null)?.title ?? "—"}
              </TableCell>
              <TableCell>{gallery.date ?? "—"}</TableCell>
              <TableCell>
                <Badge
                  variant={gallery.is_published ? "default" : "secondary"}
                >
                  {gallery.is_published ? "Publikováno" : "Koncept"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" render={<Link href={`/admin/portfolio/${gallery.id}`} />}>
                  Upravit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(!galleries || galleries.length === 0) && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádné galerie. Vytvořte první!
        </p>
      )}
    </div>
  );
}
