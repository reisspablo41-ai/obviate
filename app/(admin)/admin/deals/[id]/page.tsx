import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Clock, CreditCard, Shield, User, FileText, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { notFound } from 'next/navigation';
import { formatDistanceToNow, format } from 'date-fns';

export default async function AdminDealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // 1. Fetch Deal
    const { data: deal, error: dealError } = await supabase
        .from('deals')
        .select('*')
        .eq('id', id)
        .single();

    if (dealError || !deal) {
        return notFound();
    }

    // 2. Fetch Profiles (Initiator & Recipient)
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', [deal.initiator_id, deal.recipient_id].filter(Boolean));

    const initiator = profiles?.find(p => p.id === deal.initiator_id);
    const recipient = profiles?.find(p => p.id === deal.recipient_id);

    // 3. Fetch Activity Log
    const { data: activities } = await supabase
        .from('deal_activity')
        .select('*')
        .eq('deal_id', id)
        .order('created_at', { ascending: false });

    // 4. Fetch Disputes (if any)
    const { data: disputes } = await supabase
        .from('disputes')
        .select('*')
        .eq('deal_id', id);

    const hasOpenDisputes = disputes?.some(d => d.status === 'open');

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header / Back Link */}
            <div className="flex items-center gap-4">
                <Link href="/admin/deals" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{deal.title}</h1>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        ID: <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{deal.id}</span>
                        <span>•</span>
                        Created {format(new Date(deal.created_at), 'PPP')}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${deal.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            deal.status === 'disputed' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                        {deal.status.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Financial Overview */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            Financial Details
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Deal Amount</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency }).format(deal.amount)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Platform Fee (5%)</p>
                                <p className="text-xl font-medium text-gray-700">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency }).format(deal.amount * 0.05)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Participants */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Initiator (Buyer)</h3>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{initiator?.full_name || 'Unknown'}</p>
                                    <p className="text-sm text-gray-500">{initiator?.email}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        {deal.initiator_kyc_verified ? (
                                            <span className="text-xs flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                <Shield className="w-3 h-3" /> KYC Verified
                                            </span>
                                        ) : (
                                            <span className="text-xs flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                                <Shield className="w-3 h-3" /> KYC Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Recipient (Seller)</h3>
                            {recipient ? (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{recipient.full_name || 'Unknown'}</p>
                                        <p className="text-sm text-gray-500">{recipient.email}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            {deal.recipient_kyc_verified ? (
                                                <span className="text-xs flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                    <Shield className="w-3 h-3" /> KYC Verified
                                                </span>
                                            ) : (
                                                <span className="text-xs flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                                    <Shield className="w-3 h-3" /> KYC Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm py-4">
                                    <User className="w-8 h-8 mb-2 opacity-50" />
                                    <p>No recipient yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Disputes Section (if any) */}
                    {(disputes && disputes.length > 0) && (
                        <div className="bg-red-50 rounded-xl border border-red-100 p-6">
                            <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Disputes ({disputes.length})
                            </h2>
                            <div className="space-y-3">
                                {disputes.map(dispute => (
                                    <div key={dispute.id} className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-mono text-gray-400">{dispute.id.slice(0, 8)}</span>
                                            <span className={`text-xs font-bold uppercase ${dispute.status === 'open' ? 'text-red-600 bg-red-100 px-2 py-0.5 rounded' : 'text-gray-600 bg-gray-100 px-2 py-0.5 rounded'}`}>
                                                {dispute.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-900 font-medium mb-1">Reason: {dispute.reason}</p>
                                        {dispute.resolution && (
                                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">
                                                <span className="font-semibold">Resolution:</span> {dispute.resolution}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Sidebar / Activity Log */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            Activity Log
                        </h2>

                        <div className="relative border-l border-gray-200 ml-3 space-y-6">
                            {activities && activities.length > 0 ? (
                                activities.map((activity, idx) => (
                                    <div key={activity.id} className="relative pl-6">
                                        <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-gray-200 rounded-full border-2 border-white ring-1 ring-gray-100"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatActionText(activity.action)}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                            </p>

                                            {/* Optional: Render metadata details if really important */}
                                            {/* <pre className="text-[10px] bg-gray-50 p-1 mt-1 rounded text-gray-400 overflow-hidden">{JSON.stringify(activity.metadata)}</pre> */}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 pl-6 italic">No activity recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatActionText(action: string) {
    switch (action) {
        case 'deal_created': return 'Deal Created';
        case 'deal_funded': return 'Funds Deposited';
        case 'deal_shipping_confirmed': return 'Shipping Confirmed';
        case 'deal_delivery_confirmed': return 'Delivery Confirmed'; // Or receipt
        case 'dispute_opened': return 'Dispute Opened';
        case 'dispute_resolved': return 'Dispute Resolved';
        // Add more mappings as needed
        default: return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}
