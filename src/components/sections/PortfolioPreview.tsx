"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type GalleryItem = {
  slug: string;
  title: string;
  cover_image_url: string | null;
  category_slug: string;
};

type PortfolioPreviewProps = {
  galleries: GalleryItem[];
};

export function PortfolioPreview({ galleries }: PortfolioPreviewProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="mb-10 text-center">
        <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Vybrané práce
        </h2>
        <p className="mt-3 text-muted-foreground">
          Nahlédněte do mého portfolia
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {galleries.map((gallery, index) => (
          <motion.div
            key={gallery.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className={index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}
          >
            <Link
              href={`/portfolio/${gallery.category_slug}/${gallery.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-xl"
            >
              {gallery.cover_image_url ? (
                <Image
                  src={gallery.cover_image_url}
                  alt={gallery.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes={index === 0 ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100">
                <p className="text-sm font-medium">{gallery.title}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-300 sm:w-0 sm:group-hover:w-full" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white"
        >
          Zobrazit celé portfolio
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
