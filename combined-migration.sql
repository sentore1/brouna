-- ============================================================
-- COMBINED MIGRATION - Run this once on a fresh Supabase project
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image TEXT,
  images TEXT,
  stock INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  slug VARCHAR(255) UNIQUE,
  sizes TEXT,
  colors TEXT,
  sale_end_date TIMESTAMP WITH TIME ZONE,
  viewers_count INTEGER DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  meta_tags TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 3. CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

INSERT INTO categories (name) VALUES 
  ('tops'), ('bottoms'), ('dresses'), ('accessories')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 4. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  total NUMERIC,
  total_amount NUMERIC,
  payment_method TEXT,
  payment_reference TEXT,
  payment_transaction_id TEXT,
  payment_account TEXT,
  transaction_id TEXT,
  items JSONB,
  status TEXT DEFAULT 'pending',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_country TEXT,
  shipping_postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 5. ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 6. USER PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- 7. SITE SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Hero
  hero_type TEXT DEFAULT 'image',
  hero_content TEXT DEFAULT '/hero-image.jpg',
  hero_title TEXT DEFAULT 'SIZA',
  hero_subtitle TEXT DEFAULT 'Discover timeless pieces crafted for the modern minimalist',
  hero_height INTEGER DEFAULT 400,
  hero_border_radius INTEGER DEFAULT 0,
  hero_overlay_enabled BOOLEAN DEFAULT true,
  hero_overlay_color VARCHAR(7) DEFAULT '#000000',
  hero_overlay_opacity DECIMAL(3,2) DEFAULT 0.3,
  hero_button_text VARCHAR(100) DEFAULT '',
  hero_button_link VARCHAR(255) DEFAULT '',
  hero_title_font VARCHAR(50) DEFAULT 'inherit',
  hero_title_size INTEGER DEFAULT 48,
  show_hero BOOLEAN DEFAULT false,
  -- Header / Footer
  header_style TEXT DEFAULT 'minimal',
  footer_style TEXT DEFAULT 'simple',
  footer_text_size INTEGER DEFAULT 14,
  footer_logo_size INTEGER DEFAULT 32,
  footer_show_border BOOLEAN DEFAULT false,
  footer_show_logo BOOLEAN DEFAULT true,
  footer_title_size INTEGER DEFAULT 24,
  footer_title_weight INTEGER DEFAULT 600,
  footer_title_font VARCHAR(50) DEFAULT 'inherit',
  footer_title_line_height DECIMAL(3,1) DEFAULT 1.2,
  footer_symbol VARCHAR(5) DEFAULT '™',
  -- Site
  site_name TEXT DEFAULT 'brouna',
  site_logo TEXT DEFAULT '',
  -- Products
  product_grid_columns INTEGER DEFAULT 4,
  product_card_style VARCHAR(20) DEFAULT 'minimal',
  product_card_height VARCHAR(50) DEFAULT 'square',
  product_page_layout VARCHAR(50) DEFAULT 'default',
  product_zoom_type VARCHAR(20) DEFAULT 'simple',
  add_to_cart_button_text VARCHAR(100) DEFAULT 'Add to Cart',
  price_badge_color VARCHAR(7) DEFAULT '#3b82f6',
  homepage_product_limit INTEGER DEFAULT 8,
  -- Payment
  payment_paypal_enabled BOOLEAN DEFAULT true,
  payment_kpay_enabled BOOLEAN DEFAULT true,
  payment_momo_enabled BOOLEAN DEFAULT false,
  momo_number TEXT DEFAULT '',
  momo_name TEXT DEFAULT '',
  momo_instructions TEXT DEFAULT 'Scan the QR code or tap to dial, then enter your transaction ID.',
  momo_dial_code TEXT DEFAULT '*180*8*1*{number}*{amount}#',
  -- Product Spotlight Widget
  spotlight_enabled BOOLEAN DEFAULT false,
  spotlight_image TEXT DEFAULT '',
  spotlight_title TEXT DEFAULT '',
  spotlight_subtitle TEXT DEFAULT '',
  spotlight_price TEXT DEFAULT '',
  spotlight_price_prefix TEXT DEFAULT 'From',
  spotlight_link TEXT DEFAULT '',
  spotlight_width INTEGER DEFAULT 320,
  spotlight_bg_color VARCHAR(20) DEFAULT '#f5f5f5',
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO site_settings (site_name) VALUES ('brouna')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. HERO SECTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position INTEGER NOT NULL DEFAULT 0,
  vertical_position VARCHAR(20) DEFAULT 'top',
  enabled BOOLEAN DEFAULT true,
  hero_type VARCHAR(20) DEFAULT 'image',
  hero_content TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_height INTEGER DEFAULT 400,
  hero_border_radius INTEGER DEFAULT 0,
  hero_overlay_enabled BOOLEAN DEFAULT true,
  hero_overlay_color VARCHAR(20) DEFAULT '#000000',
  hero_overlay_opacity DECIMAL(3,2) DEFAULT 0.3,
  hero_button_text VARCHAR(100),
  hero_button_link TEXT,
  hero_title_font VARCHAR(100) DEFAULT 'inherit',
  hero_title_size INTEGER DEFAULT 48,
  hero_gallery_images TEXT DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default hero section
