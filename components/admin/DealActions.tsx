'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, CheckCircle, Loader2, X, ExternalLink } from 'lucide-react';
import { updateDealStatus } from '@/actions/update-deal-status';
import { createClient } from '@/utils/supabase/client';

interface DealActionsProps {
    dealId: string;
    dealStatus: string;
    dealTitle: string;
    paymentReceiptUrl: string | null;
}

export default function DealActions({ dealId, dealStatus, dealTitle, paymentReceiptUrl }: DealActionsProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
    const [loadingReceipt, setLoadingReceipt] = useState(false);

    const handleViewReceipt = async () => {
        if (!paymentReceiptUrl) return;

        setLoadingReceipt(true);
        try {
            const supabase = createClient();
            const bucketName = process.env.NEXT_PUBLIC_ESCROW_STORAGE_BUCKET || 'escrow-storage';

            // Debug: log the path being used
            console.log('--- RECEIPT DEBUG ---');
            console.log('Bucket name:', bucketName);
            console.log('Receipt path from DB:', paymentReceiptUrl);

            // Use createSignedUrl for private buckets (expires in 1 hour)
            const { data, error } = await supabase.storage
                .from(bucketName)
                .createSignedUrl(paymentReceiptUrl, 3600);

            if (error) {
                console.error('Failed to create signed URL:', error);
                alert('Failed to load receipt: ' + error.message);
                return;
            }

            if (data?.signedUrl) {
                setReceiptUrl(data.signedUrl);
                setShowReceiptModal(true);
            }
        } catch (error) {
            console.error('Failed to get receipt URL:', error);
            alert('Failed to load receipt');
        } finally {
            setLoadingReceipt(false);
        }
    };

    const handleMarkAsFunded = async () => {
        if (!confirm(`Are you sure you want to mark "${dealTitle}" as funded? This confirms the payment has been verified.`)) {
            return;
        }

        setIsUpdating(true);
        try {
            const result = await updateDealStatus(dealId, 'funded');

            if (result.error) {
                alert(result.error);
                return;
            }

            router.refresh();
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update deal status');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-2">
                {/* View Receipt Button - only show for funding/funded status with receipt */}
                {paymentReceiptUrl && (
                    <button
                        onClick={handleViewReceipt}
                        disabled={loadingReceipt}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                        title="View Payment Receipt"
                    >
                        {loadingReceipt ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <Eye className="w-3 h-3" />
                        )}
                        Receipt
                    </button>
                )}

                {/* Mark as Funded Button - only show for funding status */}
                {dealStatus === 'funding' && (
                    <button
                        onClick={handleMarkAsFunded}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Verify and Mark as Funded"
                    >
                        {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <CheckCircle className="w-3 h-3" />
                        )}
                        Mark Funded
                    </button>
                )}
            </div>

            {/* Receipt Modal */}
            {showReceiptModal && receiptUrl && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Payment Receipt</h3>
                            <div className="flex items-center gap-2">
                                <a
                                    href={receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Open in new tab"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                                <button
                                    onClick={() => setShowReceiptModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 max-h-[70vh] overflow-auto">
                            <img
                                src={receiptUrl}
                                alt="Payment receipt"
                                className="w-full rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
