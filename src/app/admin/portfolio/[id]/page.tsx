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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  portfolioGallerySchema,
  type PortfolioGalleryValues,
} from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

export default function AdminPortfolioEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Tables<"portfolio_categories">[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<PortfolioGalleryValues>({
    resolver: zodResolver(portfolioGallerySchema),
    defaultValues: {
      is_published: false,
      is_featured: false,
    },
  });
  const categoryId = useWatch({ control, name: "category_id" });
  const isPublished = useWatch({ control, name: "is_published" });
  const isFeatured = useWatch({ control, name: "is_featured" });

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: cats } = await supabase
        .from("portfolio_categories")
        .select("*")
        .order("sort_order");
      setCategories(cats ?? []);

      if (!isNew) {
        const { data: gallery } = await supabase
          .from("portfolio_galleries")
          .select("*")
          .eq("id", id)
          .single();

        if (gallery) {
          reset({
            title: gallery.title,
            slug: gallery.slug,
            category_id: gallery.category_id ?? "",
            description: gallery.description ?? "",
            date: gallery.date ?? "",
            location: gallery.location ?? "",
            is_published: gallery.is_published,
            is_featured: gallery.is_featured,
            seo_title: gallery.seo_title ?? "",
            seo_description: gallery.seo_description ?? "",
          });
        }
      }
      setIsLoading(false);
    }
    load();
  }, [id, isNew, reset, supabase]);

  async function onSubmit(data: PortfolioGalleryValues) {
    setIsSaving(true);

    const payload = {
      title: data.title,
      slug: data.slug,
      category_id: data.category_id,
      description: data.description || null,
      date: data.date || null,
      location: data.location || null,
      is_published: data.is_published,
      is_featured: data.is_featured,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
    };

    if (isNew) {
      const { error } = await supabase
        .from("portfolio_galleries")
        .insert(payload);
      if (error) {
        toast.error("Nepodařilo se vytvořit galerii.");
      } else {
        toast.success("Galerie vytvořena!");
        router.push("/admin/portfolio");
      }
    } else {
      const { error } = await supabase
        .from("portfolio_galleries")
        .update(payload)
        .eq("id", id);
      if (error) {
        toast.error("Nepodařilo se uložit změny.");
      } else {
        toast.success("Změny uloženy!");
      }
    }
    setIsSaving(false);
  }

  async function onDelete() {
    if (!confirm("Opravdu smazat tuto galerii? Smaže se i všechny fotky v ní.")) return;
    const { error } = await supabase
      .from("portfolio_galleries")
      .delete()
      .eq("id", id);
    if (error) toast.error("Nepodařilo se smazat galerii.");
    else {
      toast.success("Galerie smazána!");
      router.push("/admin/portfolio");
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
        <Button variant="ghost" size="icon" render={<Link href="/admin/portfolio" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isNew ? "Nová galerie" : "Upravit galerii"}
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
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input id="slug" {...register("slug")} />
                  {errors.slug && (
                    <p className="text-xs text-destructive">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Kategorie *</Label>
                  <Select
                    value={categoryId ?? ""}
                    onValueChange={(val) => val && setValue("category_id", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte kategorii" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category_id && (
                    <p className="text-xs text-destructive">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Popis</Label>
                  <Textarea id="description" {...register("description")} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Datum</Label>
                    <Input id="date" type="date" {...register("date")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Místo</Label>
                    <Input id="location" {...register("location")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">SEO titulek</Label>
                  <Input id="seo_title" {...register("seo_title")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo_description">SEO popis</Label>
                  <Textarea
                    id="seo_description"
                    {...register("seo_description")}
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
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published">Publikovat</Label>
                  <Switch
                    id="is_published"
                    checked={isPublished}
                    onCheckedChange={(val) => setValue("is_published", val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured">Na homepage</Label>
                  <Switch
                    id="is_featured"
                    checked={isFeatured}
                    onCheckedChange={(val) => setValue("is_featured", val)}
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