INSERT INTO hero_sections (position, vertical_position, enabled, hero_type, hero_content, hero_title, hero_subtitle)
VALUES (0, 'top', true, 'image', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop', 'SIZA', 'Discover timeless pieces crafted for the modern minimalist');

-- ============================================================
-- 9. MOMO ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS momo_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  total_amount NUMERIC,
  status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  payment_method TEXT,
  order_items TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. ANALYTICS TABLES
-- ============================================================
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  session_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS click_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  element_type TEXT,
  element_text TEXT,
  page_url TEXT,
  product_id TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  first_page TEXT,
  last_page TEXT,
  pages_visited INTEGER DEFAULT 1,
  duration_seconds INTEGER,
  referrer TEXT,
  country TEXT,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  event_type TEXT NOT NULL,
  product_id TEXT,
  product_name TEXT,
  amount DECIMAL(10,2),
  currency TEXT,
  order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  event_type TEXT NOT NULL,
  product_id TEXT,
  product_name TEXT,
  quantity INTEGER,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 11. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_url ON page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_click_events_created_at ON click_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_click_events_product_id ON click_events(product_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversion_events_created_at ON conversion_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversion_events_event_type ON conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_cart_events_created_at ON cart_events(created_at DESC);

-- ============================================================
-- 12. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE momo_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_events ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 13. RLS POLICIES - PRODUCTS
-- ============================================================
CREATE POLICY "Enable all operations for everyone" ON products
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 14. RLS POLICIES - CATEGORIES
-- ============================================================
CREATE POLICY "Allow public read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow service role full access categories" ON categories
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access categories" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 15. RLS POLICIES - ORDERS
-- ============================================================
CREATE POLICY "Service role full access on orders"
  ON orders FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Anon can insert orders"
  ON orders FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert orders"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- 16. RLS POLICIES - ORDER ITEMS
-- ============================================================
CREATE POLICY "Service role can insert order_items"
  ON order_items FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Admin can view order_items"
  ON order_items FOR SELECT TO authenticated
  USING (true);

-- ============================================================
-- 17. RLS POLICIES - USER PROFILES
-- ============================================================
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- 18. RLS POLICIES - SITE SETTINGS
-- ============================================================
CREATE POLICY "Allow public read access to site_settings"
  ON site_settings FOR SELECT TO public USING (true);

CREATE POLICY "Allow service role full access to site_settings"
  ON site_settings FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin to update site_settings"
  ON site_settings FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- 19. RLS POLICIES - HERO SECTIONS
-- ============================================================
CREATE POLICY "Allow public read hero_sections"
  ON hero_sections FOR SELECT USING (true);

CREATE POLICY "Allow service role full access hero_sections"
  ON hero_sections FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin full access hero_sections"
  ON hero_sections FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- 20. RLS POLICIES - MOMO ORDERS
-- ============================================================
CREATE POLICY "Service role can insert momo_orders"
  ON momo_orders FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Admin can view momo_orders"
  ON momo_orders FOR SELECT TO authenticated USING (true);

-- ============================================================
-- 21. RLS POLICIES - ANALYTICS
-- ============================================================
CREATE POLICY "Allow insert page_views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select page_views" ON page_views FOR SELECT USING (true);
CREATE POLICY "Allow insert click_events" ON click_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select click_events" ON click_events FOR SELECT USING (true);
CREATE POLICY "Allow insert user_sessions" ON user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update user_sessions" ON user_sessions FOR UPDATE USING (true);
CREATE POLICY "Allow select user_sessions" ON user_sessions FOR SELECT USING (true);
CREATE POLICY "Allow insert conversion_events" ON conversion_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select conversion_events" ON conversion_events FOR SELECT USING (true);
CREATE POLICY "Allow insert cart_events" ON cart_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select cart_events" ON cart_events FOR SELECT USING (true);

-- ============================================================
-- 22. RELOAD SCHEMA CACHE
-- ============================================================
NOTIFY pgrst, 'reload schema';

-- ============================================================
-- 23. STORED FUNCTIONS
-- ============================================================

-- Function: update_site_settings
CREATE OR REPLACE FUNCTION update_site_settings(settings_json jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  settings_id uuid;
BEGIN
  SELECT id INTO settings_id FROM site_settings LIMIT 1;

  IF settings_id IS NULL THEN
    INSERT INTO site_settings DEFAULT VALUES RETURNING id INTO settings_id;
  END IF;

  UPDATE site_settings
  SET
    site_name = COALESCE((settings_json->>'site_name')::text, site_name),
    site_logo = COALESCE((settings_json->>'site_logo')::text, site_logo),
    homepage_product_limit = COALESCE((settings_json->>'homepage_product_limit')::integer, homepage_product_limit),
    payment_paypal_enabled = COALESCE((settings_json->>'payment_paypal_enabled')::boolean, payment_paypal_enabled),
    payment_kpay_enabled = COALESCE((settings_json->>'payment_kpay_enabled')::boolean, payment_kpay_enabled),
    payment_momo_enabled = COALESCE((settings_json->>'payment_momo_enabled')::boolean, payment_momo_enabled),
    momo_number = COALESCE((settings_json->>'momo_number')::text, momo_number),
    momo_name = COALESCE((settings_json->>'momo_name')::text, momo_name),
    momo_instructions = COALESCE((settings_json->>'momo_instructions')::text, momo_instructions),
    momo_dial_code = COALESCE((settings_json->>'momo_dial_code')::text, momo_dial_code)
  WHERE id = settings_id;

  RETURN jsonb_build_object('success', true, 'id', settings_id);
END;
$$;

GRANT EXECUTE ON FUNCTION update_site_settings(jsonb) TO anon, authenticated, service_role;

-- Function: create_order
CREATE OR REPLACE FUNCTION create_order(
  p_customer_email VARCHAR,
  p_customer_name VARCHAR,
  p_customer_phone VARCHAR,
  p_total_amount NUMERIC,
  p_status VARCHAR,
  p_payment_reference VARCHAR,
  p_payment_transaction_id VARCHAR,
  p_payment_account VARCHAR
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
BEGIN
  INSERT INTO orders (
    customer_email, customer_name, customer_phone,
    total_amount, status, payment_reference,
    payment_transaction_id, payment_account,
    created_at, updated_at
  ) VALUES (
    p_customer_email, p_customer_name, p_customer_phone,
    p_total_amount, p_status, p_payment_reference,
    p_payment_transaction_id, p_payment_account,
    NOW(), NOW()
  )
  RETURNING id INTO v_order_id;

  RETURN v_order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION create_order TO service_role, anon, authenticated;

-- Function: insert_order_direct
CREATE OR REPLACE FUNCTION insert_order_direct(
  p_user_id UUID,
  p_customer_email VARCHAR,
  p_customer_name VARCHAR,
  p_customer_phone VARCHAR,
  p_total_amount NUMERIC,
  p_status VARCHAR,
  p_transaction_id VARCHAR,
  p_payment_method VARCHAR,
  p_items JSONB,
  p_shipping_address TEXT,
  p_shipping_city TEXT,
  p_shipping_country TEXT,
  p_shipping_postal_code TEXT
)
RETURNS TABLE(
  id UUID,
  customer_email VARCHAR,
  customer_name VARCHAR,
  customer_phone VARCHAR,
  total_amount NUMERIC,
  status VARCHAR,
  payment_transaction_id VARCHAR,
  payment_account VARCHAR,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_customer_email VARCHAR;
  v_customer_name VARCHAR;
  v_customer_phone VARCHAR;
  v_total_amount NUMERIC;
  v_status VARCHAR;
  v_payment_transaction_id VARCHAR;
  v_payment_account VARCHAR;
  v_created_at TIMESTAMPTZ;
BEGIN
  INSERT INTO orders (
    user_id, customer_email, customer_name, customer_phone,
    total_amount, status, payment_transaction_id, payment_reference,
    payment_account, shipping_address, shipping_city,
    shipping_country, shipping_postal_code, created_at, updated_at
  ) VALUES (
    p_user_id, p_customer_email, p_customer_name, p_customer_phone,
    p_total_amount, p_status, p_transaction_id, p_transaction_id,
    p_payment_method, p_shipping_address, p_shipping_city,
    p_shipping_country, p_shipping_postal_code, NOW(), NOW()
  )
  RETURNING
    orders.id, orders.customer_email, orders.customer_name, orders.customer_phone,
    orders.total_amount, orders.status, orders.payment_transaction_id,
    orders.payment_account, orders.created_at
  INTO
    v_order_id, v_customer_email, v_customer_name, v_customer_phone,
    v_total_amount, v_status, v_payment_transaction_id, v_payment_account, v_created_at;

  RETURN QUERY SELECT
    v_order_id, v_customer_email, v_customer_name, v_customer_phone,
    v_total_amount, v_status, v_payment_transaction_id, v_payment_account, v_created_at;
END;
$$;

GRANT EXECUTE ON FUNCTION insert_order_direct TO service_role, anon, authenticated;

-- Function: insert_momo_order
CREATE OR REPLACE FUNCTION insert_momo_order(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_total_amount NUMERIC,
  p_status TEXT,
  p_transaction_id TEXT,
  p_payment_method TEXT,
  p_order_items TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_result JSON;
BEGIN
  INSERT INTO momo_orders (
    customer_name, customer_email, customer_phone,
    total_amount, status, transaction_id, payment_method, order_items
  ) VALUES (
    p_customer_name, p_customer_email, p_customer_phone,
    p_total_amount, p_status, p_transaction_id, p_payment_method, p_order_items
  )
  RETURNING id INTO v_order_id;

  SELECT json_build_object(
    'id', v_order_id,
    'customer_name', p_customer_name,
    'customer_email', p_customer_email,
    'status', p_status,
    'transaction_id', p_transaction_id
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION insert_momo_order TO service_role, anon, authenticated;

-- Function: exec_sql (utility)
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  EXECUTE sql_query INTO result;
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION exec_sql TO service_role, anon, authenticated;

-- ============================================================
-- 24. execute_raw_sql FUNCTION (used by orders-direct API)
-- ============================================================
CREATE OR REPLACE FUNCTION execute_raw_sql(sql_query TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  EXECUTE sql_query INTO result;
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION execute_raw_sql TO service_role, anon, authenticated;

-- ============================================================
-- 25. updated_at AUTO-UPDATE TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
