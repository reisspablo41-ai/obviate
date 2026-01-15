'use server'

import { createClient } from '@/utils/supabase/server'

export type SubmitDepositState = {
    success?: boolean
    error?: string
}

export async function submitBankDeposit(
    dealId: string,
    amount: number,
    currency: string,
    receiptPath: string
): Promise<SubmitDepositState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    try {
        // 1. Verify the user is part of this deal
        const { data: deal, error: dealError } = await supabase
            .from('deals')
            .select('*')
            .eq('id', dealId)
            .single()

        if (dealError || !deal) {
            return { error: 'Deal not found' }
        }

        if (deal.initiator_id !== user.id && deal.recipient_id !== user.id) {
            return { error: 'You are not authorized to deposit funds for this deal' }
        }

        // 2. Create escrow_funds record with receipt (file already uploaded by client)
        const { error: escrowError } = await supabase
            .from('escrow_funds')
            .insert({
                deal_id: dealId,
                method: 'bank',
                amount: amount,
                currency: currency,
                status: 'pending',
                bank_receipt_url: receiptPath,
            })

        if (escrowError) {
            console.error('Escrow funds insert error:', escrowError)
            return { error: 'Failed to record deposit: ' + escrowError.message }
        }

        // 3. Update deal status to 'funding' (payment verification pending)
        const { error: updateError } = await supabase
            .from('deals')
            .update({
                status: 'funding',
                payment_receipt_url: receiptPath,
                updated_at: new Date().toISOString()
            })
            .eq('id', dealId)

        if (updateError) {
            console.error('Deal status update error:', updateError)
            return { error: 'Failed to update deal status: ' + updateError.message }
        }

        // 4. Log the activity
        await supabase
            .from('deal_activity')
            .insert({
                deal_id: dealId,
                actor_id: user.id,
                action: 'deposit_submitted',
                metadata: {
                    method: 'bank',
                    amount: amount,
                    currency: currency,
                    receipt_path: receiptPath
                }
            })

        return { success: true }
    } catch (err: any) {
        console.error('Submit deposit error:', err)
        return { error: 'Failed to submit deposit: ' + err.message }
    }
}
