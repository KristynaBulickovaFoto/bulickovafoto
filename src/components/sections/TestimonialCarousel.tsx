"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  rating: number | null;
};

type TestimonialCarouselProps = {
  testimonials: Testimonial[];
};

export function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Co říkají klienti
          </h2>
          <p className="mt-3 text-muted-foreground">
            Zpětná vazba od spokojených zákazníků
          </p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button variant="ghost" size="icon" onClick={scrollPrev} className="hover:bg-primary/10 hover:text-primary">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={scrollNext} className="hover:bg-primary/10 hover:text-primary">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <div className="h-full rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
