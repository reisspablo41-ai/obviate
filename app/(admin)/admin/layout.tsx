import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, AlertTriangle, FileText, LogOut, Users, ShieldCheck, Mail } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminMobileMenu from '@/components/admin/AdminMobileMenu';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (!profile?.is_admin) {
        redirect('/'); // Or a 403 page
    }

    return (
        <div className="flex h-screen bg-gray-100 text-gray-900 font-sans">
            {/* Sidebar - Dark for Admin */}
            <aside className="w-64 bg-gray-900 text-white border-r border-gray-800 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <Link href="/admin" className="text-2xl font-bold tracking-tight text-emerald-500">
                        Escrow Admin
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Overview
                    </Link>
                    <Link
                        href="/admin/disputes"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <AlertTriangle className="w-5 h-5" />
                        Disputes
                    </Link>
                    <Link
                        href="/admin/kyc"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        KYC Verifications
                    </Link>
                    <Link
                        href="/admin/deals"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        All Deals
                    </Link>
                    <Link
                        href="/admin/invitations"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        Invitations
                    </Link>
                    {/* 
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors opacity-50 cursor-not-allowed"
                    >
                        <Users className="w-5 h-5" />
                        Users
                    </Link>
                    */}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold">A</div>
                        <div>
                            <p className="text-sm font-medium text-white">Admin User</p>
                            <p className="text-xs text-gray-500">Super Admin</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white w-full transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-gray-900 text-white border-b border-gray-800">
                    <Link href="/admin" className="text-xl font-bold text-emerald-500">
                        Escrow Admin
                    </Link>
                    <AdminMobileMenu />
                </header>

                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
