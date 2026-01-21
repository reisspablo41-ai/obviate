import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
    Link as LinkIcon,
    Wallet,
    CheckCircle2,
    Unlock,
    ShieldAlert,
    ArrowRight,
    Info
} from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                {/* Header */}
                <section className="bg-primary pt-20 pb-32 text-white relative overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 italic">How Obviater Works</h1>
                        <p className="text-xl text-emerald-100 max-w-2xl mx-auto italic">
                            From the first invitation to the final fund release, we ensure every step of your transaction is transparent and protected.
                        </p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
                </section>

                {/* Process Steps */}
                <section className="-mt-16 pb-24 relative z-20">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="space-y-12">
                            {[
                                {
                                    title: "1. The Invitation (Obviater Link)",
                                    desc: "The deal Initiator enters the recipient's email and transaction details. Our system generates a unique, signed URL known as an 'Obviater Link'. This link is the source of truth for the entire deal.",
                                    icon: LinkIcon,
                                    color: "bg-blue-500",
                                    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800"
                                },
                                {
                                    title: "2. Claiming & Acceptance",
                                    desc: "The recipient clicks the link and claims their account (or logs in). Once both parties accept the deal terms, the status moves to 'Active'. No money has moved yet—this is about alignment.",
                                    icon: CheckCircle2,
                                    color: "bg-emerald-500",
                                    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
                                },
                                {
                                    title: "3. Funding the Escrow",
                                    desc: "The Initiator deposits the funds. They can choose Bank Transfer (USD) or Stablecoins (USDC/USDT). Funds are held in a secure, non-custodial-style vault or regulated bank account.",
                                    icon: Wallet,
                                    color: "bg-amber-500",
                                    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800"
                                },
                                {
                                    title: "4. Verification & Release",
                                    desc: "The Recipient delivers the work or product. Once the Initiator reviews and approves, they trigger the release. Obviater handles the payout instantly, minus our transparent platform fee.",
                                    icon: Unlock,
                                    color: "bg-purple-500",
                                    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
                                }
                            ].map((step, i) => (
                                <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center bg-white p-8 rounded-[2rem] border shadow-sm`}>
                                    <div className="flex-1">
                                        <div className={`h-12 w-12 ${step.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-zinc-200`}>
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                        <p className="text-zinc-600 leading-relaxed italic">{step.desc}</p>
                                        <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm cursor-pointer group">
                                            Learn more technical details
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <img src={step.image} className="rounded-2xl border aspect-video object-cover" alt={step.title} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Technical Deep Dive */}
                <section className="py-24 bg-zinc-900 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-black mb-6 italic">Behind the scenes</h2>
                                <p className="text-zinc-400 mb-8 leading-relaxed italic">
                                    We don't just move numbers around in a database. Obviater leverages smart contracts and banking APIs to ensure true asset isolation.
                                </p>
                                <div className="space-y-6">
                                    {[
                                        { title: "Smart Contract Escrow", desc: "For crypto deals, funds are held in audited, verified contracts on-chain." },
                                        { title: "Plaid Integration", desc: "Bank accounts are verified instantly for ACH transfers." },
                                        { title: "Webhook Events", desc: "Developers can listen for 'funded' and 'released' events." }
                                    ].map((tech, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="mt-1 h-2 w-2 bg-primary rounded-full shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-lg">{tech.title}</h4>
                                                <p className="text-sm text-zinc-500">{tech.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-zinc-800 p-8 rounded-3xl border border-zinc-700 font-mono text-xs text-primary/80">
                                <p className="mb-2 text-zinc-500">// Example Smart Contract Logic</p>
                                <p className="mb-1"><span className="text-purple-400">function</span> <span className="text-blue-400">releaseFunds</span>(uint256 dealId) <span className="text-purple-400">external</span> {'{'}</p>
                                <p className="pl-4 mb-1"><span className="text-purple-400">require</span>(msg.sender == deals[dealId].sender, <span className="text-green-400">"Not authorized"</span>);</p>
                                <p className="pl-4 mb-1"><span className="text-purple-400">require</span>(deals[dealId].status == Status.Funded, <span className="text-green-400">"Not funded"</span>);</p>
                                <p className="pl-4 mb-1">deals[dealId].status = Status.Completed;</p>
                                <p className="pl-4 mb-1">IERC20(usdc).transfer(deals[dealId].recipient, amount);</p>
                                <p className="pl-4 mb-1">emit DealCompleted(dealId);</p>
                                <p>{'}'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dispute Explanation */}
                <section className="py-24 bg-zinc-50 border-y">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-[3rem] p-12 border shadow-sm relative overflow-hidden">
                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold mb-6">
                                        <ShieldAlert className="h-4 w-4" />
                                        <span>Safety First</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black mb-6 italic">What if things go wrong?</h2>
                                    <p className="text-zinc-600 mb-8 leading-relaxed italic">
                                        If there is a disagreement about the quality of work or delivery status, either party can initiate a <strong>Dispute</strong>. This freezes the funds immediately.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Funds are locked and cannot be withdrawn.",
                                            "An Obviater Admin is assigned to the case.",
                                            "Both parties provide evidence (chat logs, files).",
                                            "A final resolution is reached within 72 hours."
                                        ].map((text, i) => (
                                            <li key={i} className="flex gap-3 items-start text-sm text-zinc-600">
                                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-zinc-50 rounded-2xl p-8 border border-dashed border-red-200">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                            <Scale className="h-5 w-5" />
                                        </div>
                                        <h4 className="font-bold">Admin Arbitration</h4>
                                    </div>
                                    <p className="text-sm text-zinc-500 mb-6 italic">
                                        Our team acts as a neutral third party. We review the transaction terms set at the start of the deal and ensure fairness is upheld for both the sender and the receiver.
                                    </p>
                                    <div className="p-4 bg-white rounded-xl border text-xs text-zinc-400 leading-relaxed italic">
                                        "We recently resolved a $10,000 domain transfer dispute by verifying registry logs. Protection you can count on."
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Preview */}
                <section className="py-24 bg-white">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary mb-8">
                            <Info className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-bold mb-8 italic">Still have questions?</h2>
                        <p className="text-zinc-500 mb-10 italic">
                            Our help center covers everything from fee structures to crypto network confirmations.
                        </p>
                        <Link
                            href="/faq"
                            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                        >
                            Browse the FAQ
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div >
    );
}

function Scale(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
    );
}
