import { redirect } from "next/navigation";
import { differenceInDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar, type AdminCounts } from "@/components/admin/AdminSidebar";
import { AdminTopbar, type ActivityItem } from "@/components/admin/AdminTopbar";
import type { SearchItem } from "@/components/admin/CommandPalette";

export const metadata = {
  title: "Admin | Kristýna Foto",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const todayIso = new Date().toISOString().slice(0, 10);

  const [
    { count: newInquiriesCount },
    { count: needsReplyCount },
    { count: clientsCount },
    { count: portfolioCount },
    { count: servicesCount },
    { count: testimonialsCount },
    { count: freeDatesCount },
    { count: blogDraftsCount },
    { data: searchInquiries },
    { data: searchClients },
    { data: searchPortfolio },
    { data: searchBlog },
    { data: searchServices },
    { data: recentInquiries },
    { data: recentGalleries },
    { data: recentBlog },
    { data: recentBookings },
  ] = await Promise.all([
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .in("status", ["new", "read"]),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "client"),
    supabase.from("portfolio_galleries").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase
      .from("booked_dates")
      .select("*", { count: "exact", head: true })
      .gte("date", todayIso),
    supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("is_published", false),
    supabase
      .from("inquiries")
      .select("id, name, email, shoot_type")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "client")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("portfolio_galleries")
      .select("id, title, slug, location")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("blog_posts")
      .select("id, title, slug, is_published")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("services").select("id, title").limit(50),
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
      .select("id, title, slug, is_published, published_at, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("booked_dates")
      .select("id, date, label, created_at")
      .gte("date", todayIso)
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const counts: AdminCounts = {
    newInquiries: newInquiriesCount ?? 0,
    needsReply: needsReplyCount ?? 0,
    clients: clientsCount ?? 0,
    freeDates: freeDatesCount ?? 0,
    portfolio: portfolioCount ?? 0,
    blogDrafts: blogDraftsCount ?? 0,
    services: servicesCount ?? 0,
    testimonials: testimonialsCount ?? 0,
  };

  const searchData: SearchItem[] = [
    ...(searchInquiries ?? []).map((r) => ({
      type: "inquiry" as const,
      id: r.id,
      title: r.name,
      subtitle: `${r.shoot_type} — ${r.email}`,
      href: `/admin/poptavky?id=${r.id}`,
    })),
    ...(searchClients ?? []).map((r) => ({
      type: "client" as const,
      id: r.id,
      title: r.full_name,
      subtitle: r.email,
      href: `/admin/klienti/${r.id}`,
    })),
    ...(searchPortfolio ?? []).map((r) => ({
      type: "portfolio" as const,
      id: r.id,
      title: r.title,
      subtitle: r.location ?? r.slug,
      href: `/admin/portfolio/${r.id}`,
    })),
    ...(searchBlog ?? []).map((r) => ({
      type: "blog" as const,
      id: r.id,
      title: r.title,
      subtitle: r.is_published ? "Publikováno" : "Koncept",
      href: `/admin/blog/${r.id}`,
    })),
    ...(searchServices ?? []).map((r) => ({
      type: "service" as const,
      id: r.id,
      title: r.title,
      href: `/admin/sluzby/${r.id}`,
    })),
  ];

  // Build merged activity feed
  const activity: ActivityItem[] = [];
  const now = new Date();

  for (const i of recentInquiries ?? []) {
    const isUrgent =
      (i.status === "new" || i.status === "read") &&
      differenceInDays(now, new Date(i.created_at)) >= 2;
    activity.push({
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
  for (const g of recentGalleries ?? []) {
    activity.push({
      id: `gal-${g.id}`,
      type: "gallery",
      title: g.notified_at
        ? `Galerie odeslána: ${g.title}`
        : `Nová klientská galerie: ${g.title}`,
      subtitle: g.notified_at ? undefined : "Čeká na odeslání",
      href: `/admin/klienti/${g.client_id}`,
      timestamp: g.notified_at ?? g.created_at,
      isUrgent:
        !g.notified_at &&
        differenceInDays(now, new Date(g.created_at)) >= 1,
    });
  }
  for (const b of recentBlog ?? []) {
    activity.push({
      id: `blog-${b.id}`,
      type: "blog",
      title: b.is_published
        ? `Publikováno: ${b.title}`
        : `Koncept: ${b.title}`,
      href: `/admin/blog/${b.id}`,
      timestamp: b.published_at ?? b.created_at,
    });
  }
  for (const bk of recentBookings ?? []) {
    activity.push({
      id: `bk-${bk.id}`,
      type: "booking",
      title: `Volný termín ${new Date(bk.date + "T00:00:00").toLocaleDateString("cs-CZ")}`,
      subtitle: bk.label ?? undefined,
      href: "/admin/kalendar",
      timestamp: bk.created_at,
    });
  }

  activity.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="light flex h-screen">
      <AdminSidebar counts={counts} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar
          profile={{
            full_name: profile.full_name,
            email: profile.email,
            avatar_url: profile.avatar_url,
          }}
          activity={activity}
          searchData={searchData}
        />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
