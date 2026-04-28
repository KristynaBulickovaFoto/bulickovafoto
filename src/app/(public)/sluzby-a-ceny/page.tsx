import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Clock,
  Image as ImageIcon,
  Shield,
  Mail,
  Calendar,
  MessageCircle,
  Camera,
} from "lucide-react";
import { QuickContact } from "@/components/sections/QuickContact";
import { MotionDiv } from "@/components/layout/MotionDiv";
import { generatePageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = generatePageMetadata({
  title: "Služby a ceny",
  description:
    "Přehled fotografických služeb a ceníku. Svatby, koncerty, portréty a další.",
  pathname: "/sluzby-a-ceny",
});

export const revalidate = 3600;

const ALWAYS_INCLUDED = [
  {
    icon: ImageIcon,
    title: "Online galerie",
    text: "Soukromý odkaz pro vás i hosty",
  },
  {
    icon: Clock,
    title: "Rychlé předání",
    text: "Většinou do 4 týdnů, svatby do 6–8",
  },
  {
    icon: Shield,
    title: "Bez skrytých poplatků",
    text: "Cena, na které se domluvíme, platí",
  },
];

const PROCESS = [
  {
    icon: Mail,
    title: "Poptávka",
    text: "Napíšete mi co chcete, kdy a kde.",
  },
  {
    icon: MessageCircle,
    title: "Domluva",
    text: "Probereme detaily a pošlu nabídku.",
  },
  {
    icon: Calendar,
    title: "Rezervace",
    text: "Potvrdíme termín a podepíšeme smlouvu.",
  },
  {
    icon: Camera,
    title: "Focení a předání",
    text: "Fotíme, upravuju, předávám online.",
  },
];

const FAQS = [
  {
    q: "Je v ceně cestovné?",
    a: "Cestovné do 30 km od Přerova je v ceně. Dál se domlouváme individuálně dle vzdálenosti a délky cesty.",
  },
  {
    q: "Kolik fotek dostanu?",
    a: "Záleží na typu balíčku — od 40 fotek u portrétu po 300+ u celodenní svatby. Všechny ručně upravené.",
  },
  {
    q: "Jak rychle dostanu fotky?",
    a: "Standardně do 4 týdnů, u svateb 6–8 týdnů. Náhled (10–20 nejlepších) posílám obvykle do týdne.",
  },
  {
    q: "Jak je to s licencí a tiskem?",
    a: "Dostanete fotky s licencí pro osobní použití — tisk, sociální sítě, sdílení s rodinou. Komerční použití řešíme zvlášť.",
  },
  {
    q: "Co když nebudu spokojený/á?",
    a: "Před focením si vždy projdeme styl a očekávání. Pokud něco nesedne, ráda upravím nebo přefotím.",
  },
  {
    q: "Posíláte zálohovou fakturu?",
    a: "Ano, u svateb a větších zakázek je standardem 30% záloha při rezervaci termínu, doplatek po předání.",
  },
];

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  const list = services ?? [];

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 text-center">
        <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          Služby a <span className="text-primary">ceny</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Vyberte si balíček, který vám vyhovuje, nebo mi napište s vlastním
          požadavkem.
        </p>
      </section>

      {/* What's always included */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-3 sm:grid-cols-3">
          {ALWAYS_INCLUDED.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-xl border border-border/40 bg-card p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing grid */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        {list.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((service, index) => {
              const features = Array.isArray(service.features)
                ? (service.features as string[])
                : [];
              const isFeatured = index === 0;

              return (
                <MotionDiv key={service.id} index={index}>
                  <div
                    className={cn(
                      "relative flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                      isFeatured
                        ? "border-primary/40 ring-1 ring-primary/20"
                        : "border-border/40",
                    )}
                  >
                    {isFeatured && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                        Nejoblíbenější
                      </span>
                    )}

                    <h3 className="font-display text-xl font-bold leading-tight">
                      {service.title}
                    </h3>

                    {service.price_text && (
                      <p className="mt-2 font-display text-3xl font-bold text-primary">
                        {service.price_text}
                      </p>
                    )}

                    {service.description && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    )}

                    {features.length > 0 && (
                      <ul className="mt-4 space-y-2 border-t border-border/40 pt-4">
                        {features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-6 pt-2">
                      <Link
                        href={`/kontakt?sluzba=${service.slug}`}
                        className={cn(
                          "group flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all",
                          isFeatured
                            ? "bg-foreground text-background hover:bg-primary hover:shadow-lg hover:shadow-primary/20"
                            : "border border-primary text-primary hover:bg-primary hover:text-white",
                        )}
                      >
                        Mám zájem
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </MotionDiv>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/50 py-20 text-center">
            <p className="text-muted-foreground">
              Ceník bude brzy k dispozici. Neváhejte mě mezitím kontaktovat.
            </p>
          </div>
        )}
      </section>

      {/* Process */}
      <section className="bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Jak probíhá spolupráce
            </h2>
            <p className="mt-3 text-muted-foreground">
              Čtyři jednoduché kroky od poptávky po fotky
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {PROCESS.map((step, i) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center rounded-xl border border-border/40 bg-card p-6 text-center shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-primary/30">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 text-sm font-semibold">{step.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.text}
                </p>
                {i < PROCESS.length - 1 && (
                  <span className="absolute right-[-10px] top-1/2 hidden -translate-y-1/2 text-2xl text-primary/20 md:block">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Časté dotazy
          </h2>
          <p className="mt-3 text-muted-foreground">
            Co se klienti nejčastěji ptají před rezervací
          </p>
        </div>

        <div className="divide-y divide-border/40 rounded-xl border border-border/40 bg-card shadow-sm">
          {FAQS.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 marker:hidden">
                <span className="text-sm font-semibold leading-snug">
                  {f.q}
                </span>
                <span className="mt-0.5 shrink-0 text-primary transition-transform group-open:rotate-180">
                  ⌃
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Nenašli jste odpověď?{" "}
          <Link
            href="/kontakt"
            className="font-medium text-primary hover:underline"
          >
            Napište mi přímo
          </Link>
        </p>
      </section>

      <QuickContact />
    </>
  );
}
