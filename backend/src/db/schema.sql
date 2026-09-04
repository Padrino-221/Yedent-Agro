-- Yedent Agro Website Database Schema
-- Entities: users, subsidiaries, departments, products, sales_representatives, awards

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ USERS (Admins) ============
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'dept_admin', -- 'group_admin' | 'dept_admin'
  department_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============ SUBSIDIARIES ============
CREATE TABLE IF NOT EXISTS subsidiaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  focus_area TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  tagline VARCHAR(255),
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============ DEPARTMENTS (belong to a subsidiary) ============
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subsidiary_id UUID REFERENCES subsidiaries(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  head_of_department VARCHAR(255),
  head_image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subsidiary_id UUID REFERENCES subsidiaries(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  sector VARCHAR(50) NOT NULL, -- 'consumer' | 'industrial' | 'poultry_feed'
  category VARCHAR(100),
  fda_registration VARCHAR(100),
  storage_instructions TEXT,
  allergens TEXT,
  net_weight VARCHAR(50),
  cover_image_url TEXT,
  video_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product images gallery
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- Product videos (optional YouTube embeds on the product detail page)
CREATE TABLE IF NOT EXISTS product_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  title TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- Nutritional facts (key-value pairs)
CREATE TABLE IF NOT EXISTS product_nutrition (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  nutrient VARCHAR(100) NOT NULL,
  value VARCHAR(100),
  unit VARCHAR(20),
  category VARCHAR(20) NOT NULL, -- 'macro' | 'micro'
  sort_order INT NOT NULL DEFAULT 0
);

-- Preparation steps (ordered)
CREATE TABLE IF NOT EXISTS product_preparation_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  instruction TEXT NOT NULL
);

-- ============ SALES REPRESENTATIVES (belong to a subsidiary) ============
CREATE TABLE IF NOT EXISTS sales_representatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subsidiary_id UUID REFERENCES subsidiaries(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100) NOT NULL,
  territory VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============ AWARDS ============
CREATE TABLE IF NOT EXISTS awards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  award_year INT NOT NULL,
  conferring_body VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  press_release_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============ HERO SLIDES (landing carousel: company + subsidiaries) ============
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  cta_label VARCHAR(100),
  cta_href TEXT,
  slide_type VARCHAR(50) NOT NULL DEFAULT 'slide', -- 'company' | 'subsidiary'
  subsidiary_id UUID REFERENCES subsidiaries(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============ NEWS & EVENTS ============
CREATE TABLE IF NOT EXISTS news_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary TEXT,
  body TEXT,
  type VARCHAR(20) NOT NULL DEFAULT 'news', -- 'news' | 'event'
  image_url TEXT,
  video_url TEXT,
  event_date DATE,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============ LEADERS (executive leadership not tied to a department) ============
CREATE TABLE IF NOT EXISTS leaders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  bio TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============ PARTNERS (partner logo strip on the landing page) ============
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============ COMPANY INFO / SETTINGS ============
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============ MIGRATIONS (safe re-runs for existing tables) ============
ALTER TABLE subsidiaries ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE subsidiaries ADD COLUMN IF NOT EXISTS tagline VARCHAR(255);
ALTER TABLE departments ADD COLUMN IF NOT EXISTS subsidiary_id UUID REFERENCES subsidiaries(id) ON DELETE SET NULL;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS head_image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE sales_representatives ADD COLUMN IF NOT EXISTS subsidiary_id UUID REFERENCES subsidiaries(id) ON DELETE SET NULL;
ALTER TABLE sales_representatives ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_products_subsidiary ON products(subsidiary_id);
CREATE INDEX IF NOT EXISTS idx_products_sector ON products(sector);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_product ON product_nutrition(product_id);
CREATE INDEX IF NOT EXISTS idx_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_prep_product ON product_preparation_steps(product_id);
CREATE INDEX IF NOT EXISTS idx_departments_subsidiary ON departments(subsidiary_id);
CREATE INDEX IF NOT EXISTS idx_sales_subsidiary ON sales_representatives(subsidiary_id);
CREATE INDEX IF NOT EXISTS idx_product_videos_product ON product_videos(product_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_events(published_at);

-- ============ UNIQUE CONSTRAINTS (idempotent seeding) ============
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_nutrition_product_sort') THEN
    ALTER TABLE product_nutrition ADD CONSTRAINT uq_nutrition_product_sort UNIQUE (product_id, sort_order);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_prep_product_step') THEN
    ALTER TABLE product_preparation_steps ADD CONSTRAINT uq_prep_product_step UNIQUE (product_id, step_number);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_sales_name_phone') THEN
    ALTER TABLE sales_representatives ADD CONSTRAINT uq_sales_name_phone UNIQUE (name, phone);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_award_title_year') THEN
    ALTER TABLE awards ADD CONSTRAINT uq_award_title_year UNIQUE (title, award_year);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_hero_slide_title') THEN
    ALTER TABLE hero_slides ADD CONSTRAINT uq_hero_slide_title UNIQUE (title);
  END IF;
END $$;
