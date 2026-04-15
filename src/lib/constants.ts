export const SITE_NAME = "Kristýna Foto";
export const SITE_URL = "https://kristynafoto.cz";
export const SITE_DESCRIPTION =
  "Fotografka svateb, koncertů a portrétů. Přerov & okolí. Autentické momenty, profesionální přístup.";

export const CONTACT = {
  phone: "+420 736 121 170",
  email: "bulickovak@email.cz",
  instagram: "https://instagram.com/fotografkakristynabulickova",
  facebook: "https://www.facebook.com/kristynafoto",
  location: "Přerov & okolí",
  areas: ["Přerov", "Olomouc", "Zlín", "Brno", "celá ČR"],
} as const;

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Úvod", href: "/" },
  {
    label: "Portfolio",
    href: "/portfolio",
    children: [
      { label: "Svatby", href: "/portfolio/svatby" },
      { label: "Kapely & koncerty", href: "/portfolio/kapely-a-koncerty" },
      { label: "Portréty", href: "/portfolio/portrety" },
    ],
  },
  { label: "Služby a ceny", href: "/sluzby-a-ceny" },
  { label: "O mně", href: "/o-mne" },
  { label: "Reference", href: "/reference" },
  { label: "Blog", href: "/blog" },
  { label: "Kontakt", href: "/kontakt" },
];

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "Images" },
  { label: "Klienti", href: "/admin/klienti", icon: "Users" },
  { label: "Poptávky", href: "/admin/poptavky", icon: "MessageSquare" },
  { label: "Blog", href: "/admin/blog", icon: "FileText" },
  { label: "Služby", href: "/admin/sluzby", icon: "Package" },
  { label: "Reference", href: "/admin/reference", icon: "Star" },
  { label: "Kalendář", href: "/admin/kalendar", icon: "CalendarDays" },
  { label: "Nastavení", href: "/admin/nastaveni", icon: "Settings" },
] as const;

export const SHOOT_TYPES = [
  { value: "wedding", label: "Svatba" },
  { value: "concert", label: "Koncert / kapela" },
  { value: "portrait", label: "Portrét" },
  { value: "couple", label: "Párové focení" },
  { value: "family", label: "Rodinné focení" },
  { value: "other", label: "Jiné" },
] as const;

export const INQUIRY_STATUSES = [
  { value: "new", label: "Nová", color: "bg-blue-500" },
  { value: "read", label: "Přečtená", color: "bg-yellow-500" },
  { value: "replied", label: "Odpovězená", color: "bg-green-500" },
  { value: "booked", label: "Zarezervovaná", color: "bg-primary" },
  { value: "archived", label: "Archivovaná", color: "bg-muted" },
] as const;
