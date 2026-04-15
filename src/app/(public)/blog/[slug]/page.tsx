import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { generatePageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, seo_title, seo_description, cover_image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return {};

  return generatePageMetadata({
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? undefined,
    image: post.cover_image_url ?? undefined,
    pathname: `/blog/${slug}`,
  });
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Zpět na blog
      </Link>

      {post.cover_image_url && (
        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        {post.published_at && (
          <p className="mt-3 text-sm text-muted-foreground">
            {format(new Date(post.published_at), "d. MMMM yyyy", {
              locale: cs,
            })}
          </p>
        )}
      </header>

      {/* Blog content from Tiptap JSON - rendered as simple HTML for now */}
      <div className="prose prose-invert max-w-none">
        {post.excerpt && (
          <p className="text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        <p className="text-muted-foreground">
          Obsah článku bude zobrazen po nastavení Tiptap rendereru.
        </p>
      </div>
    </article>
  );
}
