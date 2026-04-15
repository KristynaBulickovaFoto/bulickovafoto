import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { generatePageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog",
  description:
    "Tipy a rady z oblasti fotografování. Jak se připravit na focení, jak vybrat fotografa a další.",
  pathname: "/blog",
});

export const revalidate = 1800;

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_image_url, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">Blog</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Tipy, rady a příběhy ze světa fotografie
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(posts ?? []).map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="group h-full overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg">
              {post.cover_image_url && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <CardContent className="p-5">
                {post.published_at && (
                  <p className="mb-2 text-xs text-muted-foreground">
                    {format(new Date(post.published_at), "d. MMMM yyyy", {
                      locale: cs,
                    })}
                  </p>
                )}
                <h2 className="text-lg font-semibold transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {(!posts || posts.length === 0) && (
        <p className="py-20 text-center text-muted-foreground">
          Zatím zde nejsou žádné články. Brzy se tu něco objeví!
        </p>
      )}
    </div>
  );
}
