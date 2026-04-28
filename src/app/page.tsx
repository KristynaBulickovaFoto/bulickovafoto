import { Hero } from "@/components/sections/Hero";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { QuickContact } from "@/components/sections/QuickContact";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { AvailabilityCalendar } from "@/components/sections/AvailabilityCalendar";
import { LocalBusinessJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: featuredGalleries },
    { data: testimonials },
    { data: bookedDates },
    { data: categories },
    { data: services },
  ] = await Promise.all([
    supabase
      .from("portfolio_galleries")
      .select("slug, title, cover_image_url, category_id")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("sort_order")
      .limit(4),
    supabase
      .from("testimonials")
      .select("id, author_name, author_role, content, rating")
      .eq("is_published", true)
      .order("sort_order")
      .limit(6),
    supabase
      .from("booked_dates")
      .select("date, label, is_confirmed")
      .gte("date", new Date().toISOString().split("T")[0]),
    supabase.from("portfolio_categories").select("id, slug"),
    supabase
      .from("services")
      .select("id, slug, title, description, price_text, features")
      .eq("is_published", true)
      .order("sort_order")
      .limit(3),
  ]);

  const categoryMap = new Map(
    (categories ?? []).map((c) => [c.id, c.slug]),
  );

  const galleryItems = (featuredGalleries ?? []).map((g) => ({
    slug: g.slug,
    title: g.title,
    cover_image_url: g.cover_image_url,
    category_slug: (g.category_id && categoryMap.get(g.category_id)) ?? "svatby",
  }));

  return (
    <>
      <Header />
      <main className="flex-1">
        <LocalBusinessJsonLd />
        <WebsiteJsonLd />

        <Hero />

        <PortfolioPreview galleries={galleryItems} />

        <div className="mx-auto h-px w-24 bg-primary/30" />

        {testimonials && testimonials.length > 0 && (
          <TestimonialCarousel testimonials={testimonials} />
        )}

        {services && services.length > 0 && (
          <>
            <div className="mx-auto h-px w-24 bg-primary/30" />
            <ServicesPreview services={services} />
          </>
        )}

        <AvailabilityCalendar bookedDates={bookedDates ?? []} />

        <QuickContact />
      </main>
      <Footer />
    </>
  );
}
