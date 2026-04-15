# Výzkum online stopy fotografky a návrh webu kristynafoto.cz

## Současná online stopa a konzistence značky

Z veřejně dostupných zdrojů je patrné, že Kristýna Bulíčková dnes funguje primárně přes sociální sítě a externí galerie, a už v minulosti měla jednoduchý osobní web. Hlavní kontaktní a identifikační údaje pro web (doména kristynafoto.cz) jsou:
- **Instagram:** fotografkakristynabulickova
- **Facebook:** https://www.facebook.com/kristynafoto
- **E-mail:** bulickovak@email.cz
- **Telefon:** 736 121 170

Na starším webu (vytvořeném pomocí entity["company","Webnode","cms platform"]) je dále deklarovaný okruh působnosti (např. entity["city","Zlín","cz"], entity["city","Přerov","cz"], entity["city","Olomouc","cz"] a okolí). citeturn8view3turn3view0

Ve vyhledávači je vidět i facebooková stránka pod názvem „Fotografka Kristýna Bulíčková“ s uvedeným zaměřením na rodinné, těhotenské, svatební, párové a portrétní focení (a veřejně viditelnými metrikami profilu jako „likes“ a „talking about“, které se mohou v čase měnit). citeturn5search12turn13search3

Dále je dohledatelný instagramový profil s bio, které explicitně zmiňuje svatby, koncerty a portréty, a uvádí lokalitu „Přerov & okolí“ (opět včetně metrik typu počet příspěvků/sledujících v čase dotazu). citeturn2search2

Pro prezentaci „full alb“ používá entity["company","Zonerama","photo hosting platform"]: veřejná stránka profilu zobrazuje název profilu a souhrnné číselné ukazatele (bez jasných popisků, ale je zřejmé, že jde o rozsáhlý archiv). citeturn4view0  
Zároveň je vidět stopa na platformě entity["company","MyWed","wedding vendor marketplace"] (profil s cenovou informací „starting from 1850 CZK per hour“ a minimálním časem focení „9 hours“ – detaily mohou být aktualizované provozovatelem profilu). citeturn3view2

Vedle toho existuje i účet na entity["company","Rajče","czech photo sharing service"] se základními metrikami (např. počet alb a zhlédnutí) a seznamem alb, který ale působí spíše jako starší/okrajový kanál než hlavní komerční portfolio. citeturn14view0

Poznámka k úplnosti dat: přímé rozkliknutí některých sociálních profilů bylo technicky omezené, proto jsou část informací převzaté z indexovaných náhledů ve vyhledávání. citeturn5search12turn2search2

## Positioning a důkazy práce

Na starším „O mně“ textu je jasně popsaný osobní příběh (začátky kolem ~10 let díky foťáku v rodině), postup od krajin/objektů k portrétům, a zlom v podobě první svatby, po které se rozjela „kariéra svatební fotografky“. Zároveň je tam explicitní ambice dál se specializovat na svatební fotografii. citeturn19view2

Z veřejné stopy ale vychází ještě silný druhý pilíř: koncertní/kapelní fotografie. V indexovaných příspěvcích jsou opakovaně odkazy na „full album“ uložené v externí galerii, včetně konkrétních akcí a interpretů – např. entity["musical_artist","entity[\"musical_artist\",\"Panoptiko\",\"czech band\"]","czech band"] v entity["city","Brno","cz"] / Sono Music Club (v příspěvku je explicitně uvedeno „full album“ v Zoneramě). citeturn5search0turn5search7  
Stejně tak jsou dohledatelné posty na koncerty entity["musical_artist","Dark Gamballe","czech band"] (sdílené jako „celé album“) i další koncertní/akční obsah. citeturn5search1turn5search14  
Objevují se i další kapelní/akční reference („Protheus v Sklub… full album…“, případně zmínky o dalších kapelách a show). citeturn5search2turn5search4turn5search15

Jak to přetavit do značky (aby web budoval důvěru a zároveň neředil nabídku):

