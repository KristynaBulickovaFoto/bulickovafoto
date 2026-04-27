"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

type GalleryImageProps = {
  href: string;
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  blurDataUrl?: string | null;
  externalUrl?: string | null;
};

export function GalleryImage({
  href,
  src,
  alt,
  title,
  subtitle,
  blurDataUrl,
  externalUrl,
}: GalleryImageProps) {
  const inner = (
    <>
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
      {externalUrl && (
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          <ExternalLink className="h-2.5 w-2.5" />
          Externí
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100">
        <p className="text-sm font-medium">{title}</p>
        {subtitle && (
          <p className="mt-0.5 text-xs text-white/70">{subtitle}</p>
        )}
      </div>
    </>
  );

  const className =
    "group relative block aspect-[3/4] overflow-hidden rounded-xl";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {inner}
        </a>
      ) : (
        <Link href={href} className={className}>
          {inner}
        </Link>
      )}
    </motion.div>
  );
}
