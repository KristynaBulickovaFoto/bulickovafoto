"use server";

import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { createAdminClient } from "@/lib/supabase/admin";

export async function submitInquiry(
  data: ContactFormValues
): Promise<{ success: boolean; error?: string }> {
  // Validate
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Neplatná data formuláře." };
  }

  // Honeypot check
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { success: true };
  }

  const supabase = createAdminClient();

  // Save to database
  const { error: dbError } = await supabase.from("inquiries").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    shoot_type: parsed.data.shoot_type,
    preferred_date: parsed.data.preferred_date ?? null,
    location: parsed.data.location ?? null,
    duration: parsed.data.duration ?? null,
    message: parsed.data.message ?? null,
    preferred_contact: parsed.data.preferred_contact,
  });

  if (dbError) {
    console.error("Failed to save inquiry:", dbError);
    return { success: false, error: "Nepodařilo se uložit poptávku." };
  }

  // Send emails via Resend (if configured)
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_your-api-key") {
    try {
      const { Resend } = await import("resend");
      const { default: InquiryNotification } = await import("../../emails/InquiryNotification");
      const { default: InquiryConfirmation } = await import("../../emails/InquiryConfirmation");
      const { render } = await import("@react-email/components");

      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@kristynafoto.cz";
      const adminEmail = process.env.ADMIN_EMAIL ?? "bulickovak@email.cz";

      // Notification to Kristýna
      const notificationHtml = await render(
        InquiryNotification({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          shootType: parsed.data.shoot_type,
          preferredDate: parsed.data.preferred_date,
          location: parsed.data.location,
          duration: parsed.data.duration,
          message: parsed.data.message,
          preferredContact: parsed.data.preferred_contact,
        })
      );

      await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `Nová poptávka: ${parsed.data.shoot_type} od ${parsed.data.name}`,
        html: notificationHtml,
      });

      // Auto-reply to the person
      const confirmationHtml = await render(
        InquiryConfirmation({ name: parsed.data.name })
      );

      await resend.emails.send({
        from: fromEmail,
        to: parsed.data.email,
        subject: "Děkuji za poptávku! | Kristýna Foto",
        html: confirmationHtml,
      });
    } catch (emailError) {
      // Email failure shouldn't fail the inquiry submission
      console.error("Failed to send email:", emailError);
    }
  }

  return { success: true };
}
