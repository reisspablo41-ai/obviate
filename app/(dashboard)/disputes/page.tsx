import Link from 'next/link';
import { AlertCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { formatDistanceToNow } from 'date-fns';

export default async function DisputesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: disputes, error } = await supabase
        .from('disputes')
        .select(`
            *,
            deal:deals(title, currency, amount)
        `)
        .eq('opened_by', user?.id || '')
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dispute Center</h1>
                    <p className="text-gray-600">Track and manage your disputed transactions.</p>
                </div>
            </div>

            {(!disputes || disputes.length === 0) ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="mx-auto w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Active Disputes</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-2">All your transactions are running smoothly. If you have an issue, go to a deal page to report it.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">Dispute ID</th>
                                <th className="px-6 py-4">Deal</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Opened</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {disputes.map((dispute) => (
                                <tr key={dispute.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                        #{dispute.id.slice(0, 8)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/deals/${dispute.deal_id}`} className="font-medium text-gray-900 hover:text-emerald-600 hover:underline">
                                            {(dispute.deal as any)?.title || 'Unknown Deal'}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dispute.status === 'open' ? 'bg-red-100 text-red-800' :
                                            dispute.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
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
                                        <Link href={`/deals/${dispute.deal_id}`} className="text-emerald-600 font-medium hover:underline flex items-center gap-1">
                                            <MessageSquare className="w-4 h-4" />
                                            View Deal
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>
                    Disputes are handled by our neutral admin team. We may request additional evidence (screenshots, files) in the specific deal room chat.
                </p>
            </div>
        </div>
    );
}
