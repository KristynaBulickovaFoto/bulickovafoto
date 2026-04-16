"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { createClientUser } from "@/actions/clients";
import type { Tables } from "@/lib/supabase/types";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Tables<"profiles">[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create dialog
  const [showDialog, setShowDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const supabase = createClient();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "client")
      .order("created_at", { ascending: false });
    setClients(data ?? []);
    setIsLoading(false);
  }

  async function handleCreate() {
    setIsCreating(true);
    const result = await createClientUser({
      full_name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || undefined,
    });

    if (result.success) {
      setCreated(true);
      toast.success("Klient vytvořen!");
      // Reload list
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "client")
        .order("created_at", { ascending: false });
      setClients(data ?? []);
    } else {
      toast.error(result.error ?? "Nepodařilo se vytvořit klienta.");
    }
    setIsCreating(false);
  }

  function closeDialog() {
    setShowDialog(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setCreated(false);
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
        <h1 className="text-2xl font-bold">Klienti</h1>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nový klient
        </Button>
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
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.full_name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone ?? "—"}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(client.created_at).toLocaleDateString("cs")}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link href={`/admin/klienti/${client.id}`} />}
                >
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {clients.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádní klienti.
        </p>
      )}

      {/* Create Client Dialog */}
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {created ? "Klient vytvořen" : "Nový klient"}
            </DialogTitle>
          </DialogHeader>

          {created ? (
            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">{newName}</p>
                <p className="text-sm text-muted-foreground">{newEmail}</p>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Klient se přihlásí na{" "}
                <strong className="text-foreground">/login</strong> pomocí
                svého e-mailu. Přijde mu magic link pro přihlášení.
              </p>
              <DialogFooter>
                <Button onClick={closeDialog}>Zavřít</Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Jméno a příjmení *</Label>
                  <Input
                    id="client-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Jana Nováková"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email">E-mail *</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="jana@email.cz"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-phone">Telefon</Label>
                  <Input
                    id="client-phone"
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+420..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={isCreating}>
                  {isCreating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Vytvořit klienta
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
