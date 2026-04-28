import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Service = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price_text: string | null;
  features: unknown;
};

export function ServicesPreview({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="mb-10 text-center">
        <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Služby a ceny
        </h2>
        <p className="mt-3 text-muted-foreground">
          Vyberte si balíček nebo mi napište s vlastním požadavkem
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const features = Array.isArray(service.features)
            ? (service.features as string[])
            : [];
          const isFeatured = index === 0;

          return (
            <div
              key={service.id}
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
                  {features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {features.length > 4 && (
                    <li className="pl-6 text-xs text-muted-foreground">
                      +{features.length - 4} dalších
                    </li>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/sluzby-a-ceny"
          className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white"
        >
          Kompletní ceník
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/kontakt"
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-bold tracking-wide text-background transition-all hover:bg-primary hover:shadow-xl hover:shadow-primary/20"
        >
          Nezávazná poptávka
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
