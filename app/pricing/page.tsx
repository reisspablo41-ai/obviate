import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
    Check,
    HelpCircle,
    ArrowRight,
    TrendingUp,
    CreditCard,
    Banknote,
    Coins
} from "lucide-react";
import Link from "next/link";

export default function Pricing() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <section className="bg-zinc-50 pt-24 pb-20 border-b">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 italic">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-zinc-500 max-w-2xl mx-auto italic">
                            No monthly subscriptions. No hidden costs. We only get paid when your deal is successfully completed.
                        </p>
                    </div>
                </section>

                {/* Pricing Card */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-xl mx-auto bg-white rounded-[3rem] border-2 border-primary overflow-hidden shadow-2xl relative">
                            <div className="bg-primary px-8 py-4 text-center">
                                <span className="text-white text-xs font-black uppercase tracking-widest">Standard Platform Fee</span>
                            </div>
                            <div className="p-12 text-center">
                                <div className="flex justify-center items-baseline gap-2 mb-8">
                                    <span className="text-8xl font-black text-zinc-900 tracking-tighter">5%</span>
                                    <span className="text-zinc-500 font-bold">per deal</span>
                                </div>

                                <p className="text-zinc-500 mb-10 italic">
                                    One simple fee covers escrow, verification, and dispute protection for every transaction.
                                </p>

                                <div className="space-y-4 mb-10 text-left">
                                    {[
                                        "Zero setup or integration costs",
                                        "Choose who pays: Sender, Recipient, or 50/50 split",
                                        "Unlimited chat & activity logs",
                                        "Admin-led dispute resolution included",
                                        "Secure document storage"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <div className="h-5 w-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                                <Check className="h-3 w-3 text-emerald-600" />
                                            </div>
                                            <span className="text-sm font-medium text-zinc-700 italic">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/signup"
                                    className="inline-flex w-full h-14 items-center justify-center rounded-2xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-1"
                                >
                                    Start Your First Deal
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>

                            <div className="absolute top-20 -right-20 h-40 w-40 bg-accent/50 rounded-full blur-3xl -z-10" />
                        </div>

                        <p className="mt-8 text-center text-zinc-400 text-sm italic">
                            * Minimum transaction amount: $50 USD. For high-volume enterprise deals ($100k+), <Link href="mailto:sales@obviate.com" className="text-primary font-bold hover:underline">contact sales</Link>.
                        </p>
                    </div>
                </section>

                {/* Why 5% Value Prop */}
                <section className="py-12 bg-white">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
                            <h3 className="text-2xl font-bold mb-4 italic text-primary">Why is the fee 5%?</h3>
                            <p className="text-zinc-600 mb-6 leading-relaxed">
                                Most "cheap" escrow services cut corners on compliance and support. We don't.
                                Your 5% fee pays for real human verification, 24/7 dispute arbitration, and maintaining our regulated trust accounts.
                                <br /><br />
                                <span className="font-bold italic">We believe peace of mind is worth paying for.</span>
                            </p>
                            <div className="flex justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60">
                                <span>• No Hidden Costs</span>
                                <span>• No Monthly Fees</span>
                                <span>• Fully Refundable</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Examples breakdown */}
                <section className="py-24 bg-zinc-50 border-y">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-black text-center mb-16 italic">Example Deal Breakdown</h2>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Option 1 */}
                            <div className="bg-white p-8 rounded-3xl border shadow-sm">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <span className="h-8 w-8 bg-zinc-100 rounded-lg flex items-center justify-center text-xs">A</span>
                                    Sender Pays All
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-zinc-500 italic">Deal Amount</span>
                                        <span className="font-bold">$1,000.00</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-zinc-500 italic">Obviate Fee (5%)</span>
                                        <span className="font-bold text-zinc-900">$50.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-primary pt-2">
                                        <span>Sender Pays</span>
                                        <span>$1,050.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-emerald-600">
                                        <span>Recipient Receives</span>
                                        <span>$1,000.00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Option 2 */}
                            <div className="bg-white p-8 rounded-3xl border shadow-sm">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <span className="h-8 w-8 bg-zinc-100 rounded-lg flex items-center justify-center text-xs">B</span>
                                    Recipient Pays All
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-zinc-500 italic">Deal Amount</span>
                                        <span className="font-bold">$1,000.00</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-zinc-500 italic">Obviate Fee (5%)</span>
                                        <span className="font-bold text-zinc-900">$50.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-primary pt-2">
                                        <span>Sender Pays</span>
                                        <span>$1,000.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-emerald-600">
                                        <span>Recipient Receives</span>
                                        <span>$950.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Network fees */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-black mb-8 italic">Other Possible Costs</h2>
                                <p className="text-zinc-500 mb-8 italic">While our platform fee is fixed, external financial networks may apply their own charges depending on your chosen method.</p>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-600">
                                            <Banknote className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold italic">Bank Wire Fees</h4>
                                            <p className="text-sm text-zinc-500 italic">Your bank may charge for outgoing/incoming wires. We recommend ACH or SEPA for lower costs.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-600">
                                            <Coins className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold italic">Crypto Gas Fees</h4>
                                            <p className="text-sm text-zinc-500 italic">Transferring USDC/USDT on-chain requires gas fees paid to the respective blockchain (Ethereum, Polygon, etc.).</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-600">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold italic">Forex Conversion</h4>
                                            <p className="text-sm text-zinc-500 italic">If you pay in a different currency than the deal amount, your bank's exchange rate will apply.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <img
                                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800"
                                    className="rounded-[3rem] border shadow-xl aspect-square object-cover"
                                    alt="Finance"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div >
    );
}
