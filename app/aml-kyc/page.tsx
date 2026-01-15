import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AMLKYC() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow py-24">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-black mb-12 italic text-primary">AML & KYC Compliance</h1>
                    <p className="text-sm text-zinc-400 mb-8 italic">Last Updated: January 9, 2026</p>

                    <div className="mb-12 bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
                        <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                            <span className="bg-emerald-200 text-emerald-700 px-2 py-1 rounded text-xs uppercase tracking-wider">Summary</span>
                            Key Compliance Takeaways
                        </h3>
                        <ul className="grid sm:grid-cols-2 gap-4 text-sm text-emerald-900 font-medium">
                            <li className="flex gap-2">✅ ID Verification required for all funded deals.</li>
                            <li className="flex gap-2">✅ Sanctions screening is automated globally.</li>
                            <li className="flex gap-2">✅ Funds source may be requested for &gt;$10k.</li>
                            <li className="flex gap-2">✅ Your data is encrypted and never sold.</li>
                        </ul>
                    </div>

                    <div className="prose prose-zinc prose-sm italic max-w-none space-y-8 text-zinc-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">1. Our Commitment</h2>
                            <p>
                                Obviate is committed to maintaining the highest standards of Anti-Money Laundering (AML) and Counter-Terrorist Financing (CTF) compliance. We operate in alignment with FATF recommendations and local financial regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">2. Know Your Customer (KYC)</h2>
                            <p>
                                To use Obviate for high-value transactions, all users must complete identity verification. This includes providing:
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Valid government-issued photo identification.</li>
                                    <li>Proof of residential address where required.</li>
                                    <li>Liveness check (Biometric facial scan).</li>
                                </ul>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">3. Transaction Monitoring (KYX)</h2>
                            <p>
                                We employ automated systems to monitor transactions for suspicious activity. If a transaction is flagged, funds may be temporarily held until further proof of source of funds is provided.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">4. Sanction Screening</h2>
                            <p>
                                Obviate does not facilitate transactions involving individuals, entities, or jurisdictions listed on global sanctions watchlists (e.g., OFAC, UN, EU).
                            </p>
                        </section>

                        <section className="bg-zinc-50 p-6 rounded-2xl border border-dashed">
                            <h2 className="text-lg font-bold text-zinc-900 mb-2 not-italic">Questions regarding compliance?</h2>
                            <p className="text-sm italic">
                                Our compliance officer can be reached at <span className="font-bold text-primary">compliance@obviate.com</span> for any inquiries regarding our regulatory stance.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
