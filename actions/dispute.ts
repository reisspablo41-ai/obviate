'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type DisputeState = {
    success?: boolean
    error?: string
}

export async function openDispute(dealId: string, reason: string): Promise<DisputeState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    if (!reason || reason.trim().length < 10) {
        return { error: 'Please provide a detailed reason (at least 10 characters).' }
    }

    try {
        // 1. Verify deal participation
        const { data: deal, error: dealError } = await supabase
            .from('deals')
            .select('*')
            .eq('id', dealId)
            .single()

        if (dealError || !deal) {
            return { error: 'Deal not found' }
        }

        if (deal.initiator_id !== user.id && deal.recipient_id !== user.id) {
            return { error: 'You are not a participant in this deal.' }
        }

        if (deal.status === 'disputed') {
            return { error: 'This deal is already disputed.' }
        }

        // 2. Create Dispute
        const { error: insertError } = await supabase
            .from('disputes')
            .insert({
                deal_id: dealId,
                opened_by: user.id,
                reason: reason.trim(),
                status: 'open'
            })

        if (insertError) {
            console.error('Dispute insert error:', insertError)
            return { error: 'Failed to open dispute: ' + insertError.message }
        }

        // 3. Update Deal Status
        const { error: updateError } = await supabase
            .from('deals')
            .update({ status: 'disputed' })
            .eq('id', dealId)

        if (updateError) {
            console.error('Deal status update error:', updateError)
            // Should rollback dispute creation ideally, but for now we error out.
            return { error: 'Dispute created but failed to update deal status.' }
        }

        // 4. Log Activity
        await supabase.from('deal_activity').insert({
            deal_id: dealId,
            actor_id: user.id,
            action: 'dispute_opened',
            metadata: { reason }
        })

        revalidatePath(`/deals/${dealId}`)
        return { success: true }

    } catch (e: any) {
        return { error: 'System error: ' + e.message }
    }
}

export async function resolveDispute(
    disputeId: string,
    resolution: string,
    action: 'refund_buyer' | 'release_seller' | 'keep_disputed'
): Promise<DisputeState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Check Admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) {
        return { error: 'Unauthorized' }
    }

    try {
        // 1. Fetch Dispute & Deal
        const { data: dispute, error: distError } = await supabase
            .from('disputes')
            .select('*, deal:deals(*)')
            .eq('id', disputeId)
            .single()

        if (distError || !dispute) return { error: 'Dispute not found' }

        const dealId = dispute.deal_id

        // 2. Determine updates
        let newDealStatus = 'disputed'
        if (action === 'refund_buyer') newDealStatus = 'refunded' // Or cancelled? Schema has 'refunded' in escrow_status but deal_status?
        // Checking schema: deal_status has 'draft', 'active', 'funding', 'funded', 'in_review', 'completed', 'disputed'
        // Missing 'refunded' or 'cancelled' in deal_status enum? 
        // Docs/Schema says: CREATE TYPE deal_status AS ENUM ('draft', 'active', 'funding', 'funded', 'in_review', 'completed', 'disputed');
        // If we refund, we likely mark as 'completed' (transaction done) but funds moved differently? 
        // Or we might need to update the ENUM. For now let's stick to 'completed' (resolved) or keep 'disputed'.

        // Actually, if we resolved it, 'completed' makes sense if money moved. 
        // If 'refund_buyer', effectively the deal is closed/cancelled.
        // Let's assume 'completed' for now as "Resolved/Closed".

        if (action !== 'keep_disputed') {
            newDealStatus = 'completed'
        }

        // 3. Update Dispute
        const { error: dUpdateError } = await supabase
            .from('disputes')
            .update({
                status: 'resolved',
                resolution: resolution,
                resolved_at: new Date().toISOString(),
                admin_id: user.id
            })
            .eq('id', disputeId)

        if (dUpdateError) throw dUpdateError

        // 4. Update Deal
        if (newDealStatus !== 'disputed') {
            const { error: dealUpdateError } = await supabase
                .from('deals')
                .update({ status: newDealStatus as any })
                .eq('id', dealId)

            if (dealUpdateError) throw dealUpdateError
        }

        // 5. Log
        await supabase.from('deal_activity').insert({
            deal_id: dealId,
            actor_id: user.id,
            action: 'dispute_resolved',
            metadata: { resolution, action }
        })

        revalidatePath(`/admin/disputes`)
        revalidatePath(`/deals/${dealId}`)
        return { success: true }

    } catch (e: any) {
        console.error(e)
        return { error: 'Resolution failed: ' + e.message }
    }
}
