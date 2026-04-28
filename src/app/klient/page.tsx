import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ClientGalleries } from "@/components/client/ClientGalleries";
import { CONTACT } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ClientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: galleries }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user?.id ?? "")
      .single(),
    supabase
      .from("client_galleries")
      .select("*, client_gallery_links(*)")
      .eq("client_id", user?.id ?? "")
      .order("created_at", { ascending: false }),
  ]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "klient";
  const list = (galleries ?? []) as Parameters<
    typeof ClientGalleries
  >[0]["galleries"];
  const activeCount = list.filter((g) => g.status === "active").length;

  return (
    <div className="space-y-10">
      <div>
        <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Vítejte, <span className="text-primary">{firstName}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {activeCount > 0
            ? `${activeCount} ${plural(activeCount, "galerie", "galerie", "galerií")} připravená k prohlédnutí`
            : "Galerie se zobrazí, jakmile budou fotky připravené"}
        </p>
      </div>

      <ClientGalleries galleries={list} />

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border/40 pt-8 text-xs text-muted-foreground">
        <span>Potřebujete něco?</span>
        <a
          href={`mailto:${CONTACT.email}`}
          className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-primary"
        >
          <Mail className="h-3.5 w-3.5 text-primary" />
          {CONTACT.email}
        </a>
        <span className="h-1 w-1 rounded-full bg-foreground/20" />
        <a
          href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-primary"
        >
          <Phone className="h-3.5 w-3.5 text-primary" />
          {CONTACT.phone}
        </a>
        <span className="h-1 w-1 rounded-full bg-foreground/20" />
        <Link
          href="/kontakt"
          className="font-medium transition-colors hover:text-primary"
        >
          Napsat zprávu
        </Link>
      </div>
    </div>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}
