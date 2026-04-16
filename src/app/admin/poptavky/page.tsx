"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { SHOOT_TYPES, INQUIRY_STATUSES } from "@/lib/constants";
import type { Tables } from "@/lib/supabase/types";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Tables<"inquiries">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Tables<"inquiries"> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setInquiries(data ?? []);
    setIsLoading(false);
  }

  async function updateStatus(id: string, status: Tables<"inquiries">["status"]) {
    const { error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Nepodařilo se změnit stav.");
    } else {
      setInquiries((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, status: status as Tables<"inquiries">["status"] }
            : i
        )
      );
      if (selected?.id === id) {
        setSelected((prev) =>
          prev
            ? { ...prev, status: status as Tables<"inquiries">["status"] }
            : null
        );
      }
    }
  }

  async function deleteInquiry(id: string) {
    if (!confirm("Opravdu smazat tuto poptávku?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) {
      toast.error("Nepodařilo se smazat.");
    } else {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Poptávka smazána!");
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
            <TableHead className="w-[80px]">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((inquiry) => {
            const shootLabel =
              SHOOT_TYPES.find((t) => t.value === inquiry.shoot_type)?.label ??
              inquiry.shoot_type;

            return (
              <TableRow key={inquiry.id}>
                <TableCell
                  className="cursor-pointer font-medium hover:text-primary"
                  onClick={() => setSelected(inquiry)}
                >
                  {inquiry.name}
                </TableCell>
                <TableCell>{inquiry.email}</TableCell>
                <TableCell>{shootLabel}</TableCell>
                <TableCell>{inquiry.preferred_date ?? "—"}</TableCell>
                <TableCell>
                  <Select
                    value={inquiry.status}
                    onValueChange={(val) => val && updateStatus(inquiry.id, val as Tables<"inquiries">["status"])}
                  >
                    <SelectTrigger className="h-8 w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INQUIRY_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(inquiry.created_at).toLocaleDateString("cs")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelected(inquiry)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteInquiry(inquiry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {inquiries.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádné poptávky.
        </p>
      )}

      {/* Detail Sheet */}
      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detail poptávky</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 px-4 pb-4">
              <div>
                <p className="text-xs text-muted-foreground">Jméno</p>
                <p className="font-medium">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p>{selected.email}</p>
              </div>
              {selected.phone && (
                <div>
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <p>{selected.phone}</p>
                </div>
              )}
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Typ focení</p>
                <p>
                  {SHOOT_TYPES.find((t) => t.value === selected.shoot_type)
                    ?.label ?? selected.shoot_type}
                </p>
              </div>
              {selected.preferred_date && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Preferovaný datum
                  </p>
                  <p>{selected.preferred_date}</p>
                </div>
              )}
              {selected.location && (
                <div>
                  <p className="text-xs text-muted-foreground">Místo</p>
                  <p>{selected.location}</p>
                </div>
              )}
              {selected.duration && (
                <div>
                  <p className="text-xs text-muted-foreground">Délka</p>
                  <p>{selected.duration}</p>
                </div>
              )}
              {selected.message && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Zpráva</p>
                    <p className="whitespace-pre-wrap text-sm">
                      {selected.message}
                    </p>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">
                  Preferovaný kontakt
                </p>
                <p>
                  {selected.preferred_contact === "email"
                    ? "E-mail"
                    : selected.preferred_contact === "phone"
                      ? "Telefon"
                      : "WhatsApp"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Stav</p>
                <Select
                  value={selected.status}
                  onValueChange={(val) => val && updateStatus(selected.id, val as Tables<"inquiries">["status"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INQUIRY_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Přijato</p>
                <p className="text-sm">
                  {new Date(selected.created_at).toLocaleString("cs")}
                </p>
              </div>
              <Separator />
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => deleteInquiry(selected.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Smazat poptávku
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
