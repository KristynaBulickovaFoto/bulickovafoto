import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Images, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: inquiryCount },
    { count: newInquiryCount },
    { count: galleryCount },
    { count: clientCount },
    { data: recentInquiries },
  ] = await Promise.all([
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("portfolio_galleries")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "client"),
    supabase
      .from("inquiries")
      .select("id, name, email, shoot_type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    {
      label: "Poptávky",
      value: inquiryCount ?? 0,
      icon: MessageSquare,
      badge: newInquiryCount ? `${newInquiryCount} nových` : undefined,
    },
    { label: "Galerie", value: galleryCount ?? 0, icon: Images },
    { label: "Klienti", value: clientCount ?? 0, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                {stat.badge && (
                  <Badge variant="secondary" className="text-primary">
                    {stat.badge}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Poslední poptávky</CardTitle>
        </CardHeader>
        <CardContent>
          {recentInquiries && recentInquiries.length > 0 ? (
            <div className="space-y-3">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{inquiry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {inquiry.email} • {inquiry.shoot_type}
                    </p>
                  </div>
                  <Badge
                    variant={
                      inquiry.status === "new" ? "default" : "secondary"
                    }
                  >
                    {inquiry.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Zatím žádné poptávky
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
