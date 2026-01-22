-- Securely fetch invite details by token, bypassing RLS for the specific deal info needed
-- This function is SECURITY DEFINER so it runs with the privileges of the creator
CREATE OR REPLACE FUNCTION get_invite_details_by_token(p_token text)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'id', di.id,
        'email', di.email,
        'token', di.token,
        'accepted', di.accepted,
        'deal_id', di.deal_id,
        'deal', json_build_object(
            'id', d.id,
            'title', d.title,
            'amount', d.amount,
            'currency', d.currency,
            'description', d.description,
            'status', d.status
        ),
        'initiator', json_build_object(
            'full_name', p.full_name,
            'email', u.email -- Fetch email from auth.users
        )
    )
    INTO result
    FROM deal_invitations di
    JOIN deals d ON di.deal_id = d.id
    LEFT JOIN profiles p ON d.initiator_id = p.id
    LEFT JOIN auth.users u ON d.initiator_id = u.id -- Join auth.users
    WHERE di.token = p_token::uuid;

    RETURN result;
END;
$$;

-- Securely fetch all pending invites for a user by email
CREATE OR REPLACE FUNCTION get_user_pending_invites(p_email text)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', di.id,
            'email', di.email,
            'token', di.token,
            'accepted', di.accepted,
            'deal_id', di.deal_id,
            'deal', json_build_object(
                'id', d.id,
                'title', d.title,
                'amount', d.amount,
                'currency', d.currency,
                'description', d.description,
                'status', d.status,
                'initiator', json_build_object(
                    'full_name', p.full_name,
                    'email', u.email -- Fetch email from auth.users
                )
            )
        )
    )
    INTO result
    FROM deal_invitations di
    JOIN deals d ON di.deal_id = d.id
    LEFT JOIN profiles p ON d.initiator_id = p.id
    LEFT JOIN auth.users u ON d.initiator_id = u.id -- Join auth.users
    WHERE di.email = p_email AND di.accepted = false;

    RETURN COALESCE(result, '[]'::json);
END;
$$;
