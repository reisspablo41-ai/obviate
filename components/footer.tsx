import Link from "next/link";
import { DollarSign, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-zinc-50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <span>Obviate</span>
                        </Link>
                        <p className="max-w-xs text-sm text-zinc-500 leading-relaxed">
                            Making digital and real-world transactions safer through secure, modern escrow technology.
                        </p>
                        <div className="flex space-x-6">
                            <Link href="#" className="text-zinc-400 hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-zinc-400 hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-zinc-400 hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900">Product</h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    <li>
                                        <Link href="/how-it-works" className="text-sm text-zinc-500 hover:text-primary transition-colors">How It Works</Link>
                                    </li>
                                    <li>
                                        <Link href="/pricing" className="text-sm text-zinc-500 hover:text-primary transition-colors">Pricing</Link>
                                    </li>
                                    <li>
                                        <Link href="/use-cases" className="text-sm text-zinc-500 hover:text-primary transition-colors">Use Cases</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-zinc-900">Safety</h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    <li>
                                        <Link href="/security" className="text-sm text-zinc-500 hover:text-primary transition-colors">Security & Compliance</Link>
                                    </li>
                                    <li>
                                        <Link href="/faq" className="text-sm text-zinc-500 hover:text-primary transition-colors">FAQ</Link>
                                    </li>
                                    <li>
                                        <Link href="/aml-kyc" className="text-sm text-zinc-500 hover:text-primary transition-colors">AML & KYC</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900">Legal</h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    <li>
                                        <Link href="/privacy" className="text-sm text-zinc-500 hover:text-primary transition-colors">Privacy Policy</Link>
                                    </li>
                                    <li>
                                        <Link href="/terms" className="text-sm text-zinc-500 hover:text-primary transition-colors">Terms of Service</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-zinc-900">Support</h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    <li>
                                        <Link href="mailto:support@obviate.com" className="text-sm text-zinc-500 hover:text-primary transition-colors">Contact Support</Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-sm text-zinc-500 hover:text-primary transition-colors">Dispute Resolution</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8">
                    <p className="text-xs text-zinc-400">
                        &copy; {new Date().getFullYear()} Obviate Technologies Inc. All rights reserved. Obviate is a technology platform, not a bank.
                    </p>
                </div>
            </div>
        </footer>
    );
}
