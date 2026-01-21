-- Migration: Add Coinbase Commerce fields to escrow_funds
-- Run this migration to add support for Coinbase Commerce charges

ALTER TABLE escrow_funds 
ADD COLUMN IF NOT EXISTS coinbase_charge_id TEXT,
ADD COLUMN IF NOT EXISTS coinbase_charge_code TEXT;

-- Create index for faster lookups by charge_id (used by webhooks)
CREATE INDEX IF NOT EXISTS idx_escrow_funds_coinbase_charge 
ON escrow_funds(coinbase_charge_id) 
WHERE coinbase_charge_id IS NOT NULL;
