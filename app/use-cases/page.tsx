import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
    Briefcase,
    Globe2,
    ShoppingCart,
    Cpu,
    Landmark,
    Lightbulb,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function UseCases() {
    const cases = [
        {
            title: "Freelancers & Agencies",
            desc: "Stop worrying about 'ghosting' clients. Ensure payment is funded before you start the project. Release funds on milestone approval.",
            icon: Briefcase,
            color: "bg-blue-100 text-blue-600",
            stats: "0% Unpaid Invoices"
        },
        {
            title: "Digital Assets & Domains",
            desc: "Buying a high-value domain or a social media handle? Obviate holds the money while the ownership transfer is verified.",
            icon: Lightbulb,
            color: "bg-amber-100 text-amber-600",
            stats: "$1B+ Market Cap"
        },
        {
            title: "Cross-Border Commerce",
            desc: "Trading with someone in a different country? Use stablecoins (USDC) to bypass slow international banking and high FX fees.",
            icon: Globe2,
            color: "bg-emerald-100 text-emerald-600",
            stats: "Global Reach"
        },
        {
            title: "Online Marketplaces",
            desc: "Direct peer-to-peer sales of luxury watches, electronics, or designer goods. Buyer funds first; seller ships next.",
            icon: ShoppingCart,
            color: "bg-purple-100 text-purple-600",
            stats: "Certified Sellers"
        },
        {
            title: "Software & SaaS Deals",
            desc: "Source code handovers and enterprise software licenses. Release funds once the code is audited and deployed.",
            icon: Cpu,
            color: "bg-zinc-100 text-zinc-900",
            stats: "Code Verified"
        },
        {
            title: "Real Estate Deposits",
            desc: "Secure holding for earnest money or rental deposits. Funds stay safe until the lease or purchase contract is signed.",
            icon: Landmark,
            color: "bg-red-100 text-red-600",
            stats: "Legally Binding"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <section className="bg-zinc-50 pt-24 pb-20 border-b overflow-hidden relative">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 italic">Built for the Modern Economy</h1>
                        <p className="text-xl text-zinc-500 max-w-2xl italic leading-relaxed">
                            Obviate is flexible enough to handle any transaction where trust is required. See how leaders across industries use our platform.
                        </p>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
                </section>

                {/* Use Case Grid */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cases.map((c, i) => (
                                <div key={i} className="group p-8 rounded-[2.5rem] bg-white border border-zinc-200 hover:border-primary/20 hover:shadow-2xl transition-all duration-300 flex flex-col items-start">
                                    <div className={`h-12 w-12 ${c.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <c.icon className="h-6 w-6" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-2">{c.stats}</div>
                                    <h3 className="text-xl font-bold mb-4">{c.title}</h3>
                                    <p className="text-sm text-zinc-500 italic leading-relaxed mb-6 flex-grow">{c.desc}</p>
                                    <Link
                                        href="/signup"
                                        className="flex items-center gap-2 text-sm font-bold text-zinc-900 group-hover:text-primary transition-colors"
                                    >
                                        Get started with this
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Story Focus */}
                <section className="py-24 bg-primary text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                    className="rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700"
                                    alt="Team collaboration"
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-5xl font-black mb-8 italic">Trust has no borders.</h2>
                                <p className="text-lg text-emerald-100 italic mb-8 italic">
                                    "We used Obviate to hire a development team in Vietnam for a $50k project. The ability to fund in USDC and release on milestones saved us from a logistical nightmare and thousands in bank fees."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-accent text-primary flex items-center justify-center font-black">
                                        JD
                                    </div>
                                    <div>
                                        <div className="font-bold">Julianne DeSilva</div>
                                        <div className="text-sm opacity-60">Founder, Stealth-Mode AI</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 bg-white">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-black mb-8 italic">Ready to secure your business?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/signup"
                                className="h-14 inline-flex items-center justify-center rounded-2xl bg-zinc-900 text-white px-10 font-bold shadow-xl hover:bg-zinc-800 transition-all hover:scale-105"
                            >
                                Create Free Account
                            </Link>
                            <Link
                                href="/pricing"
                                className="h-14 inline-flex items-center justify-center rounded-2xl border-2 border-zinc-200 text-zinc-600 px-10 font-bold hover:bg-zinc-50 transition-all"
                            >
                                Explore Pricing
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
