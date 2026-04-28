import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Heart,
  Quote,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { QuickContact } from "@/components/sections/QuickContact";
import { generatePageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = generatePageMetadata({
  title: "O mně",
  description:
    "Jsem Kristýna, fotografka z lásky k zachycování autentických momentů. Přečtěte si můj příběh.",
  pathname: "/o-mne",
});

export const revalidate = 86400;

const APPROACH = [
  {
    icon: Heart,
    title: "Autenticky",
    text: "Žádné nucené pózy. Hledám momenty, které jsou skutečné a upřímné.",
  },
  {
    icon: Camera,
    title: "Citlivě",
    text: "Splynu s prostředím a nezasahuju. Vy zažíváte, já zachycuju.",
  },
  {
    icon: Sparkles,
    title: "Pečlivě",
    text: "Každou fotku ručně retušuju. Předávám jen to nejlepší.",
  },
];

export default async function AboutPage() {
  const supabase = await createClient();

  const [
    { data: settings },
    { count: weddingCount },
    { count: concertCount },
    { count: galleryCount },
    { count: testimonialsCount },
    { data: featured },
    { data: topTestimonial },
  ] = await Promise.all([
    supabase
      .from("site_settings")
      .select("about_text, about_image_url")
      .eq("id", 1)
      .single(),
    supabase
      .from("portfolio_galleries")
      .select("id, portfolio_categories!inner(slug)", {
        count: "exact",
        head: true,
      })
      .eq("portfolio_categories.slug", "svatby")
      .eq("is_published", true),
    supabase
      .from("portfolio_galleries")
      .select("id, portfolio_categories!inner(slug)", {
        count: "exact",
        head: true,
      })
      .eq("portfolio_categories.slug", "kapely-a-koncerty")
      .eq("is_published", true),
    supabase
      .from("portfolio_galleries")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("testimonials")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("portfolio_galleries")
      .select("id, title, slug, cover_image_url, location, portfolio_categories(slug)")
      .eq("is_published", true)
      .eq("is_featured", true)
      .not("cover_image_url", "is", null)
      .limit(4),
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const stats = [
    { value: weddingCount ?? 0, label: "svateb" },
    { value: concertCount ?? 0, label: "koncertů" },
    { value: galleryCount ?? 0, label: "galerií" },
    { value: testimonialsCount ?? 0, label: "referencí" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 text-center">
        <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          Jsem <span className="text-primary">Kristýna</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Zachycuji autentické momenty, emoce a příběhy.
        </p>
      </section>

      {/* Photo + bio */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-xl ring-4 ring-primary/10">
            {settings?.about_image_url ? (
              <Image
                src={settings.about_image_url}
                alt="Kristýna - fotografka"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                Fotka bude brzy
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="prose max-w-none prose-headings:font-display">
              {settings?.about_text ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: settings.about_text.replace(/\n/g, "<br/>"),
                  }}
                />
              ) : (
                <>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Fotím už od dob, kdy jsem poprvé vzala do ruky foťák. Miluju
                    zachycovat autentické momenty — emoce, smích, slzy štěstí,
                    energii živého koncertu.
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Specializuji se na svatební fotografii, koncertní reportáže
                    a portrétní focení. Každý příběh je jiný a já se snažím ho
                    zachytit tak, jak ho prožíváte vy.
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-bold tracking-wide text-background transition-all duration-300 hover:bg-primary hover:shadow-xl hover:shadow-primary/20"
              >
                Prohlédnout portfolio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white"
              >
                Pojďme se domluvit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border/40 bg-card p-6 text-center shadow-sm"
              >
                <p className="font-display text-4xl font-bold text-primary tabular-nums">
                  {s.value}+
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Jak pracuji
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tři principy, kterých se vždy držím
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {APPROACH.map((a) => (
            <div
              key={a.title}
              className="rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <a.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured work */}
      {featured && featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
              <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Vybrané práce
              </h2>
              <p className="mt-3 text-muted-foreground">
                Pár ukázek z poslední doby
              </p>
            </div>
            <Link
              href="/portfolio"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              Vše
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((g) => {
              const cat = (g.portfolio_categories as { slug: string } | null)
                ?.slug;
              const href = cat ? `/portfolio/${cat}/${g.slug}` : "/portfolio";
              return (
                <Link
                  key={g.id}
                  href={href}
                  className="group relative aspect-[3/4] overflow-hidden rounded-xl"
                >
                  {g.cover_image_url && (
                    <Image
                      src={g.cover_image_url}
                      alt={g.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                    <p className="truncate text-sm font-medium text-white">
                      {g.title}
                    </p>
                    {g.location && (
                      <p className="truncate text-[11px] text-white/70">
                        {g.location}
                      </p>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-300 sm:w-0 sm:group-hover:w-full" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured testimonial */}
      {topTestimonial && (
        <section className="bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <Quote className="mx-auto h-10 w-10 text-primary/20" />
            <p className="mt-4 font-display text-2xl italic leading-relaxed text-foreground/80 sm:text-3xl">
              &ldquo;{topTestimonial.content}&rdquo;
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              <span className="font-medium">{topTestimonial.author_name}</span>
              {topTestimonial.author_role && (
                <span className="text-muted-foreground">
                  · {topTestimonial.author_role}
                </span>
              )}
            </div>
            {topTestimonial.rating && (
              <div className="mt-3 flex justify-center gap-0.5 text-lg">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < topTestimonial.rating!
                        ? "text-primary"
                        : "text-muted-foreground/30"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
            <div className="mt-6">
              <Link
                href="/reference"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Další reference
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <QuickContact />
    </>
  );
}
