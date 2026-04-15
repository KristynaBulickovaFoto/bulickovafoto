import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Download, Images, Folders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientGalleryDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: gallery } = await supabase
    .from("client_galleries")
    .select("*, client_gallery_links(*)")
    .eq("id", id)
    .eq("client_id", user?.id ?? "")
    .single();

  if (!gallery) notFound();

  const links = gallery.client_gallery_links as Array<{
    id: string;
    label: string;
    url: string;
    type: string;
    sort_order: number;
  }>;

  const typeIcons = {
    gallery: Images,
    download: Download,
    selection: Folders,
    other: ExternalLink,
  } as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/klient" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{gallery.title}</h1>
          {gallery.description && (
            <p className="text-sm text-muted-foreground">
              {gallery.description}
            </p>
          )}
        </div>
      </div>

      {links && links.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {links
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((link) => {
              const Icon =
                typeIcons[link.type as keyof typeof typeIcons] ?? ExternalLink;

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="transition-colors group-hover:border-primary">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary">
                          {link.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Otevřít v novém okně
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {link.type === "gallery"
                          ? "Galerie"
                          : link.type === "download"
                            ? "Ke stažení"
                            : link.type === "selection"
                              ? "Výběr"
                              : "Odkaz"}
                      </Badge>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Odkazy budou brzy k dispozici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
