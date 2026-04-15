import type { Metadata } from "next";
import Image from "next/image";
import { QuickContact } from "@/components/sections/QuickContact";
import { generatePageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = generatePageMetadata({
  title: "O mně",
  description:
    "Jsem Kristina, fotografka z lásky k zachycování autentických momentů. Přečtěte si můj příběh.",
  pathname: "/o-mne",
});

export const revalidate = 86400;

export default async function AboutPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("about_text, about_image_url")
    .eq("id", 1)
    .single();

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            O mně
          </h1>
        </div>

        <div className="grid items-start gap-12 md:grid-cols-2">
          {/* Photo */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl ring-4 ring-primary/10">
            {settings?.about_image_url ? (
              <Image
                src={settings.about_image_url}
                alt="Kristina - fotografka"
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

          {/* Text */}
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
                  Jsem Kristina a fotím už od dob, kdy jsem poprvé vzala do
                  ruky foťák. Miluju zachycovat autentické momenty — emoce,
                  smích, slzy štěstí, energii živého koncertu.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Specializuji se na svatební fotografii, koncertní reportáže a
                  portrétní focení. Každý příběh je jiný a já se snažím ho
                  zachytit tak, jak ho prožíváte vy.
                </p>
                <h2 className="mt-8 text-xl font-bold text-foreground">
                  Jak pracuji
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Preferuji přirozený styl focení. Žádné nucené pózy, žádné
                  umělé úsměvy. Místo toho hledám momenty, které jsou skutečné a
                  upřímné. Během spolupráce vás provedu celým procesem — od
                  prvního kontaktu po předání hotových fotografií.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <QuickContact />
    </>
  );
}
