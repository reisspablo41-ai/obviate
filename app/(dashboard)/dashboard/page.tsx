import Link from 'next/link';
import { ArrowRight, Clock, CheckCircle, AlertCircle, Plus, Wallet, ShieldCheck, UserPlus, Info } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Mock Data for now - eventually replace with real DB queries
    const activeDealsCount = 3;
    const completedDealsCount = 12;
    const actionRequiredCount = 1;
    const totalFunds = 1950.00;
    const lockedFunds = 1500.00;
    const availableFunds = 450.00;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-gray-600">Welcome back, {user?.email}!</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/deals/create"
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Deal
                    </Link>
                    <Link
                        href="/wallet"
                        className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Wallet className="w-4 h-4" />
                        Add Funds
                    </Link>
                </div>
            </div>

            {/* Quick Stats & Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Column */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">+2 this week</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Deals</p>
                            <p className="text-2xl font-bold text-gray-900">{activeDealsCount}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">{completedDealsCount}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between ring-2 ring-amber-100 ring-offset-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Action Required</p>
                            <p className="text-2xl font-bold text-gray-900">{actionRequiredCount}</p>
                            <p className="text-xs text-amber-600 mt-1 font-medium">Verify Identity</p>
                        </div>
                    </div>
                </div>

                {/* Mini Chart / Funds Overview */}
                <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1 opacity-80">
                            <span className="text-sm font-medium">Total Balance</span>
                            <div className="group relative">
                                <Info className="w-4 h-4 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    Funds across all deals
                                </div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">${totalFunds.toFixed(2)}</p>
                    </div>

                    <div className="mt-8 space-y-4 relative z-10">
                        {/* Simple Bar Representation */}
                        <div>
                            <div className="flex justify-between text-xs mb-1 opacity-80">
                                <span>Locked in Escrow</span>
                                <span>${lockedFunds.toFixed(2)}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(lockedFunds / totalFunds) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1 opacity-80">
                                <span>Available to Withdraw</span>
                                <span>${availableFunds.toFixed(2)}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(availableFunds / totalFunds) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Band */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/deals/create" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full group-hover:scale-110 transition-transform">
                        <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Create Deal</span>
                </Link>
                <Link href="/wallet" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Manage Wallet</span>
                </Link>
                <Link href="/kyc" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-full group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Verify Identity</span>
                </Link>
                <button className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-full group-hover:scale-110 transition-transform">
                        <UserPlus className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Invite User</span>
                </button>
            </div>

            {/* Recent Activity / Active Deals */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Deals</h2>
                    <Link href="/deals" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Last Activity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {/* Mock Data */}
                                <tr className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Web Development Project
                                    </td>
                                    <td className="px-6 py-4">Provider</td>
                                    <td className="px-6 py-4">$1,500.00</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            In Progress
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">2 hours ago</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Vintage Watch Purchase
                                    </td>
                                    <td className="px-6 py-4">Buyer</td>
                                    <td className="px-6 py-4">$450.00</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                            Funding
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">1 day ago</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

