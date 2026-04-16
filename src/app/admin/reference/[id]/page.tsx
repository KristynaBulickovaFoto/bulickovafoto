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
import { testimonialSchema, type TestimonialValues } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";

export default function AdminTestimonialEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<TestimonialValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { is_published: true },
  });
  const isPublished = useWatch({ control, name: "is_published" });

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      if (!isNew) {
        const { data } = await supabase
          .from("testimonials")
          .select("*")
          .eq("id", id)
          .single();
        if (data) {
          reset({
            author_name: data.author_name,
            author_role: data.author_role ?? "",
            content: data.content,
            rating: data.rating ?? undefined,
            is_published: data.is_published,
          });
        }
      }
      setIsLoading(false);
    }
    load();
  }, [id, isNew, reset, supabase]);

  async function onSubmit(data: TestimonialValues) {
    setIsSaving(true);
    const payload = {
      author_name: data.author_name,
      author_role: data.author_role || null,
      content: data.content,
      rating: data.rating ?? null,
      is_published: data.is_published,
    };

    if (isNew) {
      const { error } = await supabase.from("testimonials").insert(payload);
      if (error) toast.error("Nepodařilo se vytvořit referenci.");
      else {
        toast.success("Reference vytvořena!");
        router.push("/admin/reference");
      }
    } else {
      const { error } = await supabase
        .from("testimonials")
        .update(payload)
        .eq("id", id);
      if (error) toast.error("Nepodařilo se uložit.");
      else toast.success("Uloženo!");
    }
    setIsSaving(false);
  }

  async function onDelete() {
    if (!confirm("Opravdu smazat tuto referenci?")) return;
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id);
    if (error) toast.error("Nepodařilo se smazat.");
    else {
      toast.success("Reference smazána!");
      router.push("/admin/reference");
    }
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
          render={<Link href="/admin/reference" />}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isNew ? "Nová reference" : "Upravit referenci"}
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
                <CardTitle>Obsah reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author_name">Jméno autora *</Label>
                  <Input id="author_name" {...register("author_name")} />
                  {errors.author_name && (
                    <p className="text-xs text-destructive">
                      {errors.author_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author_role">Role / typ focení</Label>
                  <Input
                    id="author_role"
                    placeholder="např. Nevěsta, Kapelník..."
                    {...register("author_role")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Text reference *</Label>
                  <Textarea id="content" rows={6} {...register("content")} />
                  {errors.content && (
                    <p className="text-xs text-destructive">
                      {errors.content.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Hodnocení (1–5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    {...register("rating", { valueAsNumber: true })}
                  />
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
