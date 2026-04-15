import type { Metadata } from "next";
import { GalleryImage } from "@/components/gallery/GalleryImage";
import { generatePageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = generatePageMetadata({
  title: "Kapely & koncerty",
  description:
    "Koncertní a hudební fotografie. Energie živých vystoupení zachycená na fotografiích.",
  pathname: "/portfolio/kapely-a-koncerty",
});

export const revalidate = 3600;

export default async function ConcertsPage() {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("portfolio_categories")
    .select("id, title, description")
    .eq("slug", "kapely-a-koncerty")
    .single();

  const { data: galleries } = await supabase
    .from("portfolio_galleries")
    .select("*")
    .eq("is_published", true)
    .eq("category_id", category?.id ?? "")
    .order("date", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          {category?.title ?? "Kapely & koncerty"}
          <span className="mx-auto mt-4 block h-0.5 w-16 rounded-full bg-primary" />
        </h1>
        {category?.description && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {category.description}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(galleries ?? []).map((gallery) => (
          <GalleryImage
            key={gallery.id}
            href={`/portfolio/kapely-a-koncerty/${gallery.slug}`}
            src={gallery.cover_image_url ?? "/images/og-default.jpg"}
            alt={gallery.title}
            title={gallery.title}
            subtitle={
              [gallery.location, gallery.date].filter(Boolean).join(" • ") ||
              undefined
            }
          />
        ))}
      </div>

      {(!galleries || galleries.length === 0) && (
        <p className="py-20 text-center text-muted-foreground">
          Zatím zde nejsou žádné galerie. Brzy přidám koncertní fotky.
        </p>
      )}
    </div>
  );
}
