import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuickContact } from "@/components/sections/QuickContact";
import { MotionDiv } from "@/components/layout/MotionDiv";
import { generatePageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = generatePageMetadata({
  title: "Služby a ceny",
  description:
    "Přehled fotografických služeb a ceníku. Svatby, koncerty, portréty a další.",
  pathname: "/sluzby-a-ceny",
});

export const revalidate = 3600;

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            Služby a ceny
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Vyberte si balíček, který vám vyhovuje, nebo mi napište s vlastním
            požadavkem
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(services ?? []).map((service, index) => {
            const features = Array.isArray(service.features)
              ? (service.features as string[])
              : [];

            return (
              <MotionDiv key={service.id} index={index}>
              <Card className="flex flex-col transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  {service.price_text && (
                    <Badge
                      variant="secondary"
                      className="mt-2 w-fit border-0 bg-primary/10 text-primary"
                    >
                      {service.price_text}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  {service.description && (
                    <p className="mb-4 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                  {features.length > 0 && (
                    <ul className="space-y-2.5">
                      {features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
              </MotionDiv>
            );
          })}
        </div>

        {(!services || services.length === 0) && (
          <p className="py-20 text-center text-muted-foreground">
            Ceník bude brzy k dispozici. Neváhejte mě mezitím kontaktovat.
          </p>
        )}
      </div>

      <QuickContact />
    </>
  );
}
