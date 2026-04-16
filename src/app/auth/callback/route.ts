import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const dest =
          redirectTo && redirectTo.startsWith("/klient")
            ? redirectTo
            : "/klient";
        return NextResponse.redirect(`${origin}${dest}`);
      }
    }
  }

  // Auth failed — redirect to login
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