- Základní positioning může být postavený jako „dvojdomá“ specializace: **svatby (příběh, emoce, dokument)** + **koncerty/kapely (energie, světla, moment)**, doplněná o portrét/rodinu jako stabilní „mezi-sezónní“ produkt. citeturn2search2turn5search12turn19view2
- Web musí „ukázat důkaz“ rychle: ideálně už na úvodu mít dvě jasné vstupní brány (Svatby / Kapely) – protože lidé se na webu typicky rozhodují rychle a skenují místo čtení. citeturn26view0turn26view2

## Struktura webu pro kristynafoto.cz

Cíl webu, jak ho popisujete: být **brandový hub** a **konverzní nástroj** (návštěvník má během pár minut pochopit co fotí, vidět kvalitu, a mít snadnou cestu k poptávce).

Aby to fungovalo ve vyhledávání, je vhodné, aby web měl jasnou informační architekturu a samostatné stránky pro hlavní služby (ne jen jednu nekonečnou stránku). entity["company","Google","technology company"] ve svých „Search Essentials“ výslovně doporučuje používat slova, která lidé hledají, a dávat je do prominentních míst (title, hlavní nadpis, alt text apod.). citeturn18view0turn18view1

Doporučený sitemap (minimalistický, ale SEO-čitelný):

- **Úvod**: jasná zpráva „kdo jsem / co fotím / pro koho / kde“ + 2 CTA (Svatby, Kapely) + nejrychlejší kontakt. citeturn26view2turn26view0  
- **Portfolio**
  - „Svatby“ (kurátorovaný výběr + 3–6 svatebních příběhů)
  - „Kapely & koncerty“ (kurátorovaný výběr + příběhy/galerie z vybraných akcí)
  - „Portréty / páry / rodina“ (zvlášť nebo jako jedna stránka podle toho, co chcete prioritizovat) citeturn5search12turn2search2  
- **Služby a ceny**: jednoduché balíčky, co je v ceně, co je navíc, jak probíhá spolupráce. (Cenová kotva se dá opřít o veřejný ceníkový údaj z marketplace profilu, pokud ho chcete komunikovat konzistentně.) citeturn3view2  
- **O mně**: krátký příběh + fotka + hodnoty + „jak pracuji“ (aby se zvedla důvěra). citeturn19view2  
- **Reference**: krátké citace klientů / pořadatelů (autentické, dohledatelné) + loga/zmínky (pokud máte souhlas).  
- **Blog / články** (volitelné, ale silné pro SEO): „Jak vybrat svatebního fotografa“, „Jak se připravit na párové focení“, „Co potřebuje pořadatel od fotografa na koncert“ apod. citeturn18view1  
- **Kontakt**: formulář + rychlý kontakt (e-mail: bulickovak@email.cz, telefon: 736 121 170) a odkazy na sítě (IG, FB) + jednoduché „kde fotím“. citeturn8view3turn3view0

Technická poznámka k doméně: pro registraci .cz domény je potřeba vybrat registrátora (registrace se nedělá přímo u entity["organization","CZ.NIC","cz domain registry"]), a dostupnost domény se standardně ověřuje přes WHOIS vyhledávání. citeturn25search15turn25search3

## Funkce webu pro poptávky a zákaznický workflow

Minimalistický web neznamená „málo funkcí“, ale „málo tření“. Z praxe UX výzkumu platí, že lidé weby skenují a snadno přehlédnou důležité věci, pokud nejsou vizuálně zvýrazněné; je proto klíčové dát **nejdůležitější akce (kontakt/poptávka)** do vizuálně dominantních prvků a do horní části stránky. citeturn26view2turn26view0

Funkce, které dávají smysl pro fotografku s vaším mixem svatby/koncerty:

**Poptávkový formulář jako „brief sběrač“**  
Formulář by neměl být jen „jméno/e-mail“, ale měl by sbírat minimum informací, které výrazně zrychlí odpověď:
typ focení (svatba/kapela/portrét), datum, místo, časový rozsah, očekávání (reportáž vs. stylizace), a preferovaný kontakt. Tím se snižuje potřeba dlouhého dopisování a roste šance na rychlou konverzi.

