import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminClientDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) notFound();

  const { data: galleries } = await supabase
    .from("client_galleries")
    .select("*, client_gallery_links(*)")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/admin/klienti" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{client.full_name}</h1>
      </div>

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

      <div>
        <h2 className="mb-4 text-xl font-bold">Galerie klienta</h2>
        {galleries && galleries.length > 0 ? (
          <div className="space-y-4">
            {galleries.map((gallery) => (
              <Card key={gallery.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {gallery.title}
                    </CardTitle>
                    <Badge variant={gallery.status === "active" ? "default" : "secondary"}>
                      {gallery.status === "active" ? "Aktivní" : "Archivováno"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {(gallery.client_gallery_links as Array<{ id: string; label: string; url: string; type: string }>) &&
                  (gallery.client_gallery_links as Array<{ id: string; label: string; url: string; type: string }>).length > 0 ? (
                    <ul className="space-y-2">
                      {(gallery.client_gallery_links as Array<{ id: string; label: string; url: string; type: string }>).map(
                        (link) => (
                          <li key={link.id}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              {link.label}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Žádné odkazy
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Klient nemá žádné galerie.
          </p>
        )}
      </div>
    </div>
  );
}
