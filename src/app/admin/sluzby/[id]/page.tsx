"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceSchema, type ServiceValues } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";

export default function AdminServiceEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { is_published: true },
  });
  const isPublished = useWatch({ control, name: "is_published" });

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      if (!isNew) {
        const { data } = await supabase
          .from("services")
          .select("*")
          .eq("id", id)
          .single();
        if (data) {
          reset({
            title: data.title,
            slug: data.slug,
            description: data.description ?? "",
            price_text: data.price_text ?? "",
            is_published: data.is_published,
          });
          setFeatures(
            Array.isArray(data.features) ? (data.features as string[]) : []
          );
        }
      }
      setIsLoading(false);
    }
    load();
  }, [id, isNew, reset, supabase]);

  async function onSubmit(data: ServiceValues) {
    setIsSaving(true);
    const payload = {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      price_text: data.price_text || null,
      features: features.length > 0 ? features : null,
      is_published: data.is_published,
    };

    if (isNew) {
      const { error } = await supabase.from("services").insert(payload);
      if (error) toast.error("Nepodařilo se vytvořit službu.");
      else {
        toast.success("Služba vytvořena!");
        router.push("/admin/sluzby");
      }
    } else {
      const { error } = await supabase
        .from("services")
        .update(payload)
        .eq("id", id);
      if (error) toast.error("Nepodařilo se uložit.");
      else toast.success("Uloženo!");
    }
    setIsSaving(false);
  }

  async function onDelete() {
    if (!confirm("Opravdu smazat tuto službu?")) return;
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);
    if (error) toast.error("Nepodařilo se smazat.");
    else {
      toast.success("Služba smazána!");
      router.push("/admin/sluzby");
    }
  }

  function addFeature() {
    const val = newFeature.trim();
    if (val) {
      setFeatures((prev) => [...prev, val]);
      setNewFeature("");
    }
  }

  function removeFeature(index: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
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
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href="/admin/sluzby" />}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isNew ? "Nová služba" : "Upravit službu"}
        </h1>
        {!isNew && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Základní informace</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Název *</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && (
                    <p className="text-xs text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" {...register("slug")} />
                  {errors.slug && (
                    <p className="text-xs text-destructive">
                      {errors.slug.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Popis</Label>
                  <Textarea id="description" {...register("description")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_text">Cena (text)</Label>
                  <Input
                    id="price_text"
                    placeholder="např. od 5 000 Kč"
                    {...register("price_text")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Co zahrnuje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeFeature(i)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Nová položka..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={addFeature}>
                    Přidat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publikace</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published">Publikovat</Label>
                  <Switch
                    id="is_published"
                    checked={isPublished}
                    onCheckedChange={(val) => setValue("is_published", val)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isNew ? "Vytvořit" : "Uložit"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
