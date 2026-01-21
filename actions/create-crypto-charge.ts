'use server';

import { createClient } from '@/utils/supabase/server';

export interface CreateCryptoChargeResult {
    success?: boolean;
    error?: string;
    charge?: {
        id: string;
        code: string;
        hostedUrl: string;
        expiresAt: string;
        addresses: Record<string, string>;
        pricing: Record<string, { amount: string; currency: string }>;
    };
}

/**
 * Server action to create a Coinbase Commerce charge for crypto deposits
 */
export async function createCryptoCharge(
    dealId: string,
    amount: number,
    currency: string
): Promise<CreateCryptoChargeResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    try {
        // Call our API route to create the charge
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/coinbase/create-charge`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dealId,
                    amount,
                    currency,
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.error || 'Failed to create charge' };
        }

        const data = await response.json();
        return {
            success: true,
            charge: data.charge,
        };
    } catch (error: any) {
        console.error('Create crypto charge error:', error);
        return { error: error.message || 'Failed to create crypto charge' };
    }
}
