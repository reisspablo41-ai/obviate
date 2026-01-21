-- Add confirmation fields to deals table
ALTER TABLE deals 
ADD COLUMN seller_confirmed_delivered BOOLEAN DEFAULT FALSE,
ADD COLUMN buyer_confirmed_received BOOLEAN DEFAULT FALSE;

-- Optional: If we want timestamps for these events
-- ADD COLUMN delivered_at TIMESTAMPTZ;
-- ADD COLUMN received_at TIMESTAMPTZ;
