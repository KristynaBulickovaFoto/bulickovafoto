"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(
  email: string,
  redirectTo?: string | null
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  const callbackUrl = new URL(
    "/auth/callback",
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  );
  if (redirectTo) {
    callbackUrl.searchParams.set("redirect", redirectTo);
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    console.error("Magic link error:", error);
    return { error: "Nepodařilo se odeslat přihlašovací odkaz." };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
