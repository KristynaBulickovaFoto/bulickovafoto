import { SITE_NAME, SITE_URL, CONTACT } from "@/lib/constants";

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "Photographer"],
        name: SITE_NAME,
        url: SITE_URL,
        telephone: CONTACT.phone,
        email: CONTACT.email,
        image: `${SITE_URL}/images/og-default.jpg`,
        sameAs: [CONTACT.instagram, CONTACT.facebook],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Přerov",
          addressRegion: "Olomoucký kraj",
          addressCountry: "CZ",
        },
        areaServed: [
          { "@type": "City", name: "Přerov" },
          { "@type": "City", name: "Olomouc" },
          { "@type": "City", name: "Zlín" },
          { "@type": "City", name: "Brno" },
        ],
        priceRange: "$$",
        inLanguage: "cs",
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "cs",
      }}
    />
  );
}
