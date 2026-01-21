import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createCharge } from '@/lib/coinbase';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { dealId, amount, currency } = body;

        if (!dealId || !amount || !currency) {
            return NextResponse.json(
                { error: 'Missing required fields: dealId, amount, currency' },
                { status: 400 }
            );
        }

        // Verify user is part of this deal
        const { data: deal, error: dealError } = await supabase
            .from('deals')
            .select('*')
            .eq('id', dealId)
            .single();

        if (dealError || !deal) {
            return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
        }

        if (deal.initiator_id !== user.id && deal.recipient_id !== user.id) {
            return NextResponse.json(
                { error: 'You are not authorized for this deal' },
                { status: 403 }
            );
        }

        // Calculate total with fee (5%)
        const fee = amount * 0.05;
        const totalAmount = amount + fee;

        // Create Coinbase Commerce charge
        const charge = await createCharge({
            name: `Escrow Deposit - ${deal.title}`,
            description: `Funding escrow for deal: ${deal.title}`,
            amount: totalAmount,
            currency: currency,
            metadata: {
                deal_id: dealId,
                user_id: user.id,
                original_amount: amount.toString(),
                fee: fee.toString(),
            },
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/deals/${dealId}?payment=success`,
            cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/deals/${dealId}?payment=cancelled`,
        });

        // Create pending escrow_funds record
        const { error: escrowError } = await supabase.from('escrow_funds').insert({
            deal_id: dealId,
            method: 'crypto',
            amount: totalAmount,
            currency: currency,
            status: 'pending',
            coinbase_charge_id: charge.id,
            coinbase_charge_code: charge.code,
            crypto_network: 'multiple', // Coinbase supports multiple networks
        });

        if (escrowError) {
            console.error('Failed to create escrow_funds record:', escrowError);
            // Don't fail the request - charge is still valid
        }

        // Log activity
        await supabase.from('deal_activity').insert({
            deal_id: dealId,
            actor_id: user.id,
            action: 'crypto_deposit_initiated',
            metadata: {
                charge_id: charge.id,
                charge_code: charge.code,
                amount: totalAmount,
                currency: currency,
            },
        });

        return NextResponse.json({
            success: true,
            charge: {
                id: charge.id,
                code: charge.code,
                hostedUrl: charge.hosted_url,
                expiresAt: charge.expires_at,
                addresses: charge.addresses,
                pricing: charge.pricing,
            },
        });
    } catch (error: any) {
        console.error('Create charge error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create charge' },
            { status: 500 }
        );
    }
}
