ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS payment_paypal_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS payment_kpay_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS payment_momo_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS momo_number TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS momo_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS momo_instructions TEXT DEFAULT 'Scan the QR code or tap to dial, then enter your transaction ID.',
ADD COLUMN IF NOT EXISTS momo_dial_code TEXT DEFAULT '*182*8*1*{number}*{amount}#';
