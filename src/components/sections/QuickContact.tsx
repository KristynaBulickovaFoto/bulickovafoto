import Link from "next/link";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { CONTACT } from "@/lib/constants";

export function QuickContact() {
  return (
    <section className="bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Máte zájem o focení?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Napište mi nebo zavolejte. Ráda vám odpovím na všechny dotazy.
            </p>
            <p className="mt-1 text-sm font-medium text-primary">
              Odpovím do 24 hodin
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4 text-primary" />
              {CONTACT.phone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4 text-primary" />
              {CONTACT.email}
            </a>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              Poptávka
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
