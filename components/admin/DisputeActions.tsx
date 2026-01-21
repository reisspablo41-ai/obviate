'use client';

import { useState } from 'react';
import { resolveDispute } from '@/actions/dispute';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DisputeActionsProps {
    disputeId: string;
    dealId: string;
}

export default function DisputeActions({ disputeId, dealId }: DisputeActionsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleResolve = async (action: 'refund_buyer' | 'release_seller') => {
        if (!confirm('Are you sure you want to resolve this dispute? This action is irreversible.')) return;

        setLoading(true);
        const resolutionText = prompt('Enter resolution details/reason:');
        if (!resolutionText) {
            setLoading(false);
            return;
        }

        try {
            const result = await resolveDispute(disputeId, resolutionText, action);
            if (result.error) {
                alert(result.error);
            } else {
                router.refresh();
            }
        } catch (e) {
            console.error(e);
            alert('Failed to resolve dispute');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={() => handleResolve('release_seller')}
                disabled={loading}
                className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
                Release to Seller
            </button>
            <button
                onClick={() => handleResolve('refund_buyer')}
                disabled={loading}
                className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
                Refund Buyer
            </button>
            {loading && <Loader2 className="w-4 h-4 animate-spin mx-auto text-gray-400" />}
        </div>
    );
}
