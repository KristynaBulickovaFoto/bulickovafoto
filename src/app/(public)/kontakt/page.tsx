import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { generatePageMetadata } from "@/lib/metadata";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "Kontakt",
  description:
    "Máte zájem o focení? Vyplňte poptávkový formulář nebo mě kontaktujte přímo.",
  pathname: "/kontakt",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          Kontakt
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Máte zájem o focení? Vyplňte formulář nebo mě kontaktujte přímo.
          Odpovím do 24 hodin.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Contact info */}
        <div className="space-y-6 rounded-xl bg-muted/30 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Telefon</p>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {CONTACT.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">E-mail</p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {CONTACT.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Kde fotím</p>
              <p className="text-sm text-muted-foreground">
                Přerov & okolí (Olomouc, Zlín, Brno, celá ČR)
              </p>
            </div>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Fotím po celé ČR s primou v Přerově a okolí.
          </p>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
