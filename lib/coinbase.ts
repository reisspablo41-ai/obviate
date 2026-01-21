/**
 * Coinbase Commerce API Client
 * 
 * Provides utilities for creating charges and verifying webhooks
 * @see https://docs.cdp.coinbase.com/commerce-onchain/docs/welcome
 */

import crypto from 'crypto';

const COINBASE_API_URL = 'https://api.commerce.coinbase.com';

interface ChargeInput {
    name: string;
    description: string;
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
    redirectUrl?: string;
    cancelUrl?: string;
}

interface CoinbaseCharge {
    id: string;
    code: string;
    name: string;
    description: string;
    hosted_url: string;
    created_at: string;
    expires_at: string;
    pricing: {
        local: { amount: string; currency: string };
        ethereum?: { amount: string; currency: string };
        usdc?: { amount: string; currency: string };
        bitcoin?: { amount: string; currency: string };
    };
    addresses: {
        ethereum?: string;
        usdc?: string;
        bitcoin?: string;
        polygon?: string;
    };
    timeline: Array<{
        status: string;
        time: string;
    }>;
    metadata?: Record<string, string>;
}

interface CoinbaseChargeResponse {
    data: CoinbaseCharge;
}

/**
 * Create a new Coinbase Commerce charge
 */
export async function createCharge(input: ChargeInput): Promise<CoinbaseCharge> {
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;

    if (!apiKey) {
        throw new Error('COINBASE_COMMERCE_API_KEY is not configured');
    }

    const response = await fetch(`${COINBASE_API_URL}/charges`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CC-Api-Key': apiKey,
            'X-CC-Version': '2018-03-22',
        },
        body: JSON.stringify({
            name: input.name,
            description: input.description,
            pricing_type: 'fixed_price',
            local_price: {
                amount: input.amount.toFixed(2),
                currency: input.currency,
            },
            metadata: input.metadata || {},
            redirect_url: input.redirectUrl,
            cancel_url: input.cancelUrl,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Coinbase Commerce API error:', error);
        throw new Error(`Failed to create charge: ${response.status}`);
    }

    const result: CoinbaseChargeResponse = await response.json();
    return result.data;
}

/**
 * Get an existing charge by ID
 */
export async function getCharge(chargeId: string): Promise<CoinbaseCharge> {
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;

    if (!apiKey) {
        throw new Error('COINBASE_COMMERCE_API_KEY is not configured');
    }

    const response = await fetch(`${COINBASE_API_URL}/charges/${chargeId}`, {
        method: 'GET',
        headers: {
            'X-CC-Api-Key': apiKey,
            'X-CC-Version': '2018-03-22',
        },
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Coinbase Commerce API error:', error);
        throw new Error(`Failed to get charge: ${response.status}`);
    }

    const result: CoinbaseChargeResponse = await response.json();
    return result.data;
}

/**
 * Verify Coinbase Commerce webhook signature
 * @see https://docs.cdp.coinbase.com/commerce-onchain/docs/webhooks-security
 */
export function verifyWebhookSignature(
    payload: string,
    signature: string
): boolean {
    const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('COINBASE_COMMERCE_WEBHOOK_SECRET is not configured');
        return false;
    }

    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

/**
 * Parse webhook event type from timeline
 */
export function getChargeStatus(charge: CoinbaseCharge): string {
    if (charge.timeline.length === 0) {
        return 'NEW';
    }
    return charge.timeline[charge.timeline.length - 1].status;
}

export type { CoinbaseCharge, ChargeInput };
