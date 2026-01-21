import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, CoinbaseCharge } from '@/lib/coinbase';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const signature = req.headers.get('x-cc-webhook-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    try {
        const isValid = verifyWebhookSignature(rawBody, signature);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(rawBody);
        const charge = event.data as CoinbaseCharge;
        const eventType = event.type;

        // Initialize Supabase client
        const supabase = await createClient();

        // Handle specific event types
        // See: https://docs.cdp.coinbase.com/commerce-onchain/docs/webhooks-events
        switch (eventType) {
            case 'charge:confirmed':
                // Payment confirmed on blockchain
                if (charge.metadata?.dealId) {
                    // Retrieve the deal to ensure it exists and get current status
                    const { data: deal, error: fetchError } = await supabase
                        .from('deals')
                        .select('*')
                        .eq('id', charge.metadata.dealId)
                        .single();

                    if (fetchError || !deal) {
                        console.error('Deal not found for webhook:', charge.metadata.dealId);
                        break;
                    }

                    // Update deal status to funded
                    // You might want to store more metadata like the transaction hash or payment amount
                    const { error: updateError } = await supabase
                        .from('deals')
                        .update({
                            status: 'funded',
                            payment_status: 'paid', // Assuming you have this field or similar
                            payment_method: 'crypto',
                            payment_id: charge.id
                        })
                        .eq('id', charge.metadata.dealId);

                    if (updateError) {
                        console.error('Failed to update deal status:', updateError);
                        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                    }
                }
                break;

            case 'charge:failed':
                // Payment failed or expired
                if (charge.metadata?.dealId) {
                    console.log(`Charge failed for deal ${charge.metadata.dealId}`);
                    // logical handling for failure if needed
                }
                break;

            case 'charge:pending':
                // Payment detected but not yet confirmed
                break;
        }

        return NextResponse.json({ message: 'Webhook processed successfully' });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
