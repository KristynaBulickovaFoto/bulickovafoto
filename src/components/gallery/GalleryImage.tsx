"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type GalleryImageProps = {
  href: string;
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  blurDataUrl?: string | null;
};

export function GalleryImage({
  href,
  src,
  alt,
  title,
  subtitle,
  blurDataUrl,
}: GalleryImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={href}
        className="group relative block aspect-[3/4] overflow-hidden rounded-xl"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          {...(blurDataUrl
            ? { placeholder: "blur", blurDataURL: blurDataUrl }
            : {})}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100">
          <p className="text-sm font-medium">{title}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-white/70">{subtitle}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
