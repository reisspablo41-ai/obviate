'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu,
    X,
    Home,
    Briefcase,
    Wallet,
    ShieldCheck,
    LifeBuoy,
    PlusCircle,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/deals', label: 'My Deals', icon: Briefcase },
    { href: '/wallet', label: 'Wallet & Payouts', icon: Wallet },
    { href: '/disputes', label: 'Disputes', icon: ShieldCheck },
    { href: '/support', label: 'Support', icon: LifeBuoy },
];

export default function DashboardMobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <>
            <button
                onClick={toggleMenu}
                className="p-2 text-gray-500 hover:text-gray-900 focus:outline-none"
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
                            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white text-gray-900 z-50 md:hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <Link
                                    href="/"
                                    className="text-2xl font-bold tracking-tight text-emerald-600"
                                    onClick={closeMenu}
                                >
                                    EscrowApp
                                </Link>
                                <button
                                    onClick={closeMenu}
                                    className="p-2 text-gray-500 hover:text-gray-900"
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
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 border-t border-gray-100 space-y-2">
                                <Link
                                    href="/deals/create"
                                    onClick={closeMenu}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    New Deal
                                </Link>
                                <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-900 w-full transition-colors">
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
