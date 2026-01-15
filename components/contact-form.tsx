"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export function ContactForm() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, this would send data to an API
    };

    if (submitted) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <Send className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-zinc-500 max-w-xs mx-auto">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-primary font-bold hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    id="name"
                    required
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="John Doe"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    required
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="john@example.com"
                />
            </div>
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 mb-1">
                    Subject
                </label>
                <select
                    id="subject"
                    required
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
                >
                    <option value="">Select a topic...</option>
                    <option value="support">General Support</option>
                    <option value="dispute">Dispute Resolution</option>
                    <option value="verification">Verification Issue</option>
                    <option value="billing">Billing & Fees</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-1">
                    Message
                </label>
                <textarea
                    id="message"
                    required
                    rows={5}
                    className="w-full p-4 rounded-xl border border-zinc-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                />
            </div>
            <button
                type="submit"
                className="w-full h-14 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
                Send Message
                <Send className="h-4 w-4" />
            </button>
        </form>
    );
}
