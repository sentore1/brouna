-- Add new tables only (run this if you already have page_views, click_events, user_sessions)

-- Conversion Events
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

-- Cart Events
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
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow insert conversion_events" ON conversion_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert cart_events" ON cart_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select conversion_events" ON conversion_events FOR SELECT USING (true);
CREATE POLICY "Allow select cart_events" ON cart_events FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_conversion_events_created_at ON conversion_events(created_at DESC);
CREATE INDEX idx_conversion_events_event_type ON conversion_events(event_type);
CREATE INDEX idx_cart_events_created_at ON cart_events(created_at DESC);
