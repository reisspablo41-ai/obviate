import React from 'react';
import Link from 'next/link';
import { Home, Briefcase, Wallet, LogOut, PlusCircle, ShieldCheck, LifeBuoy } from 'lucide-react';
import { ToastProvider } from '@/hooks/use-toast';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ToastProvider>
            <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <Link href="/" className="text-2xl font-bold tracking-tight text-emerald-600">
                            EscrowApp
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/deals"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                            <Briefcase className="w-5 h-5" />
                            My Deals
                        </Link>
                        <Link
                            href="/wallet"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                            <Wallet className="w-5 h-5" />
                            Wallet & Payouts
                        </Link>
                        <Link
                            href="/disputes"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                            <ShieldCheck className="w-5 h-5" />
                            Disputes
                        </Link>
                        <Link
                            href="/support"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                            <LifeBuoy className="w-5 h-5" />
                            Support
                        </Link>
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <Link
                            href="/deals/create"
                            className="flex items-center justify-center gap-2 w-full px-4 py-2 mb-4 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                            <PlusCircle className="w-4 h-4" />
                            New Deal
                        </Link>
                        <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-900 w-full transition-colors">
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    {/* Mobile Header (TODO: Add functionality) */}
                    <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
                        <Link href="/" className="text-xl font-bold text-emerald-600">
                            EscrowApp
                        </Link>
                        {/* Burger menu placeholder */}
                        <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    </header>

                    <div className="p-6 md:p-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}
