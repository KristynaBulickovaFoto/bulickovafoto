# kristinafoto.cz

Web a klientsky portal pro fotografku Kristynu Bulickovou. Svetly minimalisticky design, ruzovy akcent z loga, font Amatic SC pro nadpisy.

## Tech stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript 5)
- **Styling**: Tailwind CSS 4, shadcn/ui (base-nova styl, @base-ui/react primitiva)
- **Backend**: Supabase (auth, PostgreSQL, RLS, pripraveno na Storage)
- **Email**: Resend + @react-email/components
- **Animace**: Framer Motion 12
- **Galerie**: yet-another-react-lightbox, embla-carousel-react
- **Formulare**: React Hook Form 7 + Zod 4
- **Rich text**: Tiptap (pripraveno pro blog editor)
- **SEO**: next-sitemap, schema-dts (JSON-LD)
- **Deploy**: Vercel

## Spusteni lokalne

```bash
# 1. Instalace
npm install

# 2. Env promenne
cp .env.example .env.local
# Vyplnit: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#          SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY

# 3. Supabase (lokalni)
npx supabase start
npx supabase db push

# 4. Dev server
npm run dev
```

## Struktura projektu

```
src/
  app/
    page.tsx                    Homepage (Hero + sekce)
    (public)/                   Verejne stranky (Header+Footer layout)
      portfolio/                Kategorie + galerie [slug]
      sluzby-a-ceny/
      o-mne/
      reference/
      blog/ + [slug]
      kontakt/
    (auth)/login/               Prihlaseni
    admin/                      Admin panel (sidebar layout)
      portfolio/, klienti/, poptavky/, blog/,
      sluzby/, reference/, kalendar/, nastaveni/
    klient/                     Klientsky portal
      galerie/[id]/
  components/
    ui/                         shadcn/ui (Button, Card, Dialog, Table, ...)
    layout/                     Header, Footer, MobileNav, AdminSidebar
    sections/                   Hero, PortfolioPreview, QuickContact,
                                TestimonialCarousel, AvailabilityCalendar
    gallery/                    GalleryGrid, GalleryImage
    forms/                      ContactForm
    seo/                        JsonLd
  lib/
    supabase/                   client.ts, server.ts, admin.ts, middleware.ts, types.ts
    constants.ts, validations.ts, metadata.ts, utils.ts
  actions/                      Server actions (auth.ts, contact.ts)
  hooks/                        useMediaQuery, useScrollDirection
emails/                         React Email sablony
supabase/migrations/            SQL schema + RLS + seed data
middleware.ts                   Auth routing
```

## Databaze (Supabase)

12 tabulek: profiles, portfolio_categories, portfolio_galleries, portfolio_images, client_galleries, client_gallery_links, services, testimonials, blog_posts, booked_dates, inquiries, site_settings.

RLS politiky: verejne (published obsah), klient (vlastni galerie), admin (vse).

## Tri casti webu

### 1. Verejny web
- Homepage s canvas scroll animaci (145 WebP snimku)
- Portfolio: 3 kategorie (svatby, kapely & koncerty, portrety) s galeriemi
- Sluzby a ceny, O mne, Reference, Blog, Kontakt
- SEO: generateMetadata na vsech routes, JSON-LD, sitemap, robots.txt
- ISR (revalidate: 3600) pro verejne stranky

### 2. Admin panel (/admin)
- Dashboard se statistikami
- CRUD pro portfolio, klienty, poptavky, blog, sluzby, reference
- Kalendar obsazenosti
- Site settings (kontakty, hero, about)
- Pristup: role = 'admin' (kontrolovano middleware)

### 3. Klientsky portal (/klient)
- Dashboard s galeriemi
- Galerie s odkazy na Zonerama/Uschovnu/Drive
- Pristup: prihlaseny uzivatel s role = 'client'

## Kontaktni formular

9 poli + honeypot, React Hook Form + Zod validace.
Flow: validace -> ulozeni do DB -> Resend email Kristine (InquiryNotification) + auto-reply klientovi (InquiryConfirmation).

## Design

- **Svetly theme** (bily zaklad, cerny text, ruzovy akcent #e8306d)
- **Fonty**: Inter (body/UI), Amatic SC (nadpisy/display — font z loga)
- **Logo**: dve varianty (bila/tmava) — `logo.png`, `logo tmava.png`
- **shadcn base-nova**: pouziva `render` prop (ne `asChild`) pro kompozici komponent

## Build a deploy

```bash
npm run build    # Next.js build + next-sitemap
npm run start    # Produkce lokalne
```

Deploy na Vercel: push na main branch, Vercel automaticky builduje.
Env promenne nastavit ve Vercel dashboardu.
