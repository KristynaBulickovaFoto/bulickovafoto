import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { generatePageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: gallery } = await supabase
    .from("portfolio_galleries")
    .select("title, seo_title, seo_description, cover_image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!gallery) return {};

  return generatePageMetadata({
    title: gallery.seo_title ?? `${gallery.title} | Kapely & koncerty`,
    description:
      gallery.seo_description ?? `Koncertní fotografie: ${gallery.title}`,
    image: gallery.cover_image_url ?? undefined,
    pathname: `/portfolio/kapely-a-koncerty/${slug}`,
  });
}

export const revalidate = 3600;

export default async function ConcertGalleryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: gallery } = await supabase
    .from("portfolio_galleries")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!gallery) notFound();

  const { data: images } = await supabase
    .from("portfolio_images")
    .select("*")
    .eq("gallery_id", gallery.id)
    .order("sort_order");

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-4">
        <Link
          href="/portfolio/kapely-a-koncerty"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← Zpět na Kapely & koncerty
        </Link>
      </div>
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {gallery.title}
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          {gallery.location && <span>{gallery.location}</span>}
          {gallery.location && gallery.date && <span className="text-primary">•</span>}
          {gallery.date && <span>{gallery.date}</span>}
        </div>
        {gallery.description && (
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {gallery.description}
          </p>
        )}
      </div>

      <GalleryGrid images={images ?? []} />
    </div>
  );
}
