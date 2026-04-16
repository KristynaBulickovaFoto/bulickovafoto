# Admin panel — kristinafoto.cz

Pristup: `/admin` (vyzaduje prihlaseni s roli `admin`).

## Dashboard (`/admin`)

- Statistiky: pocet poptavek (+ nove), galerii, klientu
- Posledni poptavky (5 nejnovejsich)

## Portfolio (`/admin/portfolio`)

- **Seznam** vsech galerii s kategorii, datem, stavem (publikovano/koncept)
- **Vytvorit** novou galerii (tlacitko "Nova galerie" → `/admin/portfolio/new`)
- **Upravit** galerii — nazev, slug, kategorie, popis, datum, misto, SEO, publikace, featured
- **Smazat** galerii (cervene tlacitko kosu na edit strance, smaze i vsechny fotky)

## Blog (`/admin/blog`)

- **Seznam** clanku se stavem a datem publikace
- **Vytvorit** novy clanek (`/admin/blog/new`)
- **Upravit** clanek — nazev, slug, urvek, SEO, publikace
- **Smazat** clanek (cervene tlacitko kosu na edit strance)
- Tiptap WYSIWYG editor bude doplnen v dalsi fazi (zatim placeholder)

## Poptavky (`/admin/poptavky`)

- **Seznam** vsech poptavek z kontaktniho formulare
- **Zmena stavu** primo v tabulce (dropdown: Nova → Prectena → Odpovedena → Zarezervovana → Archivovana)
- **Detail** — klik na jmeno nebo oko otevri bocni panel (Sheet) s:
  - Kontaktni udaje (jmeno, email, telefon)
  - Podrobnosti foceni (typ, datum, misto, delka)
  - Plny text zpravy
  - Preferovany kontakt
  - Zmena stavu
- **Smazat** poptavku (cerveny kos v tabulce nebo v detailu)

## Sluzby a ceny (`/admin/sluzby`)

- **Seznam** sluzeb s cenou a stavem
- **Vytvorit** novou sluzbu (`/admin/sluzby/new`)
- **Upravit** sluzbu — nazev, slug, popis, cena (text), seznam polozek (co zahrnuje), publikace
- **Smazat** sluzbu (cerveny kos v seznamu nebo na edit strance)
- Polozky "co zahrnuje" se pridavaji dynamicky (Enter nebo tlacitko Pridat)

## Reference (`/admin/reference`)

- **Seznam** referenci s autorem, roli, hodnocenim, stavem
- **Vytvorit** novou referenci (`/admin/reference/new`)
- **Upravit** referenci — jmeno autora, role, text, hodnoceni 1-5, publikace
- **Smazat** referenci (cerveny kos v seznamu nebo na edit strance)

## Kalendar dostupnosti (`/admin/kalendar`)

- **Vizualni kalendar** (4 mesice dopredu) s vyznacenymi obsazenymi terminy
- **Pridat termin** — formular s datem, popisem a prepinac "Potvrzeno"
- **Tabulka** vsech terminu s moznosti:
  - Prepnout potvrzeni/predbezne (klik na badge)
  - **Smazat** termin (cerveny kos)

## Klienti (`/admin/klienti`)

- **Seznam** vsech klientu (role = client) s kontaktem a datem registrace
- **Vytvorit klienta** (tlacitko "Novy klient") — dialog s:
  - Jmeno a prijmeni
  - E-mail
  - Telefon (volitelne)
  - Po vytvoreni se zobrazi vygenerovane heslo (12 znaku) — zobrazí se pouze jednou!
  - Heslo se da zkopirovat jednim klikem a poslat klientovi
  - Klient se pak prihlasi na `/login` a dostane se do klientskeho portalu
- **Detail klienta** (`/admin/klienti/[id]`) obsahuje:
  - Kontaktni informace
  - Sprava galerii:
    - **Vytvorit galerii** (dialog — nazev, popis)
    - **Prepnout stav** galerie (aktivni/archivovana — klik na badge)
    - **Pridat odkaz** do galerie (dialog — popis, URL, typ: galerie/ke stazeni/vyber/jine)
    - **Smazat odkaz** z galerie
    - **Smazat galerii** (smaze i vsechny odkazy)

## Nastaveni (`/admin/nastaveni`)

- Kontaktni udaje: telefon, email, Instagram, Facebook
- Hlavni stranka: hero nadpis, hero podnadpis
- O mne: text (textarea)
- **Ulozit** — vsechny zmeny se ulozi najednou

## Technicke poznamky

- Admin stranky pouzivaji klientske komponenty (React Hook Form + Supabase client)
- Vsechny destruktivni akce (smazani) vyzaduji potvrzeni pres `confirm()`
- Zmeny se projevuji okamzite v UI (optimistic update ve stavu)
- Pristup chrani middleware (`src/lib/supabase/middleware.ts`) — kontrola role v `profiles` tabulce
