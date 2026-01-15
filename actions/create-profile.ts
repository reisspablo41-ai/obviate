'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export type CreateProfileState = {
    error?: string
    success?: boolean
}

export async function createProfileAction(userId: string, fullName: string, phone: string) {
    const supabase = await createClient()

    // Check if user exists in auth (optional verification, usually we trust the passed ID if we verify session)
    // Actually, we should check the current session to ensure the userId matches the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Not authenticated' }
    }

    if (user.id !== userId) {
        return { error: 'Unauthorized: User ID mismatch' }
    }

    // Attempt to insert profile
    const { error: insertError } = await supabase
        .from('profiles')
        .insert({
            id: userId,
            full_name: fullName,
            is_admin: false,
            // phone is not in profiles table in schema shown earlier, but it is in kyc_verifications.
            // However, user prompt implies they want to save it. 
            // The Schema has `full_name` in profiles. 
            // `phone_number` and `ssn_or_itin` are in `kyc_verifications`.
            // We'll insert full_name into profiles. 
            // If the user wants phone saved, we might not have a column for it in profiles yet, 
            // OR we should create the KYC record now too?
            // The previous code put phone in metadata.
            // Let's stick to profiles schema: id, full_name, avatar_url, is_admin.
        })

    // If phone number is important, we should probably update user metadata or create a placeholder KYC record?
    // For now, let's update metadata as well to be safe
    await supabase.auth.updateUser({
        data: {
            full_name: fullName,
            phone_number: phone
        }
    })

    if (insertError) {
        // If it's a duplicate key error (code 23505), it means profile exists (maybe via trigger).
        // In that case, we should update it instead.
        if (insertError.code === '23505') {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', userId)

            if (updateError) return { error: updateError.message }
        } else {
            console.error('Profile creation error:', insertError)
            return { error: insertError.message }
        }
    }

    return { success: true }
}
