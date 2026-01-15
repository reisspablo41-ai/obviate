import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
    ShieldCheck,
    Lock,
    FileCheck,
    Eye,
    Database,
    Server,
    UserCheck,
    Search,
    Scale
} from "lucide-react";

export default function Security() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <section className="bg-primary pt-24 pb-32 text-white relative overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 italic">Built for Billions, Protected for Everyone</h1>
                        <p className="text-xl text-emerald-100 max-w-3xl mx-auto italic">
                            Security isn't a feature—it's the core of our existence. From multi-sig crypto custody to AML-regulated bank partnerships, we've thought of everything.
                        </p>
                    </div>
                    {/* Decorative background circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
                </section>

                {/* Core Pillars */}
                <section className="-mt-16 pb-24 relative z-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            {[
                                { title: "Custody Isolation", desc: "User funds are never mixed with company operational funds. Every deal has a dedicated tracker.", icon: Lock, color: "text-blue-600" },
                                { title: "KYC/AML Compliance", desc: "Strict identity verification prevents fraud and ensures we stay compliant with global regulations.", icon: UserCheck, color: "text-emerald-600" },
                                { title: "Encryption at Rest", desc: "All sensitive data, including receipts and identity documents, are protected by AES-256 encryption.", icon: Database, color: "text-amber-600" },
                            ].map((pillar, i) => (
                                <div key={i} className="bg-white p-10 rounded-[2.5rem] border shadow-xl flex flex-col items-center">
                                    <div className={`h-16 w-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6`}>
                                        <pillar.icon className={`h-8 w-8 ${pillar.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
                                    <p className="text-sm text-zinc-500 italic leading-relaxed">{pillar.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Detailed Explanations */}
                <section className="py-24 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="space-y-32">
                            {/* KYC/KYX */}
                            <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black mb-8 italic flex items-center gap-3">
                                        <Search className="h-8 w-8 text-primary" />
                                        KYC & KYX Analysis
                                    </h2>
                                    <p className="text-zinc-600 leading-relaxed italic mb-8">
                                        We don't just verify identities (KYC); we analyze transactions (KYX) to identify risky patterns and prevent money laundering before it happens.
                                    </p>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Government ID", desc: "Passports, Driver's Licenses, and National IDs supported from 190+ countries." },
                                            { label: "Liveness Checks", desc: "Blink and head-turn tests to ensure the person behind the screen is real." },
                                            { label: "Transaction Rating", desc: "Every deal is cross-referenced against global sanctions and watchlists." }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="mt-1 h-5 w-5 bg-primary/10 rounded flex items-center justify-center shrink-0">
                                                    <FileCheck className="h-3 w-3 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{item.label}</p>
                                                    <p className="text-xs text-zinc-400 italic">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <img
                                        src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
                                        className="rounded-[3rem] border shadow-2xl scale-95 hover:scale-100 transition-transform duration-500"
                                        alt="Security Dashboard"
                                    />
                                </div>
                            </div>

                            {/* Dispute Resolution */}
                            <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div className="order-2 md:order-1">
                                    <img
                                        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
                                        className="rounded-[3rem] border shadow-2xl"
                                        alt="Legal Arbitration"
                                    />
                                </div>
                                <div className="order-1 md:order-2">
                                    <h2 className="text-3xl md:text-4xl font-black mb-8 italic flex items-center gap-3 text-amber-600">
                                        <Scale className="h-8 w-8" />
                                        Admin Arbitration
                                    </h2>
                                    <p className="text-zinc-600 leading-relaxed italic mb-8">
                                        In the event of a dispute, our expert arbitration team steps in. Funds are legally held in our 'Disputed' state until a human operator reviews the evidence provided by both parties.
                                    </p>
                                    <div className="p-6 bg-zinc-50 rounded-2xl border border-dashed border-amber-200">
                                        <h5 className="font-bold text-amber-800 mb-2 italic">Non-Automatic Release</h5>
                                        <p className="text-sm text-zinc-500 italic">
                                            Unlike some platforms that force-release funds after a timer, Obviate prioritizes human review for high-value disputes to ensure justice is served.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Infrastructure */}
                            <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black mb-8 italic flex items-center gap-3">
                                        <Server className="h-8 w-8 text-zinc-900" />
                                        Infrastructure
                                    </h2>
                                    <p className="text-zinc-600 leading-relaxed italic mb-8">
                                        Obviate runs on a highly available, multi-region cloud architecture. Our databases are SOC 2 Type II compliant and regularly audited.
                                    </p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-4 bg-zinc-50 rounded-xl">
                                            <div className="font-black text-2xl text-zinc-900 mb-1">99.99%</div>
                                            <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Uptime SLA</div>
                                        </div>
                                        <div className="p-4 bg-zinc-50 rounded-xl">
                                            <div className="font-black text-2xl text-zinc-900 mb-1">2048-bit</div>
                                            <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest">RSA Keys</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-zinc-900 p-8 rounded-[3rem] text-white">
                                    <div className="flex gap-2 mb-8">
                                        <div className="h-3 w-3 rounded-full bg-red-500" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                    </div>
                                    <pre className="text-[10px] md:text-xs font-mono text-emerald-400 opacity-80 overflow-hidden leading-relaxed">
                                        {`# OBVIATE SECURITY LOGS
[INFO] 14:02:11 - New Escrow Vault Created: #VAULT-772
[INFO] 14:02:11 - Multi-sig Verification: APPROVED
[WARN] 14:05:32 - IP Login Mismatch: #USR-99
[INFO] 14:05:33 - 2FA Challenge Sent to #USR-99
[INFO] 14:06:01 - Identity Proof Verified: #DOC-1120
[SYSTEM] - Encryption: AES-256 ACTIVE
[SYSTEM] - Firewall: CLOUDFLARE WAF TUNED`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bug Bounty */}
                <section className="py-24 bg-zinc-900 text-white relative overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-6" />
                        <h2 className="text-3xl font-black mb-6 italic">White Hat? We pay for bugs.</h2>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto italic mb-8">
                            We value the security community. If you find a vulnerability in our platform, we offer competitive bounties.
                        </p>
                        <a href="mailto:security@obviate.com" className="inline-flex h-12 items-center justify-center rounded-xl bg-white/10 px-8 text-sm font-bold text-white transition-all hover:bg-white/20 border border-white/10">
                            Report a Vulnerability
                        </a>
                    </div>
                </section >

                {/* Badges */}
                < section className="py-24 border-t bg-zinc-50" >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale">
                            <span className="font-black text-xl italic tracking-tighter">SOC2 COMPLIANT</span>
                            <span className="font-black text-xl italic tracking-tighter">PCI-DSS READY</span>
                            <span className="font-black text-xl italic tracking-tighter">GDPR CERTIFIED</span>
                            <span className="font-black text-xl italic tracking-tighter">AML/CTF ALIGNED</span>
                        </div>
                    </div>
                </section >
            </main >

            <Footer />
        </div >
    );
}
