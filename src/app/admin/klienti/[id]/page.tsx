"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type GalleryLink = {
  id: string;
  label: string;
  url: string;
  type: string;
  sort_order: number;
};

type GalleryWithLinks = Tables<"client_galleries"> & {
  client_gallery_links: GalleryLink[];
};

export default function AdminClientDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [client, setClient] = useState<Tables<"profiles"> | null>(null);
  const [galleries, setGalleries] = useState<GalleryWithLinks[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New gallery dialog
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryDesc, setGalleryDesc] = useState("");
  const [isSavingGallery, setIsSavingGallery] = useState(false);

  // New link dialog
  const [linkGalleryId, setLinkGalleryId] = useState<string | null>(null);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkType, setLinkType] = useState<"gallery" | "download" | "selection" | "other">("gallery");
  const [isSavingLink, setIsSavingLink] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    const [{ data: clientData }, { data: galleriesData }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).single(),
      supabase
        .from("client_galleries")
        .select("*, client_gallery_links(*)")
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
    ]);

    setClient(clientData);
    setGalleries(
      (galleriesData as GalleryWithLinks[] | null) ?? []
    );
    setIsLoading(false);
  }

  // Gallery CRUD
  async function createGallery() {
    if (!galleryTitle.trim()) {
      toast.error("Zadejte název galerie.");
      return;
    }
    setIsSavingGallery(true);
    const { data, error } = await supabase
      .from("client_galleries")
      .insert({
        client_id: id,
        title: galleryTitle.trim(),
        description: galleryDesc.trim() || null,
      })
      .select("*, client_gallery_links(*)")
      .single();

    if (error) {
      toast.error("Nepodařilo se vytvořit galerii.");
    } else if (data) {
      setGalleries((prev) => [data as GalleryWithLinks, ...prev]);
      setGalleryTitle("");
      setGalleryDesc("");
      setShowGalleryDialog(false);
      toast.success("Galerie vytvořena!");
    }
    setIsSavingGallery(false);
  }

  async function deleteGallery(galleryId: string) {
    if (!confirm("Opravdu smazat galerii a všechny její odkazy?")) return;
    const { error } = await supabase
      .from("client_galleries")
      .delete()
      .eq("id", galleryId);
    if (error) toast.error("Nepodařilo se smazat galerii.");
    else {
      setGalleries((prev) => prev.filter((g) => g.id !== galleryId));
      toast.success("Galerie smazána!");
    }
  }

  async function toggleGalleryStatus(
    galleryId: string,
    current: "active" | "archived"
  ) {
    const newStatus = current === "active" ? "archived" : "active";
    const { error } = await supabase
      .from("client_galleries")
      .update({ status: newStatus })
      .eq("id", galleryId);
    if (error) toast.error("Nepodařilo se změnit stav.");
    else {
      setGalleries((prev) =>
        prev.map((g) =>
          g.id === galleryId ? { ...g, status: newStatus } : g
        )
      );
    }
  }

  // Link CRUD
  async function createLink() {
    if (!linkLabel.trim() || !linkUrl.trim()) {
      toast.error("Vyplňte popis a URL.");
      return;
    }
    setIsSavingLink(true);
    const { data, error } = await supabase
      .from("client_gallery_links")
      .insert({
        gallery_id: linkGalleryId!,
        label: linkLabel.trim(),
        url: linkUrl.trim(),
        type: linkType,
      })
      .select()
      .single();

    if (error) {
      toast.error("Nepodařilo se přidat odkaz.");
    } else if (data) {
      setGalleries((prev) =>
        prev.map((g) =>
          g.id === linkGalleryId
            ? {
                ...g,
                client_gallery_links: [
                  ...g.client_gallery_links,
                  data as GalleryLink,
                ],
              }
            : g
        )
      );
      setLinkLabel("");
      setLinkUrl("");
      setLinkType("gallery");
      setLinkGalleryId(null);
      toast.success("Odkaz přidán!");
    }
    setIsSavingLink(false);
  }

  async function deleteLink(galleryId: string, linkId: string) {
    if (!confirm("Opravdu smazat tento odkaz?")) return;
    const { error } = await supabase
      .from("client_gallery_links")
      .delete()
      .eq("id", linkId);
    if (error) toast.error("Nepodařilo se smazat odkaz.");
    else {
      setGalleries((prev) =>
        prev.map((g) =>
          g.id === galleryId
            ? {
                ...g,
                client_gallery_links: g.client_gallery_links.filter(
                  (l) => l.id !== linkId
                ),
              }
            : g
        )
      );
      toast.success("Odkaz smazán!");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Klient nenalezen.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href="/admin/klienti" />}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{client.full_name}</h1>
      </div>

      {/* Client info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kontakt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">E-mail:</span>{" "}
              {client.email}
            </p>
            <p>
              <span className="text-muted-foreground">Telefon:</span>{" "}
              {client.phone ?? "neuvedeno"}
            </p>
            <p>
              <span className="text-muted-foreground">Registrace:</span>{" "}
              {new Date(client.created_at).toLocaleDateString("cs")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Galleries */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Galerie klienta</h2>
        <Button onClick={() => setShowGalleryDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nová galerie
        </Button>
      </div>

      {galleries.length > 0 ? (
        <div className="space-y-4">
          {galleries.map((gallery) => (
            <Card key={gallery.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{gallery.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        gallery.status === "active" ? "default" : "secondary"
                      }
                      className="cursor-pointer"
                      onClick={() =>
                        toggleGalleryStatus(gallery.id, gallery.status)
                      }
                    >
                      {gallery.status === "active" ? "Aktivní" : "Archivováno"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteGallery(gallery.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {gallery.description && (
                  <p className="text-sm text-muted-foreground">
                    {gallery.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {gallery.client_gallery_links.length > 0 ? (
                  <ul className="space-y-2">
                    {gallery.client_gallery_links.map((link) => (
                      <li
                        key={link.id}
                        className="flex items-center justify-between"
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          {link.label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {link.type === "gallery"
                              ? "Galerie"
                              : link.type === "download"
                                ? "Ke stažení"
                                : link.type === "selection"
                                  ? "Výběr"
                                  : "Odkaz"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => deleteLink(gallery.id, link.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Žádné odkazy</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setLinkGalleryId(gallery.id)}
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Přidat odkaz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Klient nemá žádné galerie.
        </p>
      )}

      {/* New Gallery Dialog */}
      <Dialog
        open={showGalleryDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowGalleryDialog(false);
            setGalleryTitle("");
            setGalleryDesc("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nová galerie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gallery-title">Název *</Label>
              <Input
                id="gallery-title"
                value={galleryTitle}
                onChange={(e) => setGalleryTitle(e.target.value)}
                placeholder="např. Svatba 2026"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-desc">Popis</Label>
              <Input
                id="gallery-desc"
                value={galleryDesc}
                onChange={(e) => setGalleryDesc(e.target.value)}
                placeholder="Volitelný popis..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createGallery} disabled={isSavingGallery}>
              {isSavingGallery && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Vytvořit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Link Dialog */}
      <Dialog
        open={!!linkGalleryId}
        onOpenChange={(open) => {
          if (!open) {
            setLinkGalleryId(null);
            setLinkLabel("");
            setLinkUrl("");
            setLinkType("gallery");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Přidat odkaz</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-label">Popis *</Label>
              <Input
                id="link-label"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                placeholder="např. Fotogalerie na Zonerama"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Typ</Label>
              <Select value={linkType} onValueChange={(val) => val && setLinkType(val as "gallery" | "download" | "selection" | "other")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gallery">Galerie</SelectItem>
                  <SelectItem value="download">Ke stažení</SelectItem>
                  <SelectItem value="selection">Výběr fotek</SelectItem>
                  <SelectItem value="other">Jiné</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createLink} disabled={isSavingLink}>
              {isSavingLink && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Přidat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
