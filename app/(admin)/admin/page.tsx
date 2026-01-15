import Link from 'next/link';
import { AlertCircle, FileText, Activity, TrendingUp, Mail, DollarSign } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { formatDistanceToNow } from 'date-fns';

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // 1. Fetch Stats
    const { count: activeDisputes } = await supabase
        .from('disputes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

    const { count: pendingKYC } = await supabase
        .from('kyc_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    const { data: volumeData } = await supabase
        .from('deals')
        .select('amount')
        .neq('status', 'draft')
        .neq('status', 'disputed'); // Approximate funded volume

    const totalVolume = volumeData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

    const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });


    // 2. Fetch Recent Invitations (Sent but not accepted)
    const { data: invitations } = await supabase
        .from('deal_invitations')
        .select(`
            id,
            email,
            created_at,
            accepted,
            deals ( title, amount, currency )
        `)
        .eq('accepted', false)
        .order('created_at', { ascending: false })
        .limit(5);

    // 3. Fetch Recent Activity (Active Deals / Accepted Invitations effectively)
    // We can show deals that are not drafts as "Activity"
    const { data: activeDeals } = await supabase
        .from('deals')
        .select(`
            id,
            title,
            status,
            amount,
            currency,
            updated_at,
            initiator:initiator_id(email),
            recipient:recipient_id(email)
        `)
        .neq('status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(5);


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
                <p className="mt-2 text-gray-600">Platform activity and pending tasks.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Active Disputes</h3>
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{activeDisputes || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Pending KYC</h3>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{pendingKYC || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Volume</h3>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalVolume)}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{activeUsers || 0}</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Recent Invitations */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Invitations (Pending)</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {invitations && invitations.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {invitations.map((invite) => (
                                    <div key={invite.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Invited: {invite.email}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    For: {(invite.deals as any)?.title} ({(invite.deals as any)?.currency} {(invite.deals as any)?.amount})
                                                </p>
                                            </div>
                                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                Sent
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {formatDistanceToNow(new Date(invite.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No pending invitations found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity (Active Deals) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Deal Activity</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {activeDeals && activeDeals.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {activeDeals.map((deal) => (
                                    <div key={deal.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {deal.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {deal.currency} {deal.amount} • {deal.status}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${deal.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                                    deal.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {deal.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Updated {formatDistanceToNow(new Date(deal.updated_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No active deals found.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
