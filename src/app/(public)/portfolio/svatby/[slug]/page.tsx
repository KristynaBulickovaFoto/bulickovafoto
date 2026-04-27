import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
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
    title: gallery.seo_title ?? `${gallery.title} | Svatby`,
    description: gallery.seo_description ?? `Svatební fotografie: ${gallery.title}`,
    image: gallery.cover_image_url ?? undefined,
    pathname: `/portfolio/svatby/${slug}`,
  });
}

export const revalidate = 3600;

export default async function WeddingStoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: gallery } = await supabase
    .from("portfolio_galleries")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!gallery) notFound();

  const { data: images } = gallery.external_url
    ? { data: null }
    : await supabase
        .from("portfolio_images")
        .select("*")
        .eq("gallery_id", gallery.id)
        .order("sort_order");

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-4">
        <Link
          href="/portfolio/svatby"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← Zpět na Svatby
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

      {gallery.external_url ? (
        <ExternalGalleryCta
          coverUrl={gallery.cover_image_url}
          title={gallery.title}
          externalUrl={gallery.external_url}
        />
      ) : (
        <GalleryGrid images={images ?? []} />
      )}
    </div>
  );
}

function ExternalGalleryCta({
  coverUrl,
  title,
  externalUrl,
}: {
  coverUrl: string | null;
  title: string;
  externalUrl: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      {coverUrl && (
        <div className="relative mb-8 aspect-[3/2] overflow-hidden rounded-2xl">
          <Image
            src={coverUrl}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}
      <div className="text-center">
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md"
        >
          Otevřít celou galerii
          <ExternalLink className="h-4 w-4" />
        </a>
        <p className="mt-3 text-xs text-muted-foreground">
          Galerie je hostovaná na externím úložišti (Zonerama)
        </p>
      </div>
    </div>
  );
}
