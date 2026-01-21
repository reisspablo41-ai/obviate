import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature, getChargeStatus } from '@/lib/coinbase';

// Use service role for webhook (no user context)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPBASE_SECRET_KEY!
);

interface WebhookEvent {
    id: string;
    type: string;
    data: {
        id: string;
        code: string;
        metadata?: {
            deal_id?: string;
            user_id?: string;
        };
        timeline: Array<{
            status: string;
            time: string;
        }>;
        payments?: Array<{
            network: string;
            transaction_id: string;
            status: string;
            value: {
                local: { amount: string; currency: string };
                crypto: { amount: string; currency: string };
            };
        }>;
    };
}

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-cc-webhook-signature');

        if (!signature) {
            console.error('Missing webhook signature');
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        // Verify webhook signature
        const isValid = verifyWebhookSignature(rawBody, signature);
        if (!isValid) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event: WebhookEvent = JSON.parse(rawBody);
        console.log('Coinbase webhook event:', event.type, event.data.code);

        const chargeId = event.data.id;
        const chargeCode = event.data.code;
        const dealId = event.data.metadata?.deal_id;
        const status = getChargeStatus(event.data as any);

        if (!dealId) {
            console.error('No deal_id in charge metadata');
            return NextResponse.json({ error: 'Missing deal_id' }, { status: 400 });
        }

        // Handle different event types
        switch (event.type) {
            case 'charge:confirmed':
            case 'charge:resolved': {
                // Payment confirmed - update deal to funded
                const payment = event.data.payments?.[0];
                const txHash = payment?.transaction_id;
                const network = payment?.network;

                // Update escrow_funds record
                const { error: escrowError } = await supabaseAdmin
                    .from('escrow_funds')
                    .update({
                        status: 'confirmed',
                        funded_at: new Date().toISOString(),
                        crypto_tx_hash: txHash,
                        crypto_network: network,
                    })
                    .eq('coinbase_charge_id', chargeId);

                if (escrowError) {
                    console.error('Failed to update escrow_funds:', escrowError);
                }

                // Update deal status to funded
                const { error: dealError } = await supabaseAdmin
                    .from('deals')
                    .update({
                        status: 'funded',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', dealId);

                if (dealError) {
                    console.error('Failed to update deal status:', dealError);
                }

                // Log activity
                await supabaseAdmin.from('deal_activity').insert({
                    deal_id: dealId,
                    action: 'crypto_deposit_confirmed',
                    metadata: {
                        charge_id: chargeId,
                        charge_code: chargeCode,
                        tx_hash: txHash,
                        network: network,
                        status: status,
                    },
                });

                console.log(`Deal ${dealId} funded via crypto payment`);
                break;
            }

            case 'charge:failed':
            case 'charge:expired': {
                // Payment failed or expired
                const { error: escrowError } = await supabaseAdmin
                    .from('escrow_funds')
                    .update({ status: 'pending' }) // Keep as pending, user can retry
                    .eq('coinbase_charge_id', chargeId);

                if (escrowError) {
                    console.error('Failed to update escrow_funds:', escrowError);
                }

                // Log activity
                await supabaseAdmin.from('deal_activity').insert({
                    deal_id: dealId,
                    action: event.type === 'charge:expired' ? 'crypto_deposit_expired' : 'crypto_deposit_failed',
                    metadata: {
                        charge_id: chargeId,
                        charge_code: chargeCode,
                        status: status,
                    },
                });

                console.log(`Crypto payment ${event.type} for deal ${dealId}`);
                break;
            }

            case 'charge:pending': {
                // Payment detected but not confirmed yet
                await supabaseAdmin.from('deal_activity').insert({
                    deal_id: dealId,
                    action: 'crypto_deposit_pending',
                    metadata: {
                        charge_id: chargeId,
                        charge_code: chargeCode,
                        status: status,
                    },
                });
                break;
            }

            default:
                console.log('Unhandled webhook event type:', event.type);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: error.message || 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
