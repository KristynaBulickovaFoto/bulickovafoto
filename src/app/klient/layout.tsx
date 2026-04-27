import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/actions/auth";

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

  if (!user) {
    redirect("/login?redirect=/klient");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] ?? "klient";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/klient" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Kristýna Bulíčková Fotografka"
              width={140}
              height={70}
              className="h-9 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {profile?.full_name}
            </span>
            <form action={logout}>
              <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground">
                <LogOut className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Odhlásit</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Vítejte, {firstName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Zde najdete všechny vaše galerie a fotky
          </p>
        </div>

        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 text-center text-xs text-muted-foreground/50">
        &copy; Kristýna Bulíčková Fotografka
      </footer>
    </div>
  );
}
