-- =========================================================
-- COMPLETE RLS POLICIES (Invitations & KYC)
-- =========================================================

-- 1. DEAL INVITATIONS
ALTER TABLE deal_invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create invitations" ON deal_invitations;
CREATE POLICY "Users can create invitations" 
ON deal_invitations FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view received invitations" ON deal_invitations;
CREATE POLICY "Users can view received invitations" 
ON deal_invitations FOR SELECT TO authenticated 
USING ( lower(email) = lower(auth.email()) );

DROP POLICY IF EXISTS "Users can view sent invitations" ON deal_invitations;
CREATE POLICY "Users can view sent invitations" 
ON deal_invitations FOR SELECT TO authenticated 
USING ( EXISTS ( SELECT 1 FROM deals WHERE deals.id = deal_invitations.deal_id AND deals.initiator_id = auth.uid() ) );

DROP POLICY IF EXISTS "Users can accept their invitations" ON deal_invitations;
CREATE POLICY "Users can accept their invitations" 
ON deal_invitations FOR UPDATE TO authenticated 
USING ( lower(email) = lower(auth.email()) );


-- 2. KYC VERIFICATIONS
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own kyc" ON kyc_verifications;
CREATE POLICY "Users can view own kyc" ON kyc_verifications 
FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own kyc" ON kyc_verifications;
CREATE POLICY "Users can insert own kyc" ON kyc_verifications 
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own kyc" ON kyc_verifications;
CREATE POLICY "Users can update own kyc" ON kyc_verifications 
FOR UPDATE TO authenticated USING (user_id = auth.uid());


-- 3. KYC DOCUMENTS
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own kyc docs" ON kyc_documents;
CREATE POLICY "Users can view own kyc docs" ON kyc_documents 
FOR SELECT TO authenticated 
USING (
  EXISTS (SELECT 1 FROM kyc_verifications WHERE id = kyc_documents.kyc_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can insert own kyc docs" ON kyc_documents;
CREATE POLICY "Users can insert own kyc docs" ON kyc_documents 
FOR INSERT TO authenticated 
WITH CHECK (
  EXISTS (SELECT 1 FROM kyc_verifications WHERE id = kyc_documents.kyc_id AND user_id = auth.uid())
);


-- =========================================================
-- 4. DEALS TABLE RLS POLICIES
-- =========================================================
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Users can view deals they are part of (initiator or recipient)
DROP POLICY IF EXISTS "Users can view own deals" ON deals;
CREATE POLICY "Users can view own deals" ON deals 
FOR SELECT TO authenticated 
USING (
  initiator_id = auth.uid() OR recipient_id = auth.uid()
);

-- Admins can view all deals
DROP POLICY IF EXISTS "Admins can view all deals" ON deals;
CREATE POLICY "Admins can view all deals" ON deals 
FOR SELECT TO authenticated 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Users can insert deals (as initiator)
DROP POLICY IF EXISTS "Users can create deals" ON deals;
CREATE POLICY "Users can create deals" ON deals 
FOR INSERT TO authenticated 
WITH CHECK (initiator_id = auth.uid());

-- Users can update their own deals
DROP POLICY IF EXISTS "Users can update own deals" ON deals;
CREATE POLICY "Users can update own deals" ON deals 
FOR UPDATE TO authenticated 
USING (initiator_id = auth.uid() OR recipient_id = auth.uid());

-- Admins can update any deal
DROP POLICY IF EXISTS "Admins can update all deals" ON deals;
CREATE POLICY "Admins can update all deals" ON deals 
FOR UPDATE TO authenticated 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);


-- =========================================================
-- 5. ESCROW FUNDS TABLE RLS POLICIES  
-- =========================================================
ALTER TABLE escrow_funds ENABLE ROW LEVEL SECURITY;

-- Users can view escrow funds for their deals
DROP POLICY IF EXISTS "Users can view own escrow funds" ON escrow_funds;
CREATE POLICY "Users can view own escrow funds" ON escrow_funds 
FOR SELECT TO authenticated 
USING (
  EXISTS (SELECT 1 FROM deals WHERE deals.id = escrow_funds.deal_id AND (deals.initiator_id = auth.uid() OR deals.recipient_id = auth.uid()))
);

-- Users can insert escrow funds for their deals
DROP POLICY IF EXISTS "Users can insert escrow funds" ON escrow_funds;
CREATE POLICY "Users can insert escrow funds" ON escrow_funds 
FOR INSERT TO authenticated 
WITH CHECK (
  EXISTS (SELECT 1 FROM deals WHERE deals.id = escrow_funds.deal_id AND (deals.initiator_id = auth.uid() OR deals.recipient_id = auth.uid()))
);

-- Admins can view all escrow funds
DROP POLICY IF EXISTS "Admins can view all escrow funds" ON escrow_funds;
CREATE POLICY "Admins can view all escrow funds" ON escrow_funds 
FOR SELECT TO authenticated 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Admins can update all escrow funds
DROP POLICY IF EXISTS "Admins can update all escrow funds" ON escrow_funds;
CREATE POLICY "Admins can update all escrow funds" ON escrow_funds 
FOR UPDATE TO authenticated 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);


-- =========================================================
-- STORAGE RLS POLICIES (escrow-storage)
-- =========================================================
-- Note: You must insert the bucket 'escrow-storage' into storage.buckets first if not exists.
 
INSERT INTO storage.buckets (id, name, public) 
VALUES ('escrow-storage', 'escrow-storage', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload to their own folder: user_id/*
DROP POLICY IF EXISTS "Users can upload own kyc documents" ON storage.objects;
CREATE POLICY "Users can upload own kyc documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'escrow-storage' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to upload receipts: receipts/*
DROP POLICY IF EXISTS "Users can upload receipts" ON storage.objects;
CREATE POLICY "Users can upload receipts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'escrow-storage' AND
  (storage.foldername(name))[1] = 'receipts'
);

-- Allow users to view/download their own files
DROP POLICY IF EXISTS "Users can view own kyc documents" ON storage.objects;
CREATE POLICY "Users can view own kyc documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'escrow-storage' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view receipts (for their deals)
DROP POLICY IF EXISTS "Users can view receipts" ON storage.objects;
CREATE POLICY "Users can view receipts"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'escrow-storage' AND
  (storage.foldername(name))[1] = 'receipts'
);

-- Admins can view all storage objects
DROP POLICY IF EXISTS "Admins can view all storage" ON storage.objects;
CREATE POLICY "Admins can view all storage"
ON storage.objects FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
