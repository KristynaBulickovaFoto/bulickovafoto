"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
    about_text: "",
    hero_headline: "",
    hero_subheadline: "",
  });

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (data) {
        setForm({
          phone: data.phone ?? "",
          email: data.email ?? "",
          instagram: data.instagram ?? "",
          facebook: data.facebook ?? "",
          about_text: data.about_text ?? "",
          hero_headline: data.hero_headline ?? "",
          hero_subheadline: data.hero_subheadline ?? "",
        });
      }
      setIsLoading(false);
    }
    load();
  }, [supabase]);

  async function onSave() {
    setIsSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        phone: form.phone || null,
        email: form.email || null,
        instagram: form.instagram || null,
        facebook: form.facebook || null,
        about_text: form.about_text || null,
        hero_headline: form.hero_headline || null,
        hero_subheadline: form.hero_subheadline || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) toast.error("Nepodařilo se uložit.");
    else toast.success("Nastavení uloženo!");
    setIsSaving(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nastavení webu</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kontaktní údaje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input
                value={form.instagram}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Facebook URL</Label>
              <Input
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hlavní stránka</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Hero nadpis</Label>
              <Input
                value={form.hero_headline}
                onChange={(e) =>
                  setForm({ ...form, hero_headline: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Hero podnadpis</Label>
              <Input
                value={form.hero_subheadline}
                onChange={(e) =>
                  setForm({ ...form, hero_subheadline: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>O mně (text)</Label>
              <Textarea
                rows={8}
                value={form.about_text}
                onChange={(e) =>
                  setForm({ ...form, about_text: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Uložit nastavení
      </Button>
    </div>
  );
}
