import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Terms() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow py-24">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-black mb-12 italic">Terms of Service</h1>
                    <p className="text-sm text-zinc-400 mb-8 italic">Last Updated: January 9, 2026</p>

                    <div className="mb-12 bg-zinc-50 p-8 rounded-3xl border border-zinc-200">
                        <h3 className="font-bold text-zinc-800 mb-4 flex items-center gap-2">
                            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-xs uppercase tracking-wider">Summary</span>
                            Terms High-Level Overview
                        </h3>
                        <ul className="grid sm:grid-cols-2 gap-4 text-sm text-zinc-600 font-medium">
                            <li className="flex gap-2">⚖️ Obviater is a neutral third-party agent.</li>
                            <li className="flex gap-2">💰 5% fee is non-refundable upon success.</li>
                            <li className="flex gap-2">🔒 Disputes are resolved by our Admin team.</li>
                            <li className="flex gap-2">🚫 Illegal goods are strictly prohibited.</li>
                        </ul>
                    </div>

                    <div className="prose prose-zinc prose-sm italic max-w-none space-y-8 text-zinc-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">1. Introduction</h2>
                            <p>
                                Welcome to Obviater ("the Platform"). By accessing or using our escrow services, you agree to be bound by these Terms of Service. Obviater acts as a neutral third-party agent that holds funds in trust until specified transaction conditions are met.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">2. Role of the Platform</h2>
                            <p>
                                Obviater is a technology provider and does not provide legal, financial, or tax advice. We are not a bank. We act solely as a facilitator for transactions between an Initiator (Sender) and a Recipient (Receiver).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">3. Escrow Conditions</h2>
                            <p>
                                Funds are held in escrow once successfully deposited. Release of funds occurs ONLY when the Initiator approves the transaction or when a dispute is resolved by an Obviater administrator.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">4. Fees</h2>
                            <p>
                                A standard platform fee of 5% applies to all transactions. This fee is non-refundable once the funds have been successfully released or a dispute has been resolved.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">5. Dispute Resolution</h2>
                            <p>
                                In the event of a dispute, users agree to grant Obviater the final authority to determine the distribution of escrowed funds. Our decision is final and binding within the context of the platform's ecosystem.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">6. Prohibited Activities</h2>
                            <p>
                                Obviater may not be used for transactions involving illegal goods, services, or any activities that violate our AML/KYC policies.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
