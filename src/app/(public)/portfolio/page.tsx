import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = generatePageMetadata({
  title: "Portfolio",
  description:
    "Prohlédněte si mé portfolio svatebních, koncertních a portrétních fotografií.",
  pathname: "/portfolio",
});

export const revalidate = 3600;

export default async function PortfolioPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("portfolio_categories")
    .select("*")
    .order("sort_order");

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          Portfolio
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Vyberte si kategorii a prohlédněte si mé práce
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(categories ?? []).map((category) => (
          <Link
            key={category.slug}
            href={`/portfolio/${category.slug}`}
            className="group relative block aspect-[3/4] overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <h2 className="font-display text-3xl font-bold transition-colors group-hover:text-primary">
                {category.title}
              </h2>
              {category.description && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {category.description}
                </p>
              )}
              <span className="mt-6 text-sm font-medium text-primary">
                Zobrazit &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
