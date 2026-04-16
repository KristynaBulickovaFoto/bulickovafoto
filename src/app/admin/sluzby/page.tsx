"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Loader2 } from "lucide-react";
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

export default function AdminServicesPage() {
  const [services, setServices] = useState<Tables<"services">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order");
    setServices(data ?? []);
    setIsLoading(false);
  }

  async function deleteService(id: string) {
    if (!confirm("Opravdu smazat tuto službu?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.error("Nepodařilo se smazat.");
    else {
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Služba smazána!");
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
        <h1 className="text-2xl font-bold">Služby a ceny</h1>
        <Button render={<Link href="/admin/sluzby/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Nová služba
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Název</TableHead>
            <TableHead>Cena</TableHead>
            <TableHead>Stav</TableHead>
            <TableHead className="w-[120px]">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.title}</TableCell>
              <TableCell>{service.price_text ?? "—"}</TableCell>
              <TableCell>
                <Badge
                  variant={service.is_published ? "default" : "secondary"}
                >
                  {service.is_published ? "Publikováno" : "Skryto"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    render={<Link href={`/admin/sluzby/${service.id}`} />}
                  >
                    Upravit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {services.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádné služby. Vytvořte první!
        </p>
      )}
    </div>
  );
}
