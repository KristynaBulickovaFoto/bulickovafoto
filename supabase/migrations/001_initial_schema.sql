-- ============================================
-- kristinafoto.cz - Initial Database Schema
-- ============================================

-- Profily uzivatelu (rozsireni auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Portfolio kategorie (svatby, kapely, portrety)
CREATE TABLE portfolio_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio galerie (jednotlive pribehy/akce)
CREATE TABLE portfolio_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES portfolio_categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  date DATE,
  location TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio fotky
CREATE TABLE portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID REFERENCES portfolio_galleries(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  width INT,
  height INT,
  blur_data_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Klientske galerie (odkazy pro prihlasene klienty)
CREATE TABLE client_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Odkazy v klientskych galeriich
CREATE TABLE client_gallery_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID REFERENCES client_galleries(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'gallery' CHECK (type IN ('gallery', 'download', 'selection', 'other')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sluzby a ceniky
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_text TEXT,
  features JSONB,
  is_published BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reference / testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT,
  content TEXT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  photo_url TEXT,
  is_published BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posty
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  excerpt TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Obsazene terminy (kalendar dostupnosti)
CREATE TABLE booked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  label TEXT,
  is_confirmed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poptavky z kontaktniho formulare
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  shoot_type TEXT NOT NULL,
  preferred_date DATE,
  location TEXT,
  duration TEXT,
  message TEXT,
  preferred_contact TEXT DEFAULT 'email',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'booked', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (singleton)
CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  phone TEXT,
  email TEXT,
  instagram TEXT,
  facebook TEXT,
  about_text TEXT,
  about_image_url TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT,
  hero_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (id) VALUES (1);

-- Insert default portfolio categories
INSERT INTO portfolio_categories (slug, title, description, sort_order) VALUES
  ('svatby', 'Svatby', 'Svatební fotografie plné emocí a autentických momentů', 1),
  ('kapely-a-koncerty', 'Kapely & koncerty', 'Koncertní a hudební fotografie', 2),
  ('portrety', 'Portréty', 'Portréty, párové a rodinné focení', 3);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_gallery_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE booked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE USING (is_admin());

-- PORTFOLIO CATEGORIES (public read, admin write)
CREATE POLICY "Anyone can view categories"
  ON portfolio_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories"
  ON portfolio_categories FOR ALL USING (is_admin());

-- PORTFOLIO GALLERIES (public read published, admin write)
CREATE POLICY "Anyone can view published galleries"
  ON portfolio_galleries FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all galleries"
  ON portfolio_galleries FOR SELECT USING (is_admin());
CREATE POLICY "Admins can manage galleries"
  ON portfolio_galleries FOR ALL USING (is_admin());

-- PORTFOLIO IMAGES (public read via published gallery, admin write)
CREATE POLICY "Anyone can view images of published galleries"
  ON portfolio_images FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolio_galleries
      WHERE id = portfolio_images.gallery_id AND is_published = true
    )
  );
CREATE POLICY "Admins can manage images"
  ON portfolio_images FOR ALL USING (is_admin());

-- CLIENT GALLERIES (client reads own, admin manages all)
CREATE POLICY "Clients can view own galleries"
  ON client_galleries FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Admins can manage client galleries"
  ON client_galleries FOR ALL USING (is_admin());

-- CLIENT GALLERY LINKS
CREATE POLICY "Clients can view links of own galleries"
  ON client_gallery_links FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM client_galleries
      WHERE id = client_gallery_links.gallery_id AND client_id = auth.uid()
    )
  );
CREATE POLICY "Admins can manage gallery links"
  ON client_gallery_links FOR ALL USING (is_admin());

-- SERVICES (public read published, admin write)
CREATE POLICY "Anyone can view published services"
  ON services FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage services"
  ON services FOR ALL USING (is_admin());

-- TESTIMONIALS (public read published, admin write)
CREATE POLICY "Anyone can view published testimonials"
  ON testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage testimonials"
  ON testimonials FOR ALL USING (is_admin());

-- BLOG POSTS (public read published, admin write)
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage posts"
  ON blog_posts FOR ALL USING (is_admin());

-- BOOKED DATES (public read, admin write)
CREATE POLICY "Anyone can view booked dates"
  ON booked_dates FOR SELECT USING (true);
CREATE POLICY "Admins can manage booked dates"
  ON booked_dates FOR ALL USING (is_admin());

-- INQUIRIES (public insert, admin read/manage)
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage inquiries"
  ON inquiries FOR ALL USING (is_admin());

-- SITE SETTINGS (public read, admin write)
CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL USING (is_admin());

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_portfolio_galleries_category ON portfolio_galleries(category_id);
CREATE INDEX idx_portfolio_galleries_published ON portfolio_galleries(is_published) WHERE is_published = true;
CREATE INDEX idx_portfolio_galleries_featured ON portfolio_galleries(is_featured) WHERE is_featured = true;
CREATE INDEX idx_portfolio_galleries_slug ON portfolio_galleries(slug);
CREATE INDEX idx_portfolio_images_gallery ON portfolio_images(gallery_id);
CREATE INDEX idx_client_galleries_client ON client_galleries(client_id);
CREATE INDEX idx_client_gallery_links_gallery ON client_gallery_links(gallery_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC) WHERE is_published = true;
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_booked_dates_date ON booked_dates(date);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

-- ============================================
-- Storage Bucket (for future image uploads)
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
