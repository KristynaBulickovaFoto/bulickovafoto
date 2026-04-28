import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  AtSign,
  Link2,
  MessageCircle,
  Calendar,
  HelpCircle,
} from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { generatePageMetadata } from "@/lib/metadata";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "Kontakt",
  description:
    "Máte zájem o focení? Vyplňte poptávkový formulář nebo mě kontaktujte přímo.",
  pathname: "/kontakt",
});

const STEPS = [
  {
    n: "1",
    icon: Mail,
    title: "Pošlete poptávku",
    text: "Vyplňte formulář nebo napište přímo. Stačí pár vět.",
  },
  {
    n: "2",
    icon: MessageCircle,
    title: "Ozvu se vám",
    text: "Do 24 hodin vám odpovím a domluvíme detaily.",
  },
  {
    n: "3",
    icon: Calendar,
    title: "Zarezervujeme termín",
    text: "Potvrdíme datum, místo a vyrážíme fotit!",
  },
];

const FAQS = [
  {
    q: "Jak rychle se ozvete?",
    a: "Standardně do 24 hodin. O víkendu může odpověď trvat déle.",
  },
  {
    q: "Kolik to bude stát?",
    a: "Cena záleží na typu focení, délce a místě. Pošlu vám individuální nabídku.",
  },
  {
    q: "Cestujete mimo Přerov?",
    a: "Ano, fotím po celé ČR. Cestovné je řešeno individuálně dle vzdálenosti.",
  },
  {
    q: "Kdy dostanu fotky?",
    a: "Standardně do 4 týdnů. U svateb počítejte s 6–8 týdny.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 text-center">
        <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          Pojďme se <span className="text-primary">domluvit</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Vyplňte formulář nebo mě kontaktujte přímo — vyberte si, co je vám
          příjemnější.
        </p>
        <p className="mt-2 text-sm font-medium text-primary">
          Odpovím do 24 hodin
        </p>
      </section>

      {/* Process steps */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-3 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="relative flex items-start gap-4 rounded-xl border border-border/40 bg-card p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-base font-bold text-primary">
                {s.n}
              </div>
              <div>
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.text}</p>
              </div>
              {i < STEPS.length - 1 && (
                <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-2xl text-primary/20 md:block">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            {/* Direct contact */}
            <div className="rounded-xl border border-border/40 bg-card p-5 shadow-sm">
              <span className="mb-3 inline-block h-1 w-8 rounded-full bg-primary" />
              <h3 className="font-display text-lg font-bold">Přímý kontakt</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Nechce se vám psát? Zavolejte nebo napište na sociální sítě.
              </p>
              <div className="mt-4 space-y-1.5">
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="flex-1">{CONTACT.phone}</span>
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="flex-1 truncate">{CONTACT.email}</span>
                </a>
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  <AtSign className="h-4 w-4 text-primary" />
                  <span className="flex-1">Instagram</span>
                </a>
                <a
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  <Link2 className="h-4 w-4 text-primary" />
                  <span className="flex-1">Facebook</span>
                </a>
              </div>
            </div>

            {/* Areas */}
            <div className="rounded-xl border border-border/40 bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Kde fotím</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Primárně v Přerově a okolí, ale fotím po celé ČR.
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {CONTACT.areas.map((area) => (
                  <li
                    key={area}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ */}
            <div className="rounded-xl border border-border/40 bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Časté dotazy</p>
              </div>
              <div className="divide-y divide-border/40">
                {FAQS.map((f) => (
                  <details key={f.q} className="group py-2.5">
                    <summary className="flex cursor-pointer list-none items-start gap-2 text-xs font-medium marker:hidden">
                      <span className="flex-1">{f.q}</span>
                      <span className="text-primary transition-transform group-open:rotate-180">
                        ⌃
                      </span>
                    </summary>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-card p-4 text-center shadow-sm">
              <p className="text-xs text-muted-foreground">
                Už jste klient?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  Přihlaste se
                </Link>
              </p>
            </div>
          </aside>

          {/* Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
