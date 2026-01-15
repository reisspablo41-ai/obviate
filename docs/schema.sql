-- =========================================================
-- EXTENSIONS
-- =========================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- ENUM TYPES
-- =========================================================
CREATE TYPE deal_status AS ENUM (
  'draft',
  'active',
  'funding',
  'funded',
  'in_review',
  'completed',
  'disputed'
);

CREATE TYPE deal_role AS ENUM ('initiator', 'recipient');

CREATE TYPE payment_method AS ENUM ('bank', 'crypto');

CREATE TYPE escrow_status AS ENUM (
  'pending',
  'confirmed',
  'released',
  'refunded'
);

CREATE TYPE dispute_status AS ENUM (
  'open',
  'under_review',
  'resolved'
);

CREATE TYPE kyc_status AS ENUM (
  'not_started',
  'pending',
  'verified',
  'rejected'
);

CREATE TYPE kyc_document_type AS ENUM (
  'passport',
  'national_id',
  'drivers_license',
  'selfie',
  'proof_of_address'
);

-- =========================================================
-- PROFILES (EXTENDS auth.users)
-- =========================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- KYC VERIFICATIONS
-- =========================================================
CREATE TABLE kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status kyc_status NOT NULL DEFAULT 'not_started',

  provider TEXT,
  rejection_reason TEXT,

  phone_number TEXT,
  ssn_or_itin TEXT,

  verified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE (user_id)
);

-- =========================================================
-- KYC DOCUMENTS (FILES STORED IN SUPABASE STORAGE)
-- =========================================================
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  kyc_id UUID NOT NULL REFERENCES kyc_verifications(id) ON DELETE CASCADE,
  document_type kyc_document_type NOT NULL,
  file_url TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- DEALS (ESCROW CONTAINER)
-- =========================================================
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title TEXT NOT NULL,
  description TEXT,

  status deal_status NOT NULL DEFAULT 'draft',

  initiator_id UUID NOT NULL REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id),

  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',

  platform_fee_percent NUMERIC(5,2) DEFAULT 5.00 CHECK (platform_fee_percent >= 0),

  initiator_kyc_verified BOOLEAN DEFAULT FALSE,
  recipient_kyc_verified BOOLEAN DEFAULT FALSE,

  -- Payment receipt for bank transfers
  payment_receipt_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- DEAL INVITATIONS (SIGNED LINK SYSTEM)
-- =========================================================
CREATE TABLE deal_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,

  accepted BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- =========================================================
-- ESCROW FUNDS
-- =========================================================
CREATE TABLE escrow_funds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,

  method payment_method NOT NULL,

  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL,

  status escrow_status DEFAULT 'pending',

  -- BANK
  bank_receipt_url TEXT,

  -- CRYPTO
  crypto_tx_hash TEXT,
  crypto_network TEXT,

  funded_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- DEAL ROOM CHAT (REALTIME)
-- =========================================================
CREATE TABLE deal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),

  message TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- DEAL ACTIVITY LOG (AUDIT TRAIL)
-- =========================================================
CREATE TABLE deal_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id),

  action TEXT NOT NULL,
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- DISPUTES
-- =========================================================
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,

  opened_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,

  status dispute_status DEFAULT 'open',

  admin_id UUID REFERENCES profiles(id),
  resolution TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- =========================================================
-- KYX (TRANSACTION RISK CHECKS)
-- =========================================================
CREATE TABLE kyx_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,

  risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
  flagged BOOLEAN DEFAULT FALSE,

  notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),

  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- PAYOUT METHODS
-- =========================================================
CREATE TABLE payout_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  method payment_method NOT NULL,

  -- BANK
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,

  -- CRYPTO
  wallet_address TEXT,
  network TEXT,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- INDEXES (PERFORMANCE)
-- =========================================================
CREATE INDEX idx_deals_initiator ON deals(initiator_id);
CREATE INDEX idx_deals_recipient ON deals(recipient_id);
CREATE INDEX idx_deals_status ON deals(status);

CREATE INDEX idx_escrow_deal ON escrow_funds(deal_id);
CREATE INDEX idx_messages_deal ON deal_messages(deal_id);
CREATE INDEX idx_activity_deal ON deal_activity(deal_id);
CREATE INDEX idx_disputes_deal ON disputes(deal_id);
CREATE INDEX idx_kyx_deal ON kyx_checks(deal_id);
CREATE INDEX idx_invite_token ON deal_invitations(token);

-- =========================================================
-- SAVED PAYMENT METHODS (Sources & Destinations)
-- =========================================================
-- Supported Wallets (Top 20 reference):
-- MetaMask, Coinbase Wallet, Trust Wallet, Phantom, Exodus, 
-- Ledger Live, Trezor Suite, Brave Wallet, Robinhood Wallet,
-- Binance Web3 Wallet, Zerion, 1inch, Rainbow, Argent,
-- Crypto.com DeFi Wallet, BitKeep (Bitget), OKX Wallet,
-- Solflare, Glow, Backpack.

CREATE TABLE user_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  method_type payment_method NOT NULL, -- 'bank' or 'crypto' (reusing existing enum)

  -- COMMON
  label TEXT, -- e.g. "My Chase Checking" or "Primary ETH Wallet"
  is_default BOOLEAN DEFAULT FALSE,

  -- CRYPTO SPECIFIC
  wallet_provider TEXT, -- e.g. 'MetaMask', 'Phantom'
  wallet_address TEXT,
  chain TEXT, -- e.g. 'ETH', 'SOL', 'BTC'

  -- BANK SPECIFIC
  bank_name TEXT,
  account_holder_name TEXT,
  account_number TEXT, -- Encrypt in production!
  routing_number TEXT,
  swift_code TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- ROW LEVEL SECURITY POLICIES
-- =========================================================

-- Enable RLS on deal_invitations
ALTER TABLE deal_invitations ENABLE ROW LEVEL SECURITY;

-- 1. Allow users to insert invitations (if they are creating a deal)
CREATE POLICY "Users can create invitations" 
ON deal_invitations 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 2. Allow users to view invitations sent TO them
-- This is critical for the Dashboard logic to work!
CREATE POLICY "Users can view received invitations" 
ON deal_invitations 
FOR SELECT 
TO authenticated 
USING (
  lower(email) = lower(auth.email())
);

-- 3. Allow users to view invitations they SENT (via deal initiator)
CREATE POLICY "Users can view sent invitations" 
ON deal_invitations 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM deals 
    WHERE deals.id = deal_invitations.deal_id 
    AND deals.initiator_id = auth.uid()
  )
);

-- 4. Allow users to update invitations (accept them) sent TO them
CREATE POLICY "Users can accept their invitations" 
ON deal_invitations 
FOR UPDATE 
TO authenticated 
USING (
  lower(email) = lower(auth.email())
)
WITH CHECK (
  lower(email) = lower(auth.email())
);