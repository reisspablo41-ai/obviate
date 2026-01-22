-- RPC to securely accept a deal with better error reporting
-- Bypass RLS to allow the new recipient to update the deal record being joined

-- Drop existing function first because we changed the return type from void to JSON
DROP FUNCTION IF EXISTS accept_deal_securely(uuid, uuid, uuid);

CREATE OR REPLACE FUNCTION accept_deal_securely(
    p_deal_id uuid,
    p_invite_id uuid,
    p_user_id uuid
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deal_updated int;
    v_invite_updated int;
BEGIN
    -- 1. Update the deal
    UPDATE deals
    SET 
        recipient_id = p_user_id,
        status = 'active',
        updated_at = now()
    WHERE id = p_deal_id;
    
    GET DIAGNOSTICS v_deal_updated = ROW_COUNT;

    -- 2. Mark invitation as accepted
    UPDATE deal_invitations
    SET 
        accepted = true,
        accepted_at = now()
    WHERE id = p_invite_id;
    
    GET DIAGNOSTICS v_invite_updated = ROW_COUNT;

    IF v_deal_updated = 0 OR v_invite_updated = 0 THEN
        RETURN json_build_object(
            'success', false, 
            'message', format('Failed to update. Deal rows: %s, Invite rows: %s', v_deal_updated, v_invite_updated),
            'deal_id', p_deal_id,
            'invite_id', p_invite_id
        );
    END IF;

    RETURN json_build_object('success', true);
END;
$$;
