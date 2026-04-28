-- ============================================
-- Seed services / pricing
-- Idempotent — re-runnable via ON CONFLICT
-- ============================================

INSERT INTO services (slug, title, description, price_text, features, sort_order, is_published)
VALUES
  (
    'svatba-cely-den',
    'Svatba — celý den',
    'Pokrytí celého svatebního dne od přípravy až po večerní zábavu. Maximum vzpomínek, klid a profesionalita po vašem boku.',
    'od 28 000 Kč',
    '[
      "Až 10 hodin focení",
      "Příprava nevěsty i ženicha",
      "Obřad, gratulace, hostina",
      "300+ upravených fotografií",
      "Online galerie pro hosty",
      "Předání do 6 týdnů"
    ]'::jsonb,
    1,
    true
  ),
  (
    'svatba-mini',
    'Mini svatba',
    'Komornější varianta — ideální pro malou svatbu, registr, nebo když chcete jen klíčové momenty bez stresu.',
    'od 12 000 Kč',
    '[
      "4 hodiny focení",
      "Obřad + skupinové fotky",
      "150+ upravených fotografií",
      "Online galerie",
      "Předání do 4 týdnů"
    ]'::jsonb,
    2,
    true
  ),
  (
    'predsvatebni-focenu',
    'Předsvatební focení',
    'Romantická procházka před svatbou. Skvělá příležitost se vzájemně sladit a získat krásné fotky pro oznámení.',
    'od 4 500 Kč',
    '[
      "1,5 hodiny focení",
      "Lokace dle dohody",
      "60+ upravených fotografií",
      "Online galerie",
      "Předání do 3 týdnů"
    ]'::jsonb,
    3,
    true
  ),
  (
    'koncert-kapela',
    'Koncert / kapela',
    'Reportáž z koncertu, klubu nebo festivalu. Energie pódia, světla a publika v autentických snímcích.',
    'od 4 000 Kč',
    '[
      "Celé vystoupení",
      "Backstage + publikum",
      "100+ upravených fotografií",
      "Vhodné pro tisk i sociální sítě",
      "Předání do 2 týdnů"
    ]'::jsonb,
    4,
    true
  ),
  (
    'portret-rodina',
    'Portrét / rodina',
    'Portrétní focení v ateliéru nebo v exteriéru. Děti, partneři, rodiny — přirozeně a beze stresu.',
    'od 3 500 Kč',
    '[
      "1 hodina focení",
      "Lokace dle dohody",
      "40+ upravených fotografií",
      "Online galerie",
      "Předání do 3 týdnů"
    ]'::jsonb,
    5,
    true
  ),
  (
    'komercni',
    'Komerční / produktové',
    'Focení pro firmy, e-shopy, restaurace nebo osobní brand. Cena dle rozsahu projektu.',
    'individuálně',
    '[
      "Konzultace zdarma",
      "Produkty, prostory, lidé",
      "Komerční licence",
      "Cena dle rozsahu"
    ]'::jsonb,
    6,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price_text = EXCLUDED.price_text,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published;
