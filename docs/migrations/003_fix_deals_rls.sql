-- Fix RLS policies for deals table
-- Ensure RLS is enabled
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- 1. VIEW POLICY
-- Allow participants (initiator/recipient) and admins to view deals
DROP POLICY IF EXISTS "Users can view own deals" ON deals;
CREATE POLICY "Users can view own deals" ON deals 
FOR SELECT TO authenticated 
USING (
  initiator_id = auth.uid() 
  OR recipient_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 2. UPDATE POLICY
-- Allow participants to update deals (e.g. for confirming delivery/receipt)
DROP POLICY IF EXISTS "Users can update own deals" ON deals;
CREATE POLICY "Users can update own deals" ON deals 
FOR UPDATE TO authenticated 
USING (
  initiator_id = auth.uid() 
  OR recipient_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 3. INSERT POLICY
-- Allow authenticated users to create deals
DROP POLICY IF EXISTS "Users can create deals" ON deals;
CREATE POLICY "Users can create deals" ON deals 
FOR INSERT TO authenticated 
WITH CHECK (
  initiator_id = auth.uid()
);
