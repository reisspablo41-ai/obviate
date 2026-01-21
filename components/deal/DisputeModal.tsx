'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { openDispute } from '@/actions/dispute';
import { useRouter } from 'next/navigation';

interface DisputeModalProps {
    isOpen: boolean;
    onClose: () => void;
    dealId: string;
}

export default function DisputeModal({ isOpen, onClose, dealId }: DisputeModalProps) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!reason || reason.trim().length < 10) return;

        setLoading(true);
        try {
            const result = await openDispute(dealId, reason);
            if (result.error) {
                alert(result.error);
            } else {
                onClose();
                router.refresh();
            }
        } catch (e) {
            console.error(e);
            alert('Failed to open dispute');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        <h2 className="text-xl font-bold text-gray-900">Open a Dispute</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 mb-4 text-sm">
                        Disputes freeze the transaction and require admin intervention.
                        Please describe the issue in detail.
                    </p>

                    <div className="space-y-4">
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Describe the issue... (e.g., Item not received, Item damaged, Service not as described)"
                            className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                        <p className="text-xs text-gray-500">
                            Minimum 10 characters. Providing false information may lead to account suspension.
                        </p>
                    </div>

                    <div className="mt-6 flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || reason.trim().length < 10}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Submit Dispute
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
