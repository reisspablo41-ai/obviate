import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Privacy() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow py-24">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-black mb-12 italic">Privacy Policy</h1>
                    <p className="text-sm text-zinc-400 mb-8 italic">Last Updated: January 9, 2026</p>

                    <div className="prose prose-zinc prose-sm italic max-w-none space-y-8 text-zinc-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">1. Information We Collect</h2>
                            <p>
                                To provide secure escrow services, we collect personal information including your name, email address, and identity verification documents (KYC). We also collect transaction data and communication logs within the Deal Room.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">2. How We Use Your Data</h2>
                            <p>
                                Your data is used strictly for:
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Processing transactions and releasing funds.</li>
                                    <li>Verifying your identity to prevent fraud.</li>
                                    <li>Improving platform security and performance.</li>
                                    <li>Communicating critical deal updates.</li>
                                </ul>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">3. Data Retention</h2>
                            <p>
                                We retain transaction records and identity information as required by financial regulations (AML/KYC). This may include keeping records for up to 5-7 years depending on your jurisdiction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">4. Third-Party Sharing</h2>
                            <p>
                                We share data with third-party providers only when necessary for our core functions (e.g., Stripe for payments, Sumsub for KYC, or AWS/Supabase for storage). We never sell your data to advertisers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4 not-italic">5. Your Rights</h2>
                            <p>
                                You have the right to access, correct, or request the deletion of your personal data, subject to our regulatory requirements for record-keeping.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
