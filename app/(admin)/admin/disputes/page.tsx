import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { formatDistanceToNow } from 'date-fns';
import { Search, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
import DisputeActions from '@/components/admin/DisputeActions';

export default async function AdminDisputesPage() {
    const supabase = await createClient();

    let disputes: any[] = [];
    let errorMsg = null;

    try {
        // 1. Fetch Disputes
        const { data: rawDisputes, error: disputesError } = await supabase
            .from('disputes')
            .select('*')
            .order('created_at', { ascending: false });

        if (disputesError) throw disputesError;

        if (rawDisputes && rawDisputes.length > 0) {
            // 2. Fetch Related Deals
            const dealIds = Array.from(new Set(rawDisputes.map(d => d.deal_id)));
            const { data: dealsData } = await supabase
                .from('deals')
                .select('id, title, amount, currency')
                .in('id', dealIds);

            // 3. Fetch Related Profiles (openers)
            const openerIds = Array.from(new Set(rawDisputes.map(d => d.opened_by)));
            const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, email, full_name')
                .in('id', openerIds);

            // 4. Merge Data
            const dealsMap = new Map(dealsData?.map(d => [d.id, d]) || []);
            const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

            disputes = rawDisputes.map(d => ({
                ...d,
                deal: dealsMap.get(d.deal_id) || null,
                opener: profilesMap.get(d.opened_by) || null
            }));
        } else {
            disputes = [];
        }

    } catch (e: any) {
        console.error('Admin Disputes Query Error:', e);
        errorMsg = e.message || 'Failed to load disputes';
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dispute Management</h1>
                    <p className="text-gray-600">Review and resolve transaction disputes.</p>
                </div>
            </div>

            {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Error loading disputes: {errorMsg}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">Dispute ID</th>
                                <th className="px-6 py-4">Context</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {disputes.map((dispute) => (
                                <tr key={dispute.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs">
                                        #{dispute.id.slice(0, 8)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="font-medium text-gray-900">{(dispute.deal as any)?.title}</p>
                                            <p className="text-xs">
                                                Opened by: <span className="text-gray-700">{(dispute.opener as any)?.email}</span>
                                            </p>
                                            <Link href={`/deals/${dispute.deal_id}`} className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                                                View Deal <MessageSquare className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dispute.status === 'open' ? 'bg-red-100 text-red-800' :
                                            dispute.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {dispute.status === 'open' ? <AlertTriangle className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                                            {dispute.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={dispute.reason}>
                                        {dispute.reason}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDistanceToNow(new Date(dispute.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {dispute.status === 'open' && (
                                            <DisputeActions
                                                disputeId={dispute.id}
                                                dealId={dispute.deal_id}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {disputes.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No disputes found.
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
