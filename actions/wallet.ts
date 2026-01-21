'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addPaymentMethod(data: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase.from('user_payment_methods').insert({
        user_id: user.id,
        method_type: data.type,
        label: data.label,
        is_default: data.isDefault || false,
        // Bank Fields
        bank_name: data.bankName,
        account_holder_name: data.accountHolder,
        account_number: data.accountNumber, // Note: In production, encrypt this!
        routing_number: data.routingNumber,
        // Crypto Fields
        wallet_provider: data.walletProvider,
        wallet_address: data.walletAddress,
        chain: data.chain
    });

    if (error) {
        console.error('Add Payment Method Error:', error);
        return { error: error.message };
    }

    revalidatePath('/wallet');
    return { success: true };
}

export async function deletePaymentMethod(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase.from('user_payment_methods').delete().eq('id', id).eq('user_id', user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/wallet');
    return { success: true };
}
