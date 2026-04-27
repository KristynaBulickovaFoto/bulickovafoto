import { Images, ExternalLink } from "lucide-react";
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

  if (!galleries || galleries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Images className="h-7 w-7 text-primary" />
        </div>
        <p className="mt-4 font-medium text-foreground">
          Zatím žádné galerie
        </p>
        <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
          Jakmile budou vaše fotky připravené, galerie se zde automaticky zobrazí.
        </p>
      </div>
    );
  }

  return (
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
          <div
            key={gallery.id}
            className="group rounded-2xl border border-border/40 bg-card p-5 shadow-[0_1px_8px_-2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md sm:p-6"
          >
            {/* Gallery header */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Images className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  {gallery.title}
                </h2>
                {gallery.description && (
                  <p className="text-xs text-muted-foreground">
                    {gallery.description}
                  </p>
                )}
              </div>
            </div>

            {/* Links */}
            {links && links.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {links
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-border/30 bg-muted/30 px-4 py-3 text-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="flex-1 font-medium">{link.label}</span>
                        <Badge variant="secondary" className="text-[10px]">
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
              <p className="mt-4 text-sm text-muted-foreground">
                Odkazy budou brzy k dispozici.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
