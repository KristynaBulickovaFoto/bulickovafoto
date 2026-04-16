export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          role: "admin" | "client";
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          role?: "admin" | "client";
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          role?: "admin" | "client";
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      portfolio_categories: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      portfolio_galleries: {
        Row: {
          id: string;
          category_id: string | null;
          slug: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
          date: string | null;
          location: string | null;
          is_published: boolean;
          is_featured: boolean;
          sort_order: number;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          slug: string;
          title: string;
          description?: string | null;
          cover_image_url?: string | null;
          date?: string | null;
          location?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          slug?: string;
          title?: string;
          description?: string | null;
          cover_image_url?: string | null;
          date?: string | null;
          location?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "portfolio_galleries_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "portfolio_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      portfolio_images: {
        Row: {
          id: string;
          gallery_id: string;
          image_url: string;
          alt_text: string | null;
          caption: string | null;
          width: number | null;
          height: number | null;
          blur_data_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          gallery_id: string;
          image_url: string;
          alt_text?: string | null;
          caption?: string | null;
          width?: number | null;
          height?: number | null;
          blur_data_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          gallery_id?: string;
          image_url?: string;
          alt_text?: string | null;
          caption?: string | null;
          width?: number | null;
          height?: number | null;
          blur_data_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "portfolio_images_gallery_id_fkey";
            columns: ["gallery_id"];
            isOneToOne: false;
            referencedRelation: "portfolio_galleries";
            referencedColumns: ["id"];
          },
        ];
      };
      client_galleries: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          description: string | null;
          status: "active" | "archived";
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          title: string;
          description?: string | null;
          status?: "active" | "archived";
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          title?: string;
          description?: string | null;
          status?: "active" | "archived";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "client_galleries_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      client_gallery_links: {
        Row: {
          id: string;
          gallery_id: string;
          label: string;
          url: string;
          type: "gallery" | "download" | "selection" | "other";
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          gallery_id: string;
          label: string;
          url: string;
          type?: "gallery" | "download" | "selection" | "other";
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          gallery_id?: string;
          label?: string;
          url?: string;
          type?: "gallery" | "download" | "selection" | "other";
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "client_gallery_links_gallery_id_fkey";
            columns: ["gallery_id"];
            isOneToOne: false;
            referencedRelation: "client_galleries";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          price_text: string | null;
          features: Json | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          price_text?: string | null;
          features?: Json | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          price_text?: string | null;
          features?: Json | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string | null;
          content: string;
          rating: number | null;
          photo_url: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_role?: string | null;
          content: string;
          rating?: number | null;
          photo_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          author_role?: string | null;
          content?: string;
          rating?: number | null;
          photo_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: Json;
          excerpt: string | null;
          cover_image_url: string | null;
          is_published: boolean;
          published_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content: Json;
          excerpt?: string | null;
          cover_image_url?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content?: Json;
          excerpt?: string | null;
          cover_image_url?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      booked_dates: {
        Row: {
          id: string;
          date: string;
          inquiry_id: string | null;
          label: string | null;
          is_confirmed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          inquiry_id?: string | null;
          label?: string | null;
          is_confirmed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          inquiry_id?: string | null;
          label?: string | null;
          is_confirmed?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "booked_dates_inquiry_id_fkey";
            columns: ["inquiry_id"];
            isOneToOne: false;
            referencedRelation: "inquiries";
            referencedColumns: ["id"];
          },
        ];
      };
      inquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          shoot_type: string;
          preferred_date: string | null;
          location: string | null;
          duration: string | null;
          message: string | null;
          preferred_contact: string;
          status: "new" | "read" | "replied" | "booked" | "archived";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          shoot_type: string;
          preferred_date?: string | null;
          location?: string | null;
          duration?: string | null;
          message?: string | null;
          preferred_contact?: string;
          status?: "new" | "read" | "replied" | "booked" | "archived";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          shoot_type?: string;
          preferred_date?: string | null;
          location?: string | null;
          duration?: string | null;
          message?: string | null;
          preferred_contact?: string;
          status?: "new" | "read" | "replied" | "booked" | "archived";
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          phone: string | null;
          email: string | null;
          instagram: string | null;
          facebook: string | null;
          about_text: string | null;
          about_image_url: string | null;
          hero_headline: string | null;
          hero_subheadline: string | null;
          hero_image_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          phone?: string | null;
          email?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          about_text?: string | null;
          about_image_url?: string | null;
          hero_headline?: string | null;
          hero_subheadline?: string | null;
          hero_image_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          phone?: string | null;
          email?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          about_text?: string | null;
          about_image_url?: string | null;
          hero_headline?: string | null;
          hero_subheadline?: string | null;
          hero_image_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// Helper types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
