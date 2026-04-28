import type { Metadata } from "next";
import Link from "next/link";
import { Quote, ArrowRight } from "lucide-react";
import { MotionDiv } from "@/components/layout/MotionDiv";
import { generatePageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = generatePageMetadata({
  title: "Reference",
  description:
    "Co říkají moji klienti. Přečtěte si reference spokojených zákazníků.",
  pathname: "/reference",
});

export const revalidate = 3600;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function TestimonialsPage() {
  const supabase = await createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  const list = testimonials ?? [];
  const ratings = list.map((t) => t.rating).filter((r): r is number => r != null);
  const avgRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) /
        10
      : null;
  const fiveStarCount = ratings.filter((r) => r === 5).length;

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10">
        <div className="text-center">
          <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            Reference
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Co říkají klienti, kteří mi svěřili své vzpomínky
          </p>
        </div>

        {/* Stats */}
        {list.length > 0 && (
          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {avgRating !== null && (
              <div className="rounded-xl border border-border/40 bg-card p-5 text-center shadow-sm">
                <div className="flex items-center justify-center gap-0.5 text-lg">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.round(avgRating)
                          ? "text-primary"
                          : "text-muted-foreground/30"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-2 font-display text-3xl font-bold tabular-nums">
                  {avgRating}
                </p>
                <p className="text-xs text-muted-foreground">
                  průměrné hodnocení
                </p>
              </div>
            )}
            <div className="rounded-xl border border-border/40 bg-card p-5 text-center shadow-sm">
              <p className="font-display text-3xl font-bold tabular-nums">
                {list.length}
              </p>
              <p className="text-xs text-muted-foreground">celkem referencí</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-5 text-center shadow-sm">
              <p className="font-display text-3xl font-bold tabular-nums">
                {fiveStarCount}×
              </p>
              <p className="text-xs text-muted-foreground">
                pět hvězdiček
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        {list.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((t, index) => (
              <MotionDiv key={t.id} index={index}>
                <div className="h-full rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                  <Quote className="mb-3 h-8 w-8 text-primary/20" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4">
                    {t.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.photo_url}
                        alt=""
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {getInitials(t.author_name)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                        {t.author_name}
                      </p>
                      {t.author_role && (
                        <p className="truncate text-xs text-muted-foreground">
                          {t.author_role}
                        </p>
                      )}
                    </div>
                    {t.rating && (
                      <div className="flex shrink-0 gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < t.rating!
                                ? "text-primary"
                                : "text-muted-foreground/30"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 py-20">
            <Quote className="h-10 w-10 text-primary/20" />
            <p className="mt-4 font-medium">Reference budou brzy k dispozici</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Chcete být dalším spokojeným klientem?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Pojďme se domluvit na termínu a vytvořit vzpomínky, které vás budou
            hřát i za dvacet let.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/kontakt"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-bold tracking-wide text-background transition-all duration-300 hover:bg-primary hover:shadow-xl hover:shadow-primary/20"
            >
              Domluvit termín
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white"
            >
              Prohlédnout portfolio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
