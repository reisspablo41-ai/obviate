"use client";

import Link from "next/link";
import { DollarSign, Menu, X, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const navLinks = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Security", href: "/security" },
    { name: "Use Cases", href: "/use-cases" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
];

interface NavbarClientProps {
    user: any;
    initials: string;
}

export function NavbarClient({ user, initials }: NavbarClientProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const router = useRouter();

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsProfileOpen(false);
        router.push('/');
        router.refresh();
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <span>Obviater</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex md:items-center md:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-zinc-600 hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex items-center gap-4 border-l pl-8">
                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200 hover:bg-emerald-200 transition-colors">
                                        {initials}
                                    </div>
                                    <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isProfileOpen && "rotate-180")} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-zinc-600 hover:text-primary transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Start a Deal
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile menu button */}
                <div className="flex md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-zinc-600 hover:bg-zinc-100 focus:outline-none"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
                <div className="space-y-1 px-4 pb-3 pt-2 border-t">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-accent hover:text-primary"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="mt-4 flex flex-col gap-2 px-3">
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="flex h-10 items-center justify-center rounded-lg bg-emerald-100 text-sm font-medium text-emerald-700 border border-emerald-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex h-10 items-center justify-center rounded-lg border border-red-200 text-sm font-medium text-red-600 w-full hover:bg-red-50"
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex h-10 items-center justify-center rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="flex h-10 items-center justify-center rounded-lg bg-primary text-sm font-medium text-white"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Start a Deal
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
