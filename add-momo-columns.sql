-- Add MoMo payment columns to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS payment_momo_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS momo_number TEXT,
ADD COLUMN IF NOT EXISTS momo_name TEXT,
ADD COLUMN IF NOT EXISTS momo_instructions TEXT DEFAULT 'Scan the QR code or tap to dial, then enter your transaction ID.';
