# kristinafoto.cz — Claude Context

Next.js 16 + Supabase photography webapp. Czech language. Light theme, pink accent #e8306d.

## Stack
Next.js 16 App Router, React 19, TS 5, Tailwind 4, shadcn/ui base-nova (@base-ui/react), Supabase (auth+PG+RLS), Resend, Framer Motion, Zod 4, RHF 7, Tiptap, embla-carousel, yet-another-react-lightbox.

## Critical patterns

**shadcn base-nova Button**: No `asChild`. Use `render` prop:
```tsx
<Button render={<Link href="/foo" />}>Text</Button>
```

**Zod 4 + RHF**: No `.default()` on Zod schema fields. Set defaults in `useForm({ defaultValues })` instead. The `.default()` causes input/output type mismatch with `zodResolver`.

**Zod 4 enums**: Use `{ message: "..." }` not `{ required_error: "..." }`.

**Supabase types** (`src/lib/supabase/types.ts`): Every table MUST have `Relationships: []` array (even if empty) for @supabase/supabase-js v2.103.

**`useSearchParams`**: Must wrap in `<Suspense>` — split into inner component.

**Fonts**: Inter = `--font-sans` (body), Amatic SC = `--font-display` (headings). Use `font-display` Tailwind class on public `<h1>`/`<h2>`.

**Theme**: Light default in `:root`, dark in `.dark` class. CSS vars use oklch. Primary pink = `#e8306d`.

## File map

```
src/app/layout.tsx              Root: fonts, lang=cs, TooltipProvider, Toaster
src/app/page.tsx                Homepage: Hero + 5 sections + JSON-LD
src/app/(public)/layout.tsx     Header + Footer wrapper
src/app/(public)/portfolio/     Category pages + [slug] detail
src/app/(public)/kontakt/       ContactForm + contact info
src/app/(auth)/login/           Login with Suspense wrapper
src/app/admin/layout.tsx        AdminSidebar + auth check
src/app/admin/*/                CRUD pages (portfolio, klienti, blog, etc.)
src/app/klient/                 Client portal + galerie/[id]
src/components/ui/              shadcn base-nova components
src/components/sections/Hero.tsx  Canvas scroll animation (145 WebP frames)
src/lib/supabase/server.ts      SSR client (cookies)
src/lib/supabase/admin.ts       Service role client
src/lib/supabase/middleware.ts   Auth + role routing
src/lib/validations.ts          Zod schemas (no .default())
src/lib/constants.ts            NAV_ITEMS, CONTACT, SHOOT_TYPES
src/actions/contact.ts          Save inquiry + Resend emails
src/actions/auth.ts             Login/logout
middleware.ts                   Auth routing matcher
emails/InquiryNotification.tsx  React Email -> Kristina
emails/InquiryConfirmation.tsx  React Email -> client auto-reply
supabase/migrations/001_*       12 tables + RLS + triggers + seed
```

## DB tables
profiles, portfolio_categories, portfolio_galleries, portfolio_images, client_galleries, client_gallery_links, services, testimonials, blog_posts, booked_dates, inquiries, site_settings

## Routes (28)
Public: /, /portfolio, /portfolio/svatby, /portfolio/svatby/[slug], /portfolio/kapely-a-koncerty, /portfolio/kapely-a-koncerty/[slug], /portfolio/portrety, /sluzby-a-ceny, /o-mne, /reference, /blog, /blog/[slug], /kontakt
Auth: /login
Admin: /admin, /admin/portfolio, /admin/portfolio/[id], /admin/klienti, /admin/klienti/[id], /admin/poptavky, /admin/blog, /admin/blog/[id], /admin/sluzby, /admin/reference, /admin/kalendar, /admin/nastaveni
Client: /klient, /klient/galerie/[id]

## Env vars
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL, ADMIN_EMAIL, NEXT_PUBLIC_SITE_URL
