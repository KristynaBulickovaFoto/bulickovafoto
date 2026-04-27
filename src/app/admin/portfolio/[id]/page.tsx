"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Loader2, Save, ArrowLeft, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { resizeImage } from "@/lib/image-resize";
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
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [categories, setCategories] = useState<Tables<"portfolio_categories">[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const coverImageUrl = useWatch({ control, name: "cover_image_url" });

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
            external_url: gallery.external_url ?? "",
            cover_image_url: gallery.cover_image_url ?? "",
          });
        }
      }
      setIsLoading(false);
    }
    load();
  }, [id, isNew, reset, supabase]);

  async function onSubmit(data: PortfolioGalleryValues) {
    setIsSaving(true);

    const externalUrl = data.external_url?.trim() || null;
    const externalProvider: "zonerama" | "other" | null = externalUrl
      ? /^https?:\/\/(eu\.)?zonerama\.com\//i.test(externalUrl)
        ? "zonerama"
        : "other"
      : null;

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
      external_url: externalUrl,
      external_provider: externalProvider,
      cover_image_url: data.cover_image_url?.trim() || null,
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

  async function uploadCover(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Soubor musí být obrázek.");
      return;
    }

    setIsUploadingCover(true);
    try {
      const blob = await resizeImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
        mimeType: "image/jpeg",
      });

      const fileName = `covers/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          cacheControl: "31536000",
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        toast.error("Nepodařilo se nahrát obrázek.");
        return;
      }

      const { data: pub } = supabase.storage
        .from("portfolio")
        .getPublicUrl(fileName);

      setValue("cover_image_url", pub.publicUrl, { shouldDirty: true });
      const sizeKb = Math.round(blob.size / 1024);
      toast.success(`Cover nahrán (${sizeKb} kB).`);
    } catch (err) {
      console.error(err);
      toast.error("Chyba při zpracování obrázku.");
    } finally {
      setIsUploadingCover(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function removeCover() {
    const url = coverImageUrl;
    setValue("cover_image_url", "", { shouldDirty: true });
    if (!url) return;
    // Best-effort cleanup: only delete files we uploaded into our bucket
    const match = url.match(/\/portfolio\/(covers\/[^?]+)/);
    if (match) {
      await supabase.storage.from("portfolio").remove([match[1]]);
    }
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

                <div className="space-y-2">
                  <Label>Cover obrázek</Label>
                  {coverImageUrl ? (
                    <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-border">
                      <div className="relative aspect-[3/2]">
                        <Image
                          src={coverImageUrl}
                          alt="Cover preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 448px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-2 h-7 w-7"
                        onClick={removeCover}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex aspect-[3/2] w-full max-w-md cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploadingCover ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="text-xs">Zpracovávám...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-6 w-6" />
                          <span className="text-xs">Klikni pro nahrání</span>
                          <span className="text-[10px]">
                            Obrázek se zmenší na max 1600px, JPEG 85%
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadCover(file);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="external_url">Externí galerie (Zonerama)</Label>
                  <Input
                    id="external_url"
                    type="url"
                    placeholder="https://eu.zonerama.com/Link/Album/..."
                    {...register("external_url")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pokud vyplníte, galerie na webu otevře tento odkaz místo
                    lokálního detailu.
                  </p>
                  {errors.external_url && (
                    <p className="text-xs text-destructive">
                      {errors.external_url.message}
                    </p>
                  )}
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
