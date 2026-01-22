'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu,
    X,
    LayoutDashboard,
    AlertTriangle,
    FileText,
    ShieldCheck,
    Mail,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/disputes', label: 'Disputes', icon: AlertTriangle },
    { href: '/admin/kyc', label: 'KYC Verifications', icon: FileText },
    { href: '/admin/deals', label: 'All Deals', icon: ShieldCheck },
    { href: '/admin/invitations', label: 'Invitations', icon: Mail },
];

export default function AdminMobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <>
            <button
                onClick={toggleMenu}
                className="p-2 text-gray-400 hover:text-white focus:outline-none"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMenu}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-gray-900 text-white z-50 md:hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                                <Link
                                    href="/admin"
                                    className="text-2xl font-bold tracking-tight text-emerald-500"
                                    onClick={closeMenu}
                                >
                                    Escrow Admin
                                </Link>
                                <button
                                    onClick={closeMenu}
                                    className="p-2 text-gray-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 border-t border-gray-800">
                                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold">A</div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Admin User</p>
                                        <p className="text-xs text-gray-500">Super Admin</p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white w-full transition-colors">
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
