import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, is_published, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog</h1>
        <Button render={<Link href="/admin/blog/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Nový článek
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Název</TableHead>
            <TableHead>Stav</TableHead>
            <TableHead>Publikováno</TableHead>
            <TableHead className="w-[100px]">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(posts ?? []).map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <Badge variant={post.is_published ? "default" : "secondary"}>
                  {post.is_published ? "Publikováno" : "Koncept"}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("cs")
                  : "—"}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" render={<Link href={`/admin/blog/${post.id}`} />}>
                  Upravit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(!posts || posts.length === 0) && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Zatím žádné články.
        </p>
      )}
    </div>
  );
}