**Rychlé kontakty jedním klikem**  
Na webu je vhodné opřít se o definované kontakty (telefon: 736 121 170 a e-mail: bulickovak@email.cz), ideálně viditelně už v hlavičce a opakovaně v CTA blocích. K tomu přidat i přímé prokliky na Instagram a Facebook. citeturn8view3turn3view0

**Soukromé galerie pro klienty / kapely**  
Tady máte výhodu: platforma, kterou už používá, má funkce typu veřejné/soukromé i heslem chráněné album a sdílení přes odkazy. citeturn20view0  
To lze přetavit na stránku „Pro klienty“, kde:
- buď hostujete galerie přímo na webu (vlastní řešení),
- nebo embedujete/zrcadlíte externí galerii (když to platforma umožní „bez odkazů“ přímo na webu). citeturn20view0

**„Volné termíny“ nebo „Rezervace“**  
Nemusí to být plný booking systém. Stačí jednoduchá stránka s průběžně aktualizovaným seznamem (měsíc/rok) + CTA „ověřit dostupnost“, aby se omezily dotazy typu „máš volno?“. Pro svatby je to obzvlášť užitečné. citeturn19view2

**Důvěryhodnost: reference + konkrétní práce**  
U koncertů je silný prvek to, že už existují dohledatelné „full album“ posty k reálným akcím/interpre­tům. Web by měl mít „case studies“ (1 akce = 1 stránka), které lze sdílet i pořadatelům. citeturn5search0turn5search1turn5search2

## SEO a vyhledatelnost, které reálně boostnou brand

Tohle je část, která udělá z webu „brand“ i „traffic“:

**Title a nadpisy**  
Title je často hlavní věc, podle které se rozhoduje o prokliku. Doporučení je mít na každé stránce title, psát ho stručně a popisně a vyhnout se „keyword stuffing“. citeturn17view1  
Prakticky: „Svatby | Kristina Foto“ je lepší než „Home“, a „Koncertní fotografka – kapely a festivaly“ je lepší než neurčité „Portfolio“. citeturn17view1

**Meta description a snippet kontrola**  
Vyhledávač obvykle generuje snippet z obsahu stránky, ale někdy použije meta description, pokud lépe popisuje obsah. Doporučení je mít unikátní, výstižné meta description hlavně pro klíčové stránky (Úvod, Svatby, Kapely, Kontakt). citeturn17view0

**Strukturovaná data (schema) pro „brand panel“ a lepší identifikaci**  
Na homepage je vhodné přidat Organization/LocalBusiness markup: může pomoct vyhledávači lépe pochopit identitu a např. „které logo“ má asociovat se značkou, a doporučuje se přidat relevantní vlastnosti jako URL, telefon, e-mail a odkazy „sameAs“ na profily. citeturn16view2turn23search0  
Současně ale platí: strukturovaná data nezaručují, že se rich výsledky zobrazí, a musí odpovídat viditelnému obsahu stránky (jinak hrozí neuznání/penalizace použití feature). citeturn17view2

**Obrázky: alt text, názvy souborů, relevance u fotek**  
Pro fotografický web je to extrémně důležité. Doporučení zahrnuje:
- popisné názvy souborů a umístění fotek blízko relevantního textu,
- kvalitní alt text, který pomáhá jak vyhledávání, tak přístupnosti; zároveň se vyhnout „keyword stuffing“ v alt. citeturn16view1  
Po stránce přístupnosti je „textová alternativa pro netextový obsah“ základní princip WCAG – takže alt text není jen SEO, ale i požadavek na vnímatelnost obsahu pro část uživatelů. citeturn21view3

**Mobile-first a neschovávat klíčový obsah za klik**  
Indexace a ranking se opírají o mobilní verzi. Doporučení je používat responzivní web (Google ho explicitně doporučuje jako nejjednodušší pattern) a hlavně neloadovat primární obsah až po uživatelské interakci, protože crawler nekliká. citeturn24view0turn24view1

**Rychlost a Core Web Vitals**  
U portfolia s velkými fotkami je performance klíčová. Google přímo odkazuje na Core Web Vitals (LCP, INP, CLS) jako metriky, které je vhodné měřit a optimalizovat. citeturn17view3turn10search7

