"use server";

import { createAdminClient } from "@/lib/supabase/admin";

type CreateClientInput = {
  full_name: string;
  email: string;
  phone?: string;
};

type CreateClientResult = {
  success: boolean;
  error?: string;
};

export async function createClientUser(
  input: CreateClientInput
): Promise<CreateClientResult> {
  const { full_name, email, phone } = input;

  if (!full_name || full_name.length < 2) {
    return { success: false, error: "Jméno musí mít alespoň 2 znaky." };
  }
  if (!email || !email.includes("@")) {
    return { success: false, error: "Zadejte platný e-mail." };
  }

  const supabase = createAdminClient();

  // Create auth user — handle_new_user trigger creates profile automatically
  // No password needed — client logs in via magic link
  const { error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      full_name,
      role: "client",
    },
  });

  if (error) {
    if (error.message.includes("already been registered")) {
      return { success: false, error: "Uživatel s tímto e-mailem již existuje." };
    }
    console.error("Failed to create client:", error);
    return { success: false, error: "Nepodařilo se vytvořit klienta." };
  }

  // Update phone if provided (trigger only sets name, email, role)
  if (phone) {
    await supabase
      .from("profiles")
      .update({ phone })
      .eq("email", email);
  }

  return { success: true };
}
