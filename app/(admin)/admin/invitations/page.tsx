import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function AdminInvitationsPage() {
    const supabase = await createClient();

    const { data: invitations } = await supabase
        .from('deal_invitations')
        .select(`
            id,
            email,
            token,
            accepted,
            created_at,
            expires_at,
            deals (
                id,
                title,
                amount,
                currency
            )
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Deal Invitations</h1>
                    <p className="text-gray-600">Track all sent invitations across the platform.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">Recipient Email</th>
                                <th className="px-6 py-4">Deal Title</th>
                                <th className="px-6 py-4">Token (Last 8)</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Sent</th>
                                <th className="px-6 py-4">Expires</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invitations?.map((invite) => (
                                <tr key={invite.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            {invite.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(invite.deals as any)?.title}
                                        <div className="text-xs text-gray-400">
                                            {(invite.deals as any)?.currency} {(invite.deals as any)?.amount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        ...{invite.token.slice(-8)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {invite.accepted ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                <CheckCircle className="w-3 h-3" />
                                                Accepted
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                <Clock className="w-3 h-3" />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDistanceToNow(new Date(invite.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {invite.expires_at ? formatDistanceToNow(new Date(invite.expires_at), { addSuffix: true }) : '-'}
                                    </td>
                                </tr>
                            ))}
                            {(!invitations || invitations.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No invitations found.
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
