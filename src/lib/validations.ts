import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
  email: z.string().email("Zadejte platný e-mail"),
  phone: z.string().optional(),
  shoot_type: z.enum(
    ["wedding", "concert", "portrait", "couple", "family", "other"],
    { message: "Vyberte typ focení" }
  ),
  preferred_date: z.string().optional(),
  location: z.string().optional(),
  duration: z.string().optional(),
  message: z.string().min(10, "Zpráva musí mít alespoň 10 znaků"),
  preferred_contact: z.enum(["email", "phone", "whatsapp"]),
  // Honeypot field - should be empty
  website: z.string().max(0).optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const loginSchema = z.object({
  email: z.string().email("Zadejte platný e-mail"),
  password: z.string().min(6, "Heslo musí mít alespoň 6 znaků"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const portfolioGallerySchema = z.object({
  title: z.string().min(2, "Název musí mít alespoň 2 znaky"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug může obsahovat pouze malá písmena, čísla a pomlčky"),
  category_id: z.string().uuid("Vyberte kategorii"),
  description: z.string().optional(),
  date: z.string().optional(),
  location: z.string().optional(),
  is_published: z.boolean(),
  is_featured: z.boolean(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type PortfolioGalleryValues = z.infer<typeof portfolioGallerySchema>;

export const blogPostSchema = z.object({
  title: z.string().min(2, "Název musí mít alespoň 2 znaky"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug může obsahovat pouze malá písmena, čísla a pomlčky"),
  excerpt: z.string().optional(),
  is_published: z.boolean(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type BlogPostValues = z.infer<typeof blogPostSchema>;

export const clientGallerySchema = z.object({
  client_id: z.string().uuid("Vyberte klienta"),
  title: z.string().min(2, "Název musí mít alespoň 2 znaky"),
  description: z.string().optional(),
});

export type ClientGalleryValues = z.infer<typeof clientGallerySchema>;

export const clientGalleryLinkSchema = z.object({
  gallery_id: z.string().uuid(),
  label: z.string().min(2, "Popis musí mít alespoň 2 znaky"),
  url: z.string().url("Zadejte platnou URL adresu"),
  type: z.enum(["gallery", "download", "selection", "other"]),
});

export type ClientGalleryLinkValues = z.infer<typeof clientGalleryLinkSchema>;

export const serviceSchema = z.object({
  title: z.string().min(2, "Název musí mít alespoň 2 znaky"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug může obsahovat pouze malá písmena, čísla a pomlčky"),
  description: z.string().optional(),
  price_text: z.string().optional(),
  features: z.array(z.string()).optional(),
  is_published: z.boolean(),
});

export type ServiceValues = z.infer<typeof serviceSchema>;

export const testimonialSchema = z.object({
  author_name: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
  author_role: z.string().optional(),
  content: z.string().min(10, "Text musí mít alespoň 10 znaků"),
  rating: z.number().min(1).max(5).optional(),
  is_published: z.boolean(),
});

export type TestimonialValues = z.infer<typeof testimonialSchema>;
