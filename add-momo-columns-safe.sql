-- Add MoMo payment columns to site_settings table
DO $$ 
BEGIN
    -- Add payment_momo_enabled column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_settings' AND column_name = 'payment_momo_enabled'
    ) THEN
        ALTER TABLE site_settings ADD COLUMN payment_momo_enabled BOOLEAN DEFAULT false;
    END IF;

    -- Add momo_number column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_settings' AND column_name = 'momo_number'
    ) THEN
        ALTER TABLE site_settings ADD COLUMN momo_number TEXT;
    END IF;

    -- Add momo_name column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_settings' AND column_name = 'momo_name'
    ) THEN
        ALTER TABLE site_settings ADD COLUMN momo_name TEXT;
    END IF;

    -- Add momo_instructions column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_settings' AND column_name = 'momo_instructions'
    ) THEN
        ALTER TABLE site_settings ADD COLUMN momo_instructions TEXT DEFAULT 'Scan the QR code or tap to dial, then enter your transaction ID.';
    END IF;
END $$;

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'site_settings' 
AND column_name IN ('payment_momo_enabled', 'momo_number', 'momo_name', 'momo_instructions')
ORDER BY column_name;
