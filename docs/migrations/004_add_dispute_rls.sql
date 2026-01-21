-- Enable RLS on disputes
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- 1. INSERT POLICY
-- Users can open disputes for deals they are part of
DROP POLICY IF EXISTS "Users can open disputes" ON disputes;
CREATE POLICY "Users can open disputes" 
ON disputes FOR INSERT 
TO authenticated 
WITH CHECK (
  opened_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM deals 
    WHERE deals.id = disputes.deal_id 
    AND (deals.initiator_id = auth.uid() OR deals.recipient_id = auth.uid())
  )
);

-- 2. VIEW POLICY
-- Users can view disputes they opened OR disputes for deals they are part of
-- Admins can view all disputes
DROP POLICY IF EXISTS "Users can view relevant disputes" ON disputes;
CREATE POLICY "Users can view relevant disputes" 
ON disputes FOR SELECT 
TO authenticated 
USING (
  opened_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM deals 
    WHERE deals.id = disputes.deal_id 
    AND (deals.initiator_id = auth.uid() OR deals.recipient_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 3. UPDATE POLICY
-- Admins can update disputes (resolve them)
DROP POLICY IF EXISTS "Admins can update disputes" ON disputes;
CREATE POLICY "Admins can update disputes" 
ON disputes FOR UPDATE 
TO authenticated 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
