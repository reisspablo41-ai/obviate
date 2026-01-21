import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
    Plus,
    Search,
    MessageCircle,
    Mail
} from "lucide-react";
import Link from "next/link";

export default function FAQ() {
    const faqs = [
        {
            q: "Is my money safe with Obviater?",
            a: "Absolutely. Obviater holds funds in regulated trust accounts or secure, audited smart contracts (for crypto). Funds are strictly isolated from our corporate accounts and cannot be moved without the proper conditions being met in the deal lifecycle."
        },
        {
            q: "What happens if there's a dispute?",
            a: "If either party is unhappy, they can 'Freeze' the deal. An Obviater administrator will then contact both parties to collect evidence. We act as a neutral third party to ensure the final distribution of funds follows the original agreement terms."
        },
        {
            q: "How long does the escrow process take?",
            a: "The escrow duration depends entirely on the deal terms you set. For funding, bank transfers usually take 1-3 business days, while crypto confirmations happen in minutes. Release is instant once approved by the sender."
        },
        {
            q: "Do I need to undergo KYC (identity verification)?",
            a: "Yes. To prevent fraud and comply with Anti-Money Laundering (AML) laws, all users must verify their identity before they can fund or receive a payout exceeding $500. This protects everyone on the platform."
        },
        {
            q: "Can I cancel a deal once it's funded?",
            a: "Cancellation requires mutual consent. Once funds are in escrow, they can only be returned to the sender if the recipient agrees to 'Refund' the deal, or if an admin resolves a dispute in favor of the sender."
        },
        {
            q: "What if the other party disappears?",
            a: "If a party becomes unresponsive, you can file a dispute after a 48-hour activity window. Our admin team will attempt to contact them. If they remain unresponsive, we resolve the deal based on the last verified milestone or evidence of delivery."
        },
        {
            q: "What cryptos do you support?",
            a: "We currently support USDC and USDT on Ethereum, Polygon, and Solana networks to ensure price stability for both buyers and sellers."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <section className="bg-zinc-900 pt-24 pb-20 text-white border-b overflow-hidden relative">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 italic tracking-tight underline decoration-primary underline-offset-8">Questions? Answers.</h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto italic">
                            Everything you need to know about secure escrow, identity verification, and our protection protocols.
                        </p>

                        <div className="mt-12 max-w-xl mx-auto relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search topics (e.g. 'Disputes', 'KYC', 'Fees')"
                                className="w-full h-14 bg-zinc-800 border-zinc-700 rounded-2xl pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            />
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 h-full w-1/4 bg-primary/20 blur-[120px] -z-0" />
                </section>

                {/* FAQ List */}
                <section className="py-24 bg-white">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <div className="space-y-6">
                            {faqs.map((faq, i) => (
                                <div key={i} className="group border-b pb-6 last:border-0">
                                    <h3 className="text-xl font-bold text-zinc-900 mb-4 flex justify-between items-center cursor-pointer group-hover:text-primary transition-colors italic">
                                        {faq.q}
                                        <Plus className="h-5 w-5 text-zinc-300 group-hover:text-primary group-hover:rotate-90 transition-all" />
                                    </h3>
                                    <p className="text-zinc-500 leading-relaxed italic pr-8">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Support CTA */}
                <section className="py-24 bg-zinc-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-white p-12 rounded-[3rem] border shadow-sm text-center">
                            <h2 className="text-3xl font-black mb-8 italic">Didn't find your answer?</h2>
                            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-zinc-900 uppercase tracking-widest">Email Support</p>
                                        <p className="text-sm text-zinc-500 italic">support@obviater.com</p>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <MessageCircle className="h-6 w-6" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-zinc-900 uppercase tracking-widest">Live Chat</p>
                                        <p className="text-sm text-zinc-500 italic">Available 24/7 for active deals</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
