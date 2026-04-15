"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogPostSchema, type BlogPostValues } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";

export default function AdminBlogEditPage() {
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
  } = useForm<BlogPostValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { is_published: false },
  });
  const isPublished = useWatch({ control, name: "is_published" });

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      if (!isNew) {
        const { data: post } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .single();
        if (post) {
          reset({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            is_published: post.is_published,
            seo_title: post.seo_title ?? "",
            seo_description: post.seo_description ?? "",
          });
        }
      }
      setIsLoading(false);
    }
    load();
  }, [id, isNew, reset, supabase]);

  async function onSubmit(data: BlogPostValues) {
    setIsSaving(true);
    const payload = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      is_published: data.is_published,
      published_at: data.is_published ? new Date().toISOString() : null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      content: {},
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) toast.error("Nepodařilo se vytvořit článek.");
      else {
        toast.success("Článek vytvořen!");
        router.push("/admin/blog");
      }
    } else {
      const { error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", id);
      if (error) toast.error("Nepodařilo se uložit.");
      else toast.success("Uloženo!");
    }
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
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/admin/blog" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isNew ? "Nový článek" : "Upravit článek"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Obsah</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Název *</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && (
                    <p className="text-xs text-destructive">{errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" {...register("slug")} />
                  {errors.slug && (
                    <p className="text-xs text-destructive">{errors.slug.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Úryvek</Label>
                  <Textarea id="excerpt" rows={3} {...register("excerpt")} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Tiptap WYSIWYG editor bude doplněn v další fázi.
                </p>
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
