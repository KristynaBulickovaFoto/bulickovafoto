"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
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
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Tables<"testimonials">[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    setTestimonials(data ?? []);
    setIsLoading(false);
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Opravdu smazat tuto referenci?")) return;
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id);
    if (error) toast.error("Nepodařilo se smazat.");
    else {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast.success("Reference smazána!");
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reference</h1>
        <Button render={<Link href="/admin/reference/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Nová reference
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Autor</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Hodnocení</TableHead>
            <TableHead>Obsah</TableHead>
            <TableHead>Stav</TableHead>
            <TableHead className="w-[120px]">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.author_name}</TableCell>
              <TableCell>{t.author_role ?? "—"}</TableCell>
              <TableCell>
                {t.rating ? (
                  <span className="inline-flex items-center gap-1 text-sm">
                    {t.rating}
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </span>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                {t.content}
              </TableCell>
              <TableCell>
                <Badge variant={t.is_published ? "default" : "secondary"}>
                  {t.is_published ? "Publikováno" : "Skryto"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    render={<Link href={`/admin/reference/${t.id}`} />}
                  >
                    Upravit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteTestimonial(t.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {testimonials.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádné reference. Vytvořte první!
        </p>
      )}
    </div>
  );
}
