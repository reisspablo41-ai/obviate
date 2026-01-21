import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { formatDistanceToNow } from 'date-fns';
import { Search, Filter, ShieldCheck, AlertCircle } from 'lucide-react';
import DealActions from '@/components/admin/DealActions';

export default async function AdminDealsPage() {
    const supabase = await createClient();

    let deals: any[] = [];
    let errorMsg = null;

    try {
        // 1. Fetch Deals only (no joins to prevent syntax errors)
        const { data: rawDeals, error: queryError } = await supabase
            .from('deals')
            // Debugging: Explicitly selecting columns to find which one is breaking JSON.parse
            // If this works, add more columns back until it breaks.
            .select('id, title, amount, currency, status, created_at, initiator_id, recipient_id')
            .order('created_at', { ascending: false });

        if (queryError) {
            console.error('Admin Deals Query Error:', queryError);
            errorMsg = queryError.message;
        } else {
            // 2. Start manual join
            const dealsData = rawDeals || [];

            // Collect user IDs
            const userIds = new Set<string>();
            dealsData.forEach((d: any) => {
                if (d.initiator_id) userIds.add(d.initiator_id);
                if (d.recipient_id) userIds.add(d.recipient_id);
            });

            let profilesMap = new Map();
            if (userIds.size > 0) {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', Array.from(userIds));

                profiles?.forEach((p: any) => profilesMap.set(p.id, p));
            }

            // Merge
            deals = dealsData.map((d: any) => ({
                ...d,
                initiator: profilesMap.get(d.initiator_id) || { full_name: 'Unknown' },
                recipient: profilesMap.get(d.recipient_id) || { full_name: 'Pending' }
            }));
        }
    } catch (e: any) {
        console.error('Admin Deals Unexpected Error:', e);
        errorMsg = e.message || 'An unexpected error occurred';
    }

    if (errorMsg) {
        return (
            <div className="p-8 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block text-left">
                    <h3 className="font-bold">Error loading deals</h3>
                    <p className="text-sm mt-1">{errorMsg}</p>
                </div>
            </div>
        );
    }

    // Debug logging
    console.log('--- ADMIN DEALS DEBUG ---');
    console.log('Deals fetched:', deals?.length || 0);
    try {
        if (deals && deals.length > 0) {
            // Safely log to avoid crashing the logging itself
            console.log('First deal:', JSON.stringify(deals[0], null, 2));
        }
    } catch (logError) {
        console.error('Failed to log deals:', logError);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Deals</h1>
                    <p className="text-gray-600">Monitor all escrow transactions on the platform.</p>
                </div>
            </div>

            {/* Filters (Visual Only for now) */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, ID, or user email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">Title / ID</th>
                                <th className="px-6 py-4">Participants</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">KYC Check</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {deals?.map((deal) => (
                                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{deal.title}</p>
                                        <p className="text-xs text-mono text-gray-400 truncate max-w-[100px]">{deal.id}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-xs">
                                                <span className="font-medium text-gray-700">From:</span> {(deal.initiator as any)?.full_name || 'Unknown'}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium text-gray-700">To:</span> {(deal.recipient as any)?.full_name || <span className="text-gray-400 italic">Pending...</span>}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {deal.currency} {deal.amount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${deal.status === 'active' || deal.status === 'funded' ? 'bg-emerald-100 text-emerald-800' :
                                            deal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                deal.status === 'disputed' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {deal.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1 text-xs">
                                                {deal.initiator_kyc_verified ? <ShieldCheck className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-amber-500" />}
                                                <span>Initiator</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                {deal.recipient_kyc_verified ? <ShieldCheck className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-gray-400" />}
                                                <span>Recipient</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <DealActions
                                            dealId={deal.id}
                                            dealStatus={deal.status}
                                            dealTitle={deal.title}
                                            paymentReceiptUrl={deal.payment_receipt_url}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {(!deals || deals.length === 0) && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No deals found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
