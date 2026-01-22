import Link from 'next/link';
import { Plus, Search, Filter, Mail, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { formatDistanceToNow } from 'date-fns';

export default async function DealsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div>Please login.</div>;

    // 1. Fetch My Deals
    const { data: myDeals } = await supabase
        .from('deals')
        .select('*')
        .or(`initiator_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

    // 2. Fetch Sent Invitations (Where I am the deal initiator)
    // We join on deals to filter by my ID, but actually deal_invitations doesn't store sender directly.
    // We find invites where deal.initiator_id is me.
    const { data: sentInvitations } = await supabase
        .from('deal_invitations')
        .select(`
            *,
            deals!inner (
                title,
                amount,
                currency,
                initiator_id
            )
        `)
        .eq('deals.initiator_id', user.id)
        .order('created_at', { ascending: false });

    // 3. Fetch Received Invitations (Where email matches mine)
    // 3. Fetch Received Invitations (Secure RPC)
    const { data: receivedInvitations, error: inviteError } = await supabase.rpc('get_user_pending_invites', {
        p_email: user.email
    })

    if (inviteError) {
        console.error('CRITICAL: Error fetching received invitations:', inviteError);
    }

    // Debug logs re-added for troubleshooting
    console.log('--- DEBUG DEALS ---');
    console.log('Current User:', user.email);
    console.log('Received Invites Data:', receivedInvitations);

    // We didn't capture the error in the destructuring above, let's refactor slightly to capture it.
    // Re-running the specific query to debug if needed, or better, change the destructuring.



    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Deals & Invitations</h1>
                    <p className="text-gray-600">Manage your deals and pending invitations.</p>
                </div>
                <Link
                    href="/deals/create"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create New Deal
                </Link>
            </div>

            {/* SECTION 1: Received Invitations (Action Items) */}
            {receivedInvitations && receivedInvitations.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-emerald-600" />
                        Received Invitations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {receivedInvitations.map((invite: any) => (
                            <div key={invite.id} className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900 line-clamp-1">{invite.deal?.title}</h4>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                            {invite.deal.currency} {invite.deal.amount}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                        From: <span className="font-medium text-gray-700">{invite.deal?.initiator?.full_name || invite.deal?.initiator?.email || 'Unknown User'}</span>
                                    </p>
                                </div>
                                <Link
                                    href={`/claim-invite?token=${invite.token}`}
                                    className="mt-2 w-full py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors text-center block"
                                >
                                    View & Accept
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SECTION 2: Active & Past Deals */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">My Deals</h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Last Updated</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {myDeals?.map((deal) => (
                                    <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <Link href={`/deals/${deal.id}`} className="hover:underline">
                                                {deal.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 capitalize">
                                            {deal.initiator_id === user.id ? 'Initiator' : 'Recipient'}
                                        </td>
                                        <td className="px-6 py-4">
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
                                            {formatDistanceToNow(new Date(deal.updated_at), { addSuffix: true })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/deals/${deal.id}`} className="text-emerald-600 hover:text-emerald-700 font-medium">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {(!myDeals || myDeals.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No deals found. Create one to get started!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* SECTION 3: Sent Invitations */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Sent Invitations</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Recipient</th>
                                    <th className="px-6 py-4">Deal</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Sent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sentInvitations?.map((invite) => (
                                    <tr key={invite.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {invite.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {(invite.deals as any)?.title} ({(invite.deals as any)?.currency} {(invite.deals as any)?.amount})
                                        </td>
                                        <td className="px-6 py-4">
                                            {invite.accepted ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-medium">
                                                    <CheckCircle className="w-3 h-3" /> Accepted
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs font-medium">
                                                    <Clock className="w-3 h-3" /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDistanceToNow(new Date(invite.created_at), { addSuffix: true })}
                                        </td>
                                    </tr>
                                ))}
                                {(!sentInvitations || sentInvitations.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            No sent invitations.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
