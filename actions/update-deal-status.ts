'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type UpdateDealStatusState = {
    success?: boolean
    error?: string
}

export async function updateDealStatus(
    dealId: string,
    newStatus: 'draft' | 'active' | 'funding' | 'funded' | 'in_review' | 'completed' | 'disputed'
): Promise<UpdateDealStatusState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) {
        return { error: 'Unauthorized: Admin access required' }
    }

    try {
        // Update deal status
        const { error: updateError } = await supabase
            .from('deals')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', dealId)

        if (updateError) {
            console.error('Deal status update error:', updateError)
            return { error: 'Failed to update deal status: ' + updateError.message }
        }

        // If status is being set to 'funded', also update escrow_funds status
        if (newStatus === 'funded') {
            await supabase
                .from('escrow_funds')
                .update({
                    status: 'confirmed',
                    funded_at: new Date().toISOString()
                })
                .eq('deal_id', dealId)
        }

        // Log the activity
        await supabase
            .from('deal_activity')
            .insert({
                deal_id: dealId,
                actor_id: user.id,
                action: `status_changed_to_${newStatus}`,
                metadata: {
                    new_status: newStatus,
                    updated_by: 'admin'
                }
            })

        revalidatePath('/admin/deals')
        return { success: true }
    } catch (err: any) {
        console.error('Update deal status error:', err)
        return { error: 'Failed to update status: ' + err.message }
    }
}
