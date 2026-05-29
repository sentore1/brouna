-- Analytics Tables

-- Page Views
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

-- Click Events
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

-- User Sessions
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

-- Conversion Events (NEW)
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

-- Cart Events (NEW)
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

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow insert page_views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert click_events" ON click_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert user_sessions" ON user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert conversion_events" ON conversion_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert cart_events" ON cart_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update user_sessions" ON user_sessions FOR UPDATE USING (true);
CREATE POLICY "Allow select for all" ON page_views FOR SELECT USING (true);
CREATE POLICY "Allow select for all" ON click_events FOR SELECT USING (true);
CREATE POLICY "Allow select for all" ON user_sessions FOR SELECT USING (true);
CREATE POLICY "Allow select for all" ON conversion_events FOR SELECT USING (true);
CREATE POLICY "Allow select for all" ON cart_events FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX idx_page_views_page_url ON page_views(page_url);
CREATE INDEX idx_click_events_created_at ON click_events(created_at DESC);
CREATE INDEX idx_click_events_product_id ON click_events(product_id);
CREATE INDEX idx_user_sessions_created_at ON user_sessions(created_at DESC);
CREATE INDEX idx_conversion_events_created_at ON conversion_events(created_at DESC);
CREATE INDEX idx_conversion_events_event_type ON conversion_events(event_type);
CREATE INDEX idx_cart_events_created_at ON cart_events(created_at DESC);
