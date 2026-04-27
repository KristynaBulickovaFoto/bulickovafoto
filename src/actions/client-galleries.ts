"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

type NotifyResult = { success: boolean; error?: string; alreadySent?: boolean };

export async function notifyClientGalleryReady(
  galleryId: string
): Promise<NotifyResult> {
  const supabase = createAdminClient();

  const { data: gallery, error: galleryError } = await supabase
    .from("client_galleries")
    .select("id, client_id, title, description, notified_at")
    .eq("id", galleryId)
    .single();

  if (galleryError || !gallery) {
    return { success: false, error: "Galerie nenalezena." };
  }

  if (gallery.notified_at) {
    return { success: true, alreadySent: true };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", gallery.client_id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: "Klient nenalezen." };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://kristinafoto.cz";
  const portalUrl = `${siteUrl}/klient`;

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your-api-key") {
    return {
      success: false,
      error: "Resend není nakonfigurovaný — e-mail nebyl odeslán.",
    };
  }

  try {
    const { Resend } = await import("resend");
    const { default: ClientGalleryReady } = await import(
      "../../emails/ClientGalleryReady"
    );
    const { render } = await import("@react-email/components");

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? "noreply@kristynafoto.cz";

    const firstName = profile.full_name?.split(" ")[0] ?? "klient";

    const html = await render(
      ClientGalleryReady({
        clientName: firstName,
        galleryTitle: gallery.title,
        galleryDescription: gallery.description,
        portalUrl,
      })
    );

    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: profile.email,
      subject: `Vaše galerie ${gallery.title} je připravená`,
      html,
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      return { success: false, error: "Nepodařilo se odeslat e-mail." };
    }
  } catch (err) {
    console.error("Failed to send client gallery email:", err);
    return { success: false, error: "Nepodařilo se odeslat e-mail." };
  }

  const { error: updateError } = await supabase
    .from("client_galleries")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", galleryId);

  if (updateError) {
    console.error("Failed to mark notified_at:", updateError);
  }

  revalidatePath(`/admin/klienti/${gallery.client_id}`);
  return { success: true };
}
