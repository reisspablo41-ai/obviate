'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type ConfirmationState = {
    success?: boolean
    error?: string
}

export async function confirmDelivery(dealId: string): Promise<ConfirmationState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    try {
        // 1. Fetch deal to verify authority and current state
        const { data: deal, error: dealError } = await supabase
            .from('deals')
            .select('*')
            .eq('id', dealId)
            .single()

        if (dealError || !deal) {
            return { error: 'Deal not found' }
        }

        if (deal.recipient_id !== user.id) {
            return { error: 'Only the seller (recipient) can confirm delivery' }
        }

        // 2. Update seller confirmation
        const updates: any = {
            seller_confirmed_delivered: true
        }

        // 3. Check if buyer already confirmed
        console.log('Confirming Delivery. Current state:', {
            seller_confirmed: deal.seller_confirmed_delivered,
            buyer_confirmed: deal.buyer_confirmed_received
        })

        if (deal.buyer_confirmed_received) {
            console.log('Buyer already confirmed. setting status to completed')
            updates.status = 'completed'
            updates.updated_at = new Date().toISOString()
        }

        const { data: updatedDeals, error: updateError } = await supabase
            .from('deals')
            .update(updates)
            .eq('id', dealId)
            .select()

        if (updateError) {
            console.error('Update error:', updateError)
            return { error: 'Failed to update deal: ' + updateError.message }
        }

        const updatedDeal = updatedDeals && updatedDeals.length > 0 ? updatedDeals[0] : null;

        if (!updatedDeal) {
            console.error('Update returned no data. Possible RLS blocking or ID mismatch for Delivery confirmation.')
            return { error: 'Update failed. You successfully viewed the deal but cannot update it. Database RLS policies likely need the 003_fix_deals_rls.sql migration.' }
        }
        console.log('Update success. New Deal State:', updates)

        // 4. Log activity
        await supabase.from('deal_activity').insert({
            deal_id: dealId,
            actor_id: user.id,
            action: 'seller_confirmed_delivery',
            metadata: {
                previous_status: deal.status,
                new_status: updates.status || deal.status
            }
        })

        revalidatePath(`/deals/${dealId}`)
        return { success: true }
    } catch (err: any) {
        return { error: 'System error: ' + err.message }
    }
}

export async function confirmReceipt(dealId: string): Promise<ConfirmationState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    try {
        // 1. Fetch deal to verify authority and current state
        const { data: deal, error: dealError } = await supabase
            .from('deals')
            .select('*')
            .eq('id', dealId)
            .single()

        if (dealError || !deal) {
            return { error: 'Deal not found' }
        }

        if (deal.initiator_id !== user.id) {
            return { error: 'Only the buyer (initiator) can confirm receipt' }
        }

        // 2. Update buyer confirmation
        const updates: any = {
            buyer_confirmed_received: true
        }

        // 3. Check if seller already confirmed
        console.log('Confirming Receipt. Current state:', {
            seller_confirmed: deal.seller_confirmed_delivered,
            buyer_confirmed: deal.buyer_confirmed_received
        })

        if (deal.seller_confirmed_delivered) {
            console.log('Seller already confirmed. setting status to completed')
            updates.status = 'completed'
            updates.updated_at = new Date().toISOString()
        }

        const { data: updatedDeals, error: updateError } = await supabase
            .from('deals')
            .update(updates)
            .eq('id', dealId)
            .select()

        if (updateError) {
            console.error('Update error:', updateError)
            return { error: 'Failed to update deal: ' + updateError.message }
        }

        const updatedDeal = updatedDeals && updatedDeals.length > 0 ? updatedDeals[0] : null;

        if (!updatedDeal) {
            console.error('Update returned no data. Possible RLS blocking or ID mismatch for Receipt confirmation.')
            return { error: 'Update failed. You successfully viewed the deal but cannot update it. Database RLS policies likely need the 003_fix_deals_rls.sql migration.' }
        }
        console.log('Update success.', updates)

        // 4. Log activity
        await supabase.from('deal_activity').insert({
            deal_id: dealId,
            actor_id: user.id,
            action: 'buyer_confirmed_receipt',
            metadata: {
                previous_status: deal.status,
                new_status: updates.status || deal.status
            }
        })

        revalidatePath(`/deals/${dealId}`)
        return { success: true }

    } catch (err: any) {
        return { error: 'System error: ' + err.message }
    }
}
