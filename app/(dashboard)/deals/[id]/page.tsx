'use client';
import { useState, use, useEffect } from 'react';
import {
    CheckCircle,
    Clock,

    ShieldCheck,
    DollarSign,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import DepositModal from '@/components/DepositModal';
import { createClient } from '@/utils/supabase/client';
import { confirmDelivery, confirmReceipt } from '@/actions/deal-workflow';
import { useRouter } from 'next/navigation';
import ChatComponent from '@/components/deal/ChatComponent';
import DisputeModal from '@/components/deal/DisputeModal';

interface Deal {
    id: string;
    title: string;
    description: string | null;
    amount: number;
    currency: string;
    status: 'draft' | 'active' | 'funding' | 'funded' | 'in_review' | 'completed' | 'disputed';
    initiator_id: string;
    recipient_id: string | null;
    created_at: string;
    seller_confirmed_delivered?: boolean;
    buyer_confirmed_received?: boolean;
}

export default function DealRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
    const [deal, setDeal] = useState<Deal | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const router = useRouter();

    const fetchDeal = async () => {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUserId(user.id);
        }

        // Fetch deal data
        const { data, error } = await supabase
            .from('deals')
            .select('*')
            .eq('id', resolvedParams.id)
            .single();

        if (data) {
            setDeal(data as Deal);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDeal();
    }, [resolvedParams.id]);

    // Helper to determine user's role in deal
    const getUserRole = () => {
        if (!deal || !currentUserId) return null;
        if (deal.initiator_id === currentUserId) return 'buyer';
        if (deal.recipient_id === currentUserId) return 'seller';
        return null;
    };

    const userRole = getUserRole();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    const handleConfirmDelivery = async () => {
        if (!deal) return;
        setActionLoading(true);
        try {
            const result = await confirmDelivery(deal.id);
            if (result.error) {
                alert(result.error);
            } else {
                fetchDeal(); // Re-fetch to get latest status (including completion)
                router.refresh();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmReceipt = async () => {
        if (!deal) return;
        setActionLoading(true);
        try {
            const result = await confirmReceipt(deal.id);
            if (result.error) {
                alert(result.error);
            } else {
                setDeal(prev => prev ? { ...prev, buyer_confirmed_received: true } : null);
                router.refresh();
                if (deal.seller_confirmed_delivered) {
                    // If other party verified, status will change on backend, locally update to complete to show immediate feedback
                    setDeal(prev => prev ? { ...prev, status: 'completed' } : null);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
        }
    };

    if (!deal) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Deal not found</p>
            </div>
        );
    }

    // Helper to determine step states based on deal status
    const getStepState = (step: 'created' | 'funding' | 'work' | 'completed') => {
        const statusOrder = ['draft', 'active', 'funding', 'funded', 'in_review', 'completed'];
        const currentIndex = statusOrder.indexOf(deal.status);

        switch (step) {
            case 'created':
                return currentIndex >= 0 ? 'completed' : 'pending';
            case 'funding':
                if (deal.status === 'funding') return 'verifying';
                if (currentIndex >= 3) return 'completed'; // funded or later
                return currentIndex >= 1 ? 'active' : 'pending';
            case 'work':
                if (deal.status === 'funded') return 'active'; // Funded means work in progress
                if (currentIndex >= 5) return 'completed'; // completed
                return 'pending';
            case 'completed':
                return deal.status === 'completed' ? 'completed' : 'pending';
            default:
                return 'pending';
        }
    };

    const fundingStepState = getStepState('funding');

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${deal.status === 'funding' ? 'bg-amber-100 text-amber-800' :
                            deal.status === 'funded' ? 'bg-emerald-100 text-emerald-800' :
                                deal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                    deal.status === 'disputed' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                            }`}>
                            {deal.status === 'funding' ? 'Verifying Payment' : deal.status}
                        </span>
                        <span className="text-gray-400 text-sm">#{deal.id.slice(0, 8)}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{deal.title}</h1>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Escrow Amount</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency }).format(deal.amount)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Status & Actions */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Stepper */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            Transaction Status
                        </h3>

                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>

                            <div className="space-y-8 relative">
                                {/* Step 1: Created */}
                                <div className="flex gap-4">
                                    <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-2 border-white shadow-sm">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Deal Started</p>
                                        <p className="text-sm text-gray-500">Agreement created and terms set.</p>
                                    </div>
                                </div>

                                {/* Step 2: Funding */}
                                <div className="flex gap-4">
                                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${fundingStepState === 'completed'
                                        ? 'bg-emerald-100 text-emerald-600'
                                        : fundingStepState === 'verifying'
                                            ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-50'
                                            : fundingStepState === 'active'
                                                ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-50'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {fundingStepState === 'completed' ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : fundingStepState === 'verifying' ? (
                                            <Clock className="w-5 h-5" />
                                        ) : (
                                            <DollarSign className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        {fundingStepState === 'verifying' ? (
                                            <>
                                                <p className="font-medium text-amber-700">Payment Being Verified</p>
                                                <p className="text-sm text-gray-500">
                                                    Payment has been submitted. Our team is verifying the transaction.
                                                </p>
                                                <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                                    <div className="flex items-center gap-2 text-amber-700">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span className="text-sm font-medium">Verification in progress...</span>
                                                    </div>
                                                    <p className="text-xs text-amber-600 mt-1">
                                                        This usually takes 1-24 hours for bank transfers.
                                                    </p>
                                                </div>
                                            </>
                                        ) : fundingStepState === 'completed' ? (
                                            <>
                                                <p className="font-medium text-emerald-700">Funds Secured</p>
                                                <p className="text-sm text-gray-500">Payment verified and held in escrow.</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-medium text-gray-900">Awaiting Funding</p>
                                                <p className="text-sm text-gray-500">Buyer needs to deposit escrow funds.</p>
                                                {userRole === 'buyer' && (
                                                    <button
                                                        onClick={() => setIsDepositModalOpen(true)}
                                                        className="mt-3 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                                                    >
                                                        Deposit Funds Now
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Step 3: Work */}
                                <div className={`flex gap-4 ${getStepState('work') === 'pending' ? 'opacity-50' : ''}`}>
                                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${getStepState('work') === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                        getStepState('work') === 'active' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-50' :
                                            'bg-gray-100 text-gray-400'
                                        }`}>
                                        {getStepState('work') === 'completed' ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <Clock className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Work in Progress</p>
                                        <p className="text-sm text-gray-500 mb-2">Seller provides goods or services.</p>

                                        {/* Status Spinner for Work in Progress */}
                                        {getStepState('work') === 'active' && (
                                            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg mb-3">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-sm font-medium">Order is in progress</span>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        {getStepState('work') === 'active' && userRole === 'seller' && (
                                            <div className="mt-2">
                                                {!deal.seller_confirmed_delivered ? (
                                                    <button
                                                        onClick={handleConfirmDelivery}
                                                        disabled={actionLoading}
                                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                                    >
                                                        {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                                        Confirm Shipped/Delivered
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="text-sm font-medium">You verified delivery. Waiting for buyer.</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {getStepState('work') === 'active' && userRole === 'buyer' && (
                                            <div className="mt-2">
                                                {!deal.buyer_confirmed_received ? (
                                                    <button
                                                        onClick={handleConfirmReceipt}
                                                        disabled={actionLoading}
                                                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                                    >
                                                        {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                                        Confirm Received
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="text-sm font-medium">You verified receipt. Waiting for seller.</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {getStepState('work') === 'active' && !userRole && (
                                            <p className="text-sm text-gray-500 italic mt-2">Waiting for parties to confirm completion.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Step 4: Completion */}
                                <div className={`flex gap-4 ${getStepState('completed') === 'pending' ? 'opacity-50' : ''}`}>
                                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${getStepState('completed') === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Completion & Payout</p>
                                        <p className="text-sm text-gray-500">Funds released to seller.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Activity / Chat */}
                    {currentUserId && (
                        <ChatComponent dealId={deal.id} currentUserId={currentUserId} />
                    )}
                </div>

                {/* Right Column: Details */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Deal Details</h3>
                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="text-gray-500">Your Role</dt>
                                <dd className="font-medium text-gray-900 capitalize">{userRole || 'Participant'}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Platform Fee (5%)</dt>
                                <dd className="font-medium text-gray-900">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency }).format(deal.amount * 0.05)}
                                </dd>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <dt className="text-gray-500 font-medium">Total Required</dt>
                                <dd className="font-bold text-lg text-emerald-600">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency }).format(deal.amount * 1.05)}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4 text-amber-600 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Dispute Resolution
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            If you have an issue with this transaction, you can open a dispute. This will freeze funds until an admin reviews the case.
                        </p>
                        <button
                            onClick={() => setIsDisputeModalOpen(true)}
                            className="w-full px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
                        >
                            Open Dispute
                        </button>
                    </div>
                </div>
            </div>

            {/* Deposit Modal */}
            <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                amount={deal.amount}
                currency={deal.currency}
                dealId={deal.id}
            />

            <DisputeModal
                isOpen={isDisputeModalOpen}
                onClose={() => setIsDisputeModalOpen(false)}
                dealId={deal.id}
            />
        </div>
    );
}
