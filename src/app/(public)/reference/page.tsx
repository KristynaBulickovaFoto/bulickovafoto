import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { QuickContact } from "@/components/sections/QuickContact";
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

export default async function TestimonialsPage() {
  const supabase = await createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            Reference
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Co říkají moji spokojení klienti
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(testimonials ?? []).map((t, index) => (
            <MotionDiv key={t.id} index={index}>
            <Card className="rounded-xl shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="pt-6">
                <Quote className="mb-3 h-8 w-8 text-primary/20" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-4 border-t border-border/50 pt-4">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                    {t.author_name}
                  </p>
                  {t.author_role && (
                    <p className="text-xs text-muted-foreground">
                      {t.author_role}
                    </p>
                  )}
                  {t.rating && (
                    <div className="mt-1 flex gap-0.5">
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
              </CardContent>
            </Card>
            </MotionDiv>
          ))}
        </div>

        {(!testimonials || testimonials.length === 0) && (
          <p className="py-20 text-center text-muted-foreground">
            Reference budou brzy k dispozici.
          </p>
        )}
      </div>

      <QuickContact />
    </>
  );
}
