import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Mail, MessageCircle, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export default function Contact() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <section className="bg-zinc-900 pt-24 pb-20 text-white border-b relative overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 italic">Get in Touch</h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto italic">
                            Have a question about a transaction or need help with verification? Our team is here to help 24/7.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 h-full w-1/4 bg-primary/20 blur-[120px] -z-0" />
                </section>

                {/* Contact Section */}
                <section className="py-24 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16">
                            {/* Contact Info */}
                            <div>
                                <h2 className="text-3xl font-bold mb-8 italic">Contact Details</h2>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Email Support</h3>
                                            <p className="text-zinc-500 mb-2">For general inquiries and dispute resolution.</p>
                                            <a href="mailto:support@obviate.com" className="text-primary font-medium hover:underline">
                                                support@obviate.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                            <MessageCircle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Live Chat</h3>
                                            <p className="text-zinc-500 mb-2">Available for active users inside the dashboard.</p>
                                            <span className="text-zinc-400 text-sm font-medium">Average response time: 5 mins</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Headquarters</h3>
                                            <p className="text-zinc-500">
                                                123 Secure Lane<br />
                                                Financial District, NY 10005<br />
                                                United States
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 p-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                                    <h4 className="font-bold mb-2 flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-zinc-400" />
                                        Press & Media
                                    </h4>
                                    <p className="text-sm text-zinc-500 mb-4">
                                        For media inquiries, please contact our PR team directly.
                                    </p>
                                    <a href="mailto:press@obviate.com" className="text-sm font-bold text-zinc-900 hover:text-primary transition-colors">
                                        press@obviate.com &rarr;
                                    </a>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="bg-white rounded-3xl p-8 border shadow-lg shadow-zinc-100">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
