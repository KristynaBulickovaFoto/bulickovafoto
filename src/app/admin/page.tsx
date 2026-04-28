import Link from "next/link";
import { format, addDays, startOfDay, subDays, differenceInDays } from "date-fns";
import { cs } from "date-fns/locale";
import { ActivityFeed, type FeedItem } from "@/components/admin/ActivityFeed";
import { SiteHealth, type HealthIssue } from "@/components/admin/SiteHealth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Images,
  Users,
  CalendarDays,
  FileText,
  Star,
  Briefcase,
  Plus,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SHOOT_TYPES, INQUIRY_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const SHOOT_LABELS: Record<string, string> = Object.fromEntries(
  SHOOT_TYPES.map((s) => [s.value, s.label]),
);

export default async function AdminDashboard() {
  const supabase = await createClient();
  const today = startOfDay(new Date());
  const todayStr = format(today, "yyyy-MM-dd");
  const in90 = format(addDays(today, 90), "yyyy-MM-dd");

  const threeDaysAgo = subDays(today, 3).toISOString();
  const fourteenDaysAgo = subDays(today, 14).toISOString();
  const oneDayAgo = subDays(today, 1).toISOString();

  const [
    { count: inquiryCount },
    { count: newInquiryCount },
    { count: needsReplyCount },
    { data: inquiriesByStatus },
    { count: portfolioGalleryCount },
    { count: publishedPortfolioCount },
    { count: clientGalleryCount },
    { count: activeClientGalleryCount },
    { count: clientCount },
    { count: blogCount },
    { count: publishedBlogCount },
    { count: testimonialsCount },
    { count: servicesCount },
    { count: freeDatesCount },
    { data: recentInquiries },
    { data: upcomingDates },
    { data: recentClientGalleries },
    { data: staleInquiries },
    { data: pendingGalleries },
    { data: oldDrafts },
    { data: portfolioMissingCovers },
    { data: feedInquiries },
    { data: feedGalleries },
    { data: feedBlog },
    { data: feedBookings },
    { data: settings },
  ] = await Promise.all([
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .in("status", ["new", "read"]),
    supabase.from("inquiries").select("status"),
    supabase
      .from("portfolio_galleries")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("portfolio_galleries")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("client_galleries")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("client_galleries")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "client"),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase
      .from("booked_dates")
      .select("*", { count: "exact", head: true })
      .gte("date", todayStr)
      .lte("date", in90),
    supabase
      .from("inquiries")
      .select("id, name, email, phone, shoot_type, location, status, preferred_date, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("booked_dates")
      .select("id, date, label, is_confirmed")
      .gte("date", todayStr)
      .order("date", { ascending: true })
      .limit(8),
    supabase
      .from("client_galleries")
      .select("id, title, status, notified_at, created_at, client_id")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("inquiries")
      .select("id, name, created_at")
      .in("status", ["new", "read"])
      .lte("created_at", threeDaysAgo)
      .order("created_at", { ascending: true })
      .limit(10),
    supabase
      .from("client_galleries")
      .select("id, title, client_id, created_at")
      .is("notified_at", null)
      .lte("created_at", oneDayAgo)
      .limit(10),
    supabase
      .from("blog_posts")
      .select("id, title, updated_at")
      .eq("is_published", false)
      .lte("updated_at", fourteenDaysAgo)
      .limit(10),
    supabase
      .from("portfolio_galleries")
      .select("id, title")
      .eq("is_published", true)
      .is("cover_image_url", null)
      .limit(10),
    supabase
      .from("inquiries")
      .select("id, name, email, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("client_galleries")
      .select("id, title, client_id, notified_at, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("blog_posts")
      .select("id, title, is_published, published_at, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("booked_dates")
      .select("id, date, label, created_at")
      .gte("date", todayStr)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("site_settings")
      .select("phone, email, about_text, hero_headline, hero_image_url")
      .eq("id", 1)
      .maybeSingle(),
  ]);

  const statusCounts = INQUIRY_STATUSES.map((s) => ({
    ...s,
    count: inquiriesByStatus?.filter((i) => i.status === s.value).length ?? 0,
  }));

  const now = new Date();
  const issues: HealthIssue[] = [];

  for (const i of staleInquiries ?? []) {
    issues.push({
      id: `stale-inq-${i.id}`,
      severity: "high",
      icon: "mail",
      title: `Poptávka od ${i.name} čeká ${differenceInDays(now, new Date(i.created_at))} dní`,
      detail: "Odpověz nebo archivuj",
      href: `/admin/poptavky?id=${i.id}`,
    });
  }
  for (const g of pendingGalleries ?? []) {
    issues.push({
      id: `pending-gal-${g.id}`,
      severity: "high",
      icon: "send",
      title: `Galerie ${g.title} ještě nebyla odeslána`,
      detail: `Klientovi vytvořeno ${differenceInDays(now, new Date(g.created_at))} dní zpět`,
      href: `/admin/klienti/${g.client_id}`,
    });
  }
  for (const p of portfolioMissingCovers ?? []) {
    issues.push({
      id: `cover-${p.id}`,
      severity: "medium",
      icon: "image",
      title: `Portfolio "${p.title}" nemá obálkový obrázek`,
      href: `/admin/portfolio/${p.id}`,
    });
  }
  for (const d of oldDrafts ?? []) {
    issues.push({
      id: `draft-${d.id}`,
      severity: "low",
      icon: "file",
      title: `Starý koncept blogu: ${d.title}`,
      detail: `Naposledy upraveno ${differenceInDays(now, new Date(d.updated_at))} dní zpět`,
      href: `/admin/blog/${d.id}`,
    });
  }
  if (settings) {
    if (!settings.about_text) {
      issues.push({
        id: "no-about",
        severity: "low",
        icon: "file",
        title: "Chybí text 'O mně' v nastavení",
        href: "/admin/nastaveni",
      });
    }
    if (!settings.hero_image_url) {
      issues.push({
        id: "no-hero",
        severity: "low",
        icon: "image",
        title: "Chybí hero obrázek",
        href: "/admin/nastaveni",
      });
    }
    if (!settings.phone || !settings.email) {
      issues.push({
        id: "no-contact",
        severity: "medium",
        icon: "mail",
        title: "Chybí kontaktní údaje (telefon nebo e-mail)",
        href: "/admin/nastaveni",
      });
    }
  }

  const feed: FeedItem[] = [];
  for (const i of feedInquiries ?? []) {
    const isUrgent =
      (i.status === "new" || i.status === "read") &&
      differenceInDays(now, new Date(i.created_at)) >= 2;
    feed.push({
      id: `inq-${i.id}`,
      type: "inquiry",
      title:
        i.status === "new"
          ? `Nová poptávka od ${i.name}`
          : `Poptávka: ${i.name}`,
      subtitle: i.email,
      href: `/admin/poptavky?id=${i.id}`,
      timestamp: i.created_at,
      isUrgent,
    });
  }
  for (const g of feedGalleries ?? []) {
    feed.push({
      id: `gal-${g.id}`,
      type: "gallery",
      title: g.notified_at
        ? `Galerie odeslána: ${g.title}`
        : `Nová galerie: ${g.title}`,
      subtitle: g.notified_at ? undefined : "Čeká na odeslání",
      href: `/admin/klienti/${g.client_id}`,
      timestamp: g.notified_at ?? g.created_at,
      isUrgent:
        !g.notified_at && differenceInDays(now, new Date(g.created_at)) >= 1,
    });
  }
  for (const b of feedBlog ?? []) {
    feed.push({
      id: `blog-${b.id}`,
      type: "blog",
      title: b.is_published
        ? `Publikováno: ${b.title}`
        : `Koncept: ${b.title}`,
      href: `/admin/blog/${b.id}`,
      timestamp: b.published_at ?? b.created_at,
    });
  }
  for (const bk of feedBookings ?? []) {
    feed.push({
      id: `bk-${bk.id}`,
      type: "booking",
      title: `Volný termín ${format(new Date(bk.date + "T00:00:00"), "d. M. yyyy", { locale: cs })}`,
      subtitle: bk.label ?? undefined,
      href: "/admin/kalendar",
      timestamp: bk.created_at,
    });
  }
  feed.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const stats = [
    {
      label: "Poptávky",
      value: inquiryCount ?? 0,
      icon: MessageSquare,
      href: "/admin/poptavky",
      hint:
        needsReplyCount && needsReplyCount > 0
          ? `${needsReplyCount} čeká na odpověď`
          : "Vše vyřízeno",
      badge: newInquiryCount ? `${newInquiryCount} nových` : undefined,
      accent: "text-pink-600",
    },
    {
      label: "Volné termíny",
      value: freeDatesCount ?? 0,
      icon: CalendarDays,
      href: "/admin/kalendar",
      hint: "Příštích 90 dní",
      accent: "text-emerald-600",
    },
    {
      label: "Klientské galerie",
      value: activeClientGalleryCount ?? 0,
      icon: Images,
      href: "/admin/klienti",
      hint: `${clientGalleryCount ?? 0} celkem`,
      accent: "text-violet-600",
    },
    {
      label: "Klienti",
      value: clientCount ?? 0,
      icon: Users,
      href: "/admin/klienti",
      hint: "Registrovaní",
      accent: "text-sky-600",
    },
    {
      label: "Portfolio",
      value: publishedPortfolioCount ?? 0,
      icon: Briefcase,
      href: "/admin/portfolio",
      hint: `${portfolioGalleryCount ?? 0} galerií`,
      accent: "text-amber-600",
    },
    {
      label: "Blog",
      value: publishedBlogCount ?? 0,
      icon: FileText,
      href: "/admin/blog",
      hint: `${(blogCount ?? 0) - (publishedBlogCount ?? 0)} v konceptu`,
      accent: "text-indigo-600",
    },
    {
      label: "Reference",
      value: testimonialsCount ?? 0,
      icon: Star,
      href: "/admin/reference",
      hint: "Hodnocení klientů",
      accent: "text-yellow-600",
    },
    {
      label: "Služby",
      value: servicesCount ?? 0,
      icon: Briefcase,
      href: "/admin/sluzby",
      hint: "Aktuální nabídka",
      accent: "text-rose-600",
    },
  ];

  const quickActions = [
    { label: "Nová galerie portfolia", href: "/admin/portfolio", icon: Images },
    { label: "Nový blog článek", href: "/admin/blog", icon: FileText },
    { label: "Nová služba", href: "/admin/sluzby", icon: Briefcase },
    { label: "Volný termín", href: "/admin/kalendar", icon: CalendarDays },
    { label: "Nová reference", href: "/admin/reference", icon: Star },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {format(today, "EEEE d. MMMM yyyy", { locale: cs })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <Button
              key={a.href}
              size="sm"
              variant="outline"
              render={<Link href={a.href} />}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Inquiry status pills */}
      <div className="flex flex-wrap gap-2">
        {statusCounts.map((s) => (
          <Link
            key={s.value}
            href={`/admin/poptavky?status=${s.value}`}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            <span className={cn("h-2 w-2 rounded-full", s.color)} />
            {s.label}
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
              {s.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl bg-card ring-1 ring-foreground/10 p-4 transition-all hover:ring-foreground/30 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <stat.icon className={cn("h-4 w-4", stat.accent)} />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">{stat.value}</span>
              {stat.badge && (
                <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                  {stat.badge}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{stat.hint}</p>
          </Link>
        ))}
      </div>

      {/* Health + Activity row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SiteHealth issues={issues} />
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Aktivita</CardTitle>
              <CardDescription>Co se naposledy stalo</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={feed.slice(0, 10)} />
          </CardContent>
        </Card>
      </div>

      {/* Two columns: inquiries + upcoming dates */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent inquiries */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Poslední poptávky</CardTitle>
              <CardDescription>Nejnovějších 6 zpráv</CardDescription>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/admin/poptavky" />}>
              Vše
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentInquiries && recentInquiries.length > 0 ? (
              <div className="space-y-2">
                {recentInquiries.map((inquiry) => {
                  const status = INQUIRY_STATUSES.find((s) => s.value === inquiry.status);
                  return (
                    <Link
                      key={inquiry.id}
                      href={`/admin/poptavky?id=${inquiry.id}`}
                      className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold">{inquiry.name}</p>
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-normal"
                            >
                              {SHOOT_LABELS[inquiry.shoot_type] ?? inquiry.shoot_type}
                            </Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {inquiry.email}
                            </span>
                            {inquiry.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {inquiry.phone}
                              </span>
                            )}
                            {inquiry.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {inquiry.location}
                              </span>
                            )}
                            {inquiry.preferred_date && (
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {format(new Date(inquiry.preferred_date), "d. M. yyyy", {
                                  locale: cs,
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-right">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                            <span className={cn("h-1.5 w-1.5 rounded-full", status?.color)} />
                            {status?.label ?? inquiry.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {format(new Date(inquiry.created_at), "d. M.", { locale: cs })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Zatím žádné poptávky
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming dates + recent galleries */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Nadcházející termíny</CardTitle>
                <CardDescription>Volné dny v kalendáři</CardDescription>
              </div>
              <Button variant="ghost" size="sm" render={<Link href="/admin/kalendar" />}>
                <CalendarDays className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingDates && upcomingDates.length > 0 ? (
                <ul className="space-y-1.5">
                  {upcomingDates.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-muted"
                    >
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          d.is_confirmed ? "bg-emerald-500" : "bg-amber-500",
                        )}
                      />
                      <span className="font-medium">
                        {format(new Date(d.date + "T00:00:00"), "EEE d. M.", {
                          locale: cs,
                        })}
                      </span>
                      {d.label && (
                        <span className="truncate text-muted-foreground">
                          — {d.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  Žádné volné termíny —{" "}
                  <Link href="/admin/kalendar" className="text-primary underline">
                    přidat
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Klientské galerie</CardTitle>
                <CardDescription>Naposledy přidané</CardDescription>
              </div>
              <Button variant="ghost" size="sm" render={<Link href="/admin/klienti" />}>
                <Users className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentClientGalleries && recentClientGalleries.length > 0 ? (
                <ul className="space-y-1.5">
                  {recentClientGalleries.map((g) => (
                    <li key={g.id}>
                      <Link
                        href={`/admin/klienti/${g.client_id}`}
                        className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-muted"
                      >
                        <span className="truncate font-medium">{g.title}</span>
                        <span className="flex shrink-0 items-center gap-1.5">
                          {g.notified_at ? (
                            <Badge variant="secondary" className="text-[9px]">
                              odesláno
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 text-[9px]">
                              čeká
                            </Badge>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  Žádné galerie
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