**Lokální vyhledávání a autorita značky**  
Pro svatby/rodiny je lokální dohledatelnost zásadní. Google uvádí, že u lokálních výsledků hrají roli relevance, distance a prominence, a že kompletní a přesné údaje v Business Profile zvyšují šanci zobrazení ve výsledcích; prominence se opírá i o faktory typu odkazy a recenze. citeturn16view0  
Z praktického pohledu to znamená: web + konzistentní NAP (name/address/phone) + aktivní profil + udržované recenze = výrazně lepší „brand realness“ ve vyhledávání. citeturn16view0turn8view3

**Co nedělat**  
Meta keywords nejsou pro rank relevantní (Google je ignoruje), takže energii je lepší dát do obsahu, title, struktury a výkonu. citeturn18view2

## Vizuální systém pro minimalistický web podle jejího loga

Z dodaného loga je zřejmý styl: **černý základ + bílá typografie + výrazný růžový akcent** a jednoduchá ikonografie fotoaparátu. To je dobrý základ pro minimalistický web, protože umožňuje jasnou vizuální hierarchii: akční prvky (CTA) lze dělat akcentní barvou a zbytek nechat „tichý“. citeturn26view2turn18view3

Minimalismus by ale měl být „funkční minimalismus“ (odstranit vše, co nepomáhá cíli uživatele), ne minimalismus na úkor čitelnosti. Nielsen Norman Group popisuje minimalismus jako směr navázaný i na heuristiky použitelnosti (eliminace irelevantních informací). citeturn18view3  
Současně upozorňuje, že nízký kontrast (typicky šedé texty na šedém) snižuje čitelnost i dohledatelnost prvků a je problém pro přístupnost. citeturn26view1turn21view3

Pro „web jako image“ je extrémně podstatné, aby:
- nahoře byl jasný headline (1 věta), 2 vstupní cesty (Svatby / Kapely) a viditelný kontakt (lidé skenují a horní část dostává nejvíc pozornosti), citeturn26view0turn26view2  
- portfolio bylo kurátorované (méně, ale nejlepší), protože to podporuje dojem profesionality a zároveň rychlost načítání, citeturn17view3turn18view1  
- a aby byl styl konzistentní: stejné rozestupy, stejný tón textu, stejná práce s akcentní barvou (zvýší se „brand memory“). citeturn26view2turn18view3

image_group{"layout":"carousel","aspect_ratio":"16:9","query":["minimalist photographer website design black background","wedding photographer website minimal portfolio","concert photographer portfolio website design","minimal photography logo website pink accent"],"num_per_query":1}

Technický detail, který přímo souvisí s logem: pokud budete dávat logo do strukturovaných dat a obecně pro vyhledávače, Google u Organization markup zmiňuje minimální velikost a praktickou potřebu, aby logo vypadalo dobře i na čistě bílém pozadí (proto je dobré mít i variantu pro světlý podklad, případně s obrysem). citeturn16view2

## Ochrana osobních údajů, cookies a důvěryhodnost webu

Pokud web poběží minimalisticky bez marketingových skriptů třetích stran, dá se cookie vrstva udržet velmi jednoduchá. entity["organization","Úřad pro ochranu osobních údajů","czech data protection authority"] uvádí, že pokud používáte pouze technické cookies, cookie lišta není nutná; současně je ale potřeba splnit informační povinnost vhodným způsobem. citeturn21view0turn21view1

Jakmile ale nasadíte netechnické cookies (typicky analytika/marketing), je potřeba souhlas; a klíčové je, aby odmítnutí bylo stejně jednoduché jako udělení (tlačítko „Odmítnout vše“ ve stejné vrstvě jako „Souhlasím“), jinak je souhlas problematický. citeturn21view0turn21view1

Doporučené minimum na webu:
- krátká „Ochrana soukromí“ stránka (co sbírá kontaktní formulář, proč, na jak dlouho, kam jde e-mail),
- přehledná cookie informace (pokud nějaké netechnické cookies budou),
- a v patičce konzistentní kontaktní údaje. citeturn8view3turn21view1turn21view0