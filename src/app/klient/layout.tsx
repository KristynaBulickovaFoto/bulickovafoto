import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientHeader } from "@/components/client/ClientHeader";

export const metadata = {
  title: "Klientská zóna | Kristýna Foto",
  robots: { index: false, follow: false },
};

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/klient");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url, role")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login?redirect=/klient");

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader
        profile={{
          full_name: profile.full_name,
          email: profile.email,
          avatar_url: profile.avatar_url,
        }}
      />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
      <footer className="border-t border-border/30 py-6 text-center text-xs text-muted-foreground/50">
        &copy; Kristýna Bulíčková Fotografka
      </footer>
    </div>
  );
}
