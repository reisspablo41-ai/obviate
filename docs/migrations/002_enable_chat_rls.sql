-- Enable RLS on deal_messages
ALTER TABLE deal_messages ENABLE ROW LEVEL SECURITY;

-- Allow participants (initiator/recipient) and admins to view messages for a deal
DROP POLICY IF EXISTS "Users can view messages for their deals" ON deal_messages;
CREATE POLICY "Users can view messages for their deals"
ON deal_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM deals
    WHERE deals.id = deal_messages.deal_id
    AND (
      deals.initiator_id = auth.uid()
      OR deals.recipient_id = auth.uid()
    )
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Allow participants to insert messages for deals they are part of
DROP POLICY IF EXISTS "Users can send messages to their deals" ON deal_messages;
CREATE POLICY "Users can send messages to their deals"
ON deal_messages FOR INSERT
TO authenticated
WITH CHECK (
  -- 1. User must be the sender
  sender_id = auth.uid()
  AND
  -- 2. User must be part of the deal
  EXISTS (
    SELECT 1 FROM deals
    WHERE deals.id = deal_messages.deal_id
    AND (
      deals.initiator_id = auth.uid()
      OR deals.recipient_id = auth.uid()
    )
  )
);
