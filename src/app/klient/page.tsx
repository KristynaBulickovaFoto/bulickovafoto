import { Images, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ClientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: galleries } = await supabase
    .from("client_galleries")
    .select("*, client_gallery_links(*)")
    .eq("client_id", user?.id ?? "")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Moje galerie</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Zde najdete odkazy na vaše fotogalerie
        </p>
      </div>

      {galleries && galleries.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {galleries.map((gallery) => {
            const links = gallery.client_gallery_links as Array<{
              id: string;
              label: string;
              url: string;
              type: string;
              sort_order: number;
            }>;

            return (
              <Card key={gallery.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Images className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">
                        {gallery.title}
                      </CardTitle>
                    </div>
                  </div>
                  {gallery.description && (
                    <p className="text-sm text-muted-foreground">
                      {gallery.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {links && links.length > 0 ? (
                    <ul className="space-y-2">
                      {links
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((link) => (
                          <li key={link.id}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              {link.label}
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {link.type === "gallery"
                                  ? "Galerie"
                                  : link.type === "download"
                                    ? "Ke stažení"
                                    : link.type === "selection"
                                      ? "Výběr"
                                      : "Odkaz"}
                              </Badge>
                            </a>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Odkazy budou brzy k dispozici.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Images className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Zatím nemáte žádné galerie. Jakmile budou vaše fotky připravené,
              objeví se zde.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
