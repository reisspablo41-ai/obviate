import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  ShieldCheck,
  ArrowRight,
  Banknote,
  Coins,
  UserCheck,
  Globe2,
  Lock,
  Zap,
  Scale,
  DollarSign,
  Users,
  Briefcase,
  Star,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  Server,
  Eye,
  CreditCard
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-16 bg-white/80 border-b" />}>
        <Navbar />
      </Suspense>

      <main className="flex-grow">
        {/* 1. HERO SECTION: Persona Targeting */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-white">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-5">
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary to-transparent" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div className="text-center lg:text-left">
                {/* Persona Chips */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                  {['Freelancers', 'Agencies', 'Domain Sellers', 'Crypto Traders'].map((persona) => (
                    <span key={persona} className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold border border-zinc-200">
                      For {persona}
                    </span>
                  ))}
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 mb-8 leading-[1.1]">
                  Trustless Deals for a <br className="hidden md:block" />
                  <span className="text-primary italic">Trust-demanding</span> World.
                </h1>
                <p className="text-xl md:text-2xl text-zinc-500 mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Secure your high-value transactions with bank-grade escrow.
                  We hold the funds until the work is done.
                </p>

                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-16">
                  <Link
                    href="/signup"
                    className="inline-flex h-16 items-center justify-center rounded-2xl bg-primary px-10 text-lg font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-1"
                  >
                    Start a Deal Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex h-16 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white px-10 text-lg font-bold text-zinc-600 transition-all hover:bg-zinc-50"
                  >
                    See How it Works
                  </Link>
                </div>

                {/* Social Proof Mini */}
                <div className="flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-zinc-400 grayscale opacity-60">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" /> SOC2 Compliant
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5" /> AES-256 Encryption
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-5 w-5" /> 120+ Countries
                  </div>
                </div>
              </div>

              {/* Rotating Container */}
              <div className="relative mt-16 lg:mt-0 hidden lg:block">
                <div className="bg-white rounded-3xl shadow-2xl border p-2 rotate-2 relative z-10 transition-transform hover:rotate-0 duration-500">
                  <div className="bg-zinc-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="font-bold text-lg">New Deal Invitation</h3>
                        <p className="text-xs text-zinc-500">From: john@example.com</p>
                      </div>
                      <div className="bg-emerald-100 p-2 rounded-lg text-primary">
                        <DollarSign className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center text-sm border-b border-zinc-200 pb-2">
                        <span className="text-zinc-500">Service</span>
                        <span className="font-semibold text-zinc-900">Custom Web Application</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-zinc-200 pb-2">
                        <span className="text-zinc-500">Escrow Amount</span>
                        <span className="font-bold text-primary">$4,500.00 USD</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">Status</span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">Awaiting Funds</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-dashed border-primary/30 mb-8">
                      <p className="text-xs text-center text-zinc-400 italic leading-relaxed">
                        "Your payment will be stored in our regulated vault until you confirm project delivery."
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-10 rounded-lg bg-zinc-200 flex items-center justify-center text-sm font-bold text-zinc-500 cursor-not-allowed">Decline</div>
                      <div className="h-10 rounded-lg bg-primary flex items-center justify-center text-sm font-bold text-white shadow-md shadow-primary/20 cursor-pointer">Accept Securely</div>
                    </div>
                  </div>
                </div>

                {/* Decorative backgrounds */}
                <div className="absolute -top-10 -right-10 h-64 w-64 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-10 -left-10 h-64 w-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. PAIN AMPLIFIER: Risk vs Solution */}
        <section className="py-24 bg-zinc-50 border-y">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-8 text-zinc-900 italic">The "Direct Payment" Nightmare</h2>
                <div className="space-y-6">
                  {[
                    "Client disappears after receiving the work.",
                    "Seller delivers poor quality or wrong items.",
                    "No legal recourse for international wire fraud.",
                    "Chargebacks weeks after delivery."
                  ].map((pain, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 bg-red-50/50 rounded-xl border border-red-100">
                      <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                      <p className="text-red-900 font-medium">{pain}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] transform rotate-3" />
                <div className="bg-white p-10 rounded-[2.5rem] border shadow-xl relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-6">
                    <CheckCircle2 className="h-4 w-4" />
                    The Obviater Standard
                  </div>
                  <h3 className="text-3xl font-black mb-6 italic">Total Protection.</h3>
                  <p className="text-zinc-600 mb-8 leading-relaxed">
                    Obviater eliminates risk by holding funds in a secure neutral vault.
                    The seller knows the money is there. The buyer knows it won't move until they say so.
                  </p>
                  <Link href="/signup" className="text-primary font-bold hover:underline flex items-center gap-2">
                    Secure your next deal <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. LIFECYCLE VISUAL: The Process */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 italic">How it Works</h2>
              <p className="text-zinc-500">A transparent path from agreement to payment.</p>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -translate-y-1/2 hidden md:block z-0" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {[
                  { step: "01", title: "Agree", desc: "Set terms & price", icon: FileCheck },
                  { step: "02", title: "Fund", desc: "Buyer deposits", icon: Lock },
                  { step: "03", title: "Work", desc: "Seller delivers", icon: Briefcase },
                  { step: "04", title: "Review", desc: "Buyer approves", icon: Eye },
                  { step: "05", title: "Pay", desc: "Funds released", icon: DollarSign },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm text-center">
                    <div className="h-12 w-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Step {s.step}</div>
                    <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                    <p className="text-xs text-zinc-500 italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. COMPARISON TABLE */}
        <section className="py-24 bg-zinc-900 text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16 italic">Why Obviater beats direct transfers</h2>
            <div className="bg-zinc-800/50 rounded-3xl border border-zinc-700 overflow-hidden">
              <div className="grid grid-cols-3 bg-zinc-800 p-6 border-b border-zinc-700 font-bold text-lg">
                <div className="text-zinc-400">Feature</div>
                <div className="text-center text-zinc-400">Direct Wire</div>
                <div className="text-center text-primary">Obviater Escrow</div>
              </div>
              {[
                { feat: "Payment Protection", bad: "None", good: "100% Secured" },
                { feat: "Dispute Resolution", bad: "Expensive Lawyers", good: "Included Admin" },
                { feat: "Fraud Checks", bad: "Zero", good: "KYC & KYX" },
                { feat: "Hold Time", bad: "Instant (Gone)", good: "Until Approved" },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 p-6 border-b border-zinc-700/50 last:border-0 hover:bg-white/5 transition-colors">
                  <div className="font-medium">{row.feat}</div>
                  <div className="text-center text-zinc-500 font-mono text-sm">{row.bad}</div>
                  <div className="text-center text-white font-bold flex justify-center items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> {row.good}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. SECURITY SNAPSHOT */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6">
                  <ShieldCheck className="h-4 w-4" />
                  Bank-Grade Security
                </div>
                <h2 className="text-4xl font-black mb-6 italic">Fort Knox for your digital deals.</h2>
                <p className="text-zinc-600 mb-8 leading-relaxed">
                  We don't take chances with your money. Our infrastructure is designed for zero-trust security.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
                      <Server className="h-6 w-6 text-zinc-700" />
                    </div>
                    <div>
                      <h4 className="font-bold">Isolated Vaults</h4>
                      <p className="text-sm text-zinc-500">Funds are never commingled with corporate accounts.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
                      <UserCheck className="h-6 w-6 text-zinc-700" />
                    </div>
                    <div>
                      <h4 className="font-bold">Identity Verification</h4>
                      <p className="text-sm text-zinc-500">Mandatory KYC ensures you know who you're dealing with.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-50 p-8 rounded-[2.5rem] border border-dashed border-zinc-200">
                <pre className="text-xs font-mono text-zinc-400 bg-white p-6 rounded-2xl border shadow-sm overflow-hidden">
                  {`// AUDIT LOG: TRANSACTION #88291
> 10:00:01 - Deal Created
> 10:05:22 - KYC Verified (Pass)
> 12:30:15 - Funds Received (USDC)
> 12:30:16 - Vault Locked 🔒
> 14:00:00 - Pending Delivery...`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* 6. PAYMENT SUPPORT */}
        <section className="py-24 bg-zinc-50 border-y">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-12 italic">Bank or Blockchain? We speak both.</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: "USDC / USDT", icon: Coins, bg: "bg-blue-100 text-blue-600" },
                { name: "Wire Transfer", icon: Banknote, bg: "bg-emerald-100 text-emerald-600" },
                { name: "ACH / SEPA", icon: CreditCard, bg: "bg-purple-100 text-purple-600" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-4 bg-white px-8 py-6 rounded-2xl border shadow-sm hover:-translate-y-1 transition-transform">
                  <div className={`h-12 w-12 ${p.bg} rounded-full flex items-center justify-center`}>
                    <p.icon className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-lg">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. TRANSPARENCY & FEES */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block p-1 rounded-full bg-zinc-100 mb-8 border">
              <span className="px-4 py-1 rounded-full bg-white shadow-sm text-xs font-bold uppercase tracking-widest">Pricing</span>
            </div>
            <h2 className="text-5xl font-black mb-8">5% Flat Fee.</h2>
            <p className="text-xl text-zinc-500 mb-12 italic">
              No subscription. No hidden costs. We only get paid when your deal succeeds.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-zinc-50 p-6 rounded-2xl">
                <h4 className="font-bold mb-2">Split the Fee</h4>
                <p className="text-sm text-zinc-500">Buyer and seller can split the 5% fee 50/50.</p>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl">
                <h4 className="font-bold mb-2">Refundable</h4>
                <p className="text-sm text-zinc-500">If the deal is cancelled before work starts, fees are returned.</p>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl">
                <h4 className="font-bold mb-2">Volume Discounts</h4>
                <p className="text-sm text-zinc-500">Doing over $100k? Contact us for custom rates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. DISPUTE LOGIC */}
        <section className="py-24 bg-red-50/30 border-y border-red-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="bg-white p-8 rounded-3xl border shadow-lg">
                  <div className="flex items-center justify-between mb-8 border-b pb-4">
                    <h4 className="font-bold text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" /> Dispute Active
                    </h4>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold uppercase">Funds Frozen</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-zinc-200 shrink-0" />
                      <div className="bg-zinc-100 p-3 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl text-xs text-zinc-600">
                        The item received is damaged. Here is the photo.
                      </div>
                    </div>
                    <div className="flex gap-4 flex-row-reverse">
                      <div className="h-8 w-8 rounded-full bg-primary shrink-0" />
                      <div className="bg-primary/10 p-3 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl text-xs text-primary-900 font-medium">
                        <span className="font-bold text-primary block mb-1">Admin</span>
                        Reviewing evidence. Please allow 24h for a verdict.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-6 italic">What happens if things go wrong?</h2>
                <p className="text-zinc-600 mb-8 leading-relaxed">
                  Most deals go smoothly. But if they don't, you're not alone.
                  Our neutral arbitration team steps in to review chat logs, files, and agreements.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-3 items-center text-sm font-medium">
                    <div className="h-2 w-2 bg-red-500 rounded-full" /> Funds stay frozen during disputes
                  </div>
                  <div className="flex gap-3 items-center text-sm font-medium">
                    <div className="h-2 w-2 bg-red-500 rounded-full" /> Human review, not bots
                  </div>
                  <div className="flex gap-3 items-center text-sm font-medium">
                    <div className="h-2 w-2 bg-red-500 rounded-full" /> Fair binding resolution
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. SOCIAL PROOF */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-16 italic">Trusted by 50,000+ Users</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Obviater saved me from a $15k scam. The dispute team was incredibly professional.",
                  author: "Sarah J.",
                  role: "Digital Artist"
                },
                {
                  quote: "The interface is so clean. My clients actually enjoy using the escrow process now.",
                  author: "Michael C.",
                  role: "Agency Owner"
                },
                {
                  quote: "Fastest settlement I've ever seen for a domain transfer. Highly recommended.",
                  author: "David L.",
                  role: "Domainer"
                }
              ].map((t, i) => (
                <div key={i} className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-600 mb-6 italic leading-relaxed">"{t.quote}"</p>
                  <div className="font-bold text-zinc-900">{t.author}</div>
                  <div className="text-xs text-zinc-400 uppercase tracking-widest">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. GUARANTEES */}
        <section className="py-16 bg-zinc-900 text-white border-b border-zinc-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {[
                { title: "Never Released Early", desc: "Funds move only when you approve." },
                { title: "24/7 Support", desc: "Real humans, always online." },
                { title: "Verified Identities", desc: "No anonymous bad actors." }
              ].map((g, i) => (
                <div key={i}>
                  <h4 className="font-black text-xl mb-2 text-primary">{g.title}</h4>
                  <p className="text-zinc-400 italic">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. FEATURE: INVITE ANYONE */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-[3rem] p-12 text-white text-center shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black mb-6 italic">Start a deal with just an email.</h2>
                <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto italic">
                  No account needed for your client to view the deal. Send them an Obviater Link and they can sign up to accept in seconds.
                </p>
                <div className="inline-flex bg-white/10 p-2 rounded-xl border border-white/20 backdrop-blur-md mb-8">
                  <code className="text-white font-mono px-4">obviater.com/deal/88a9-f00d-22x1</code>
                </div>
                <div>
                  <Link href="/signup" className="inline-flex h-14 items-center justify-center rounded-xl bg-white text-primary font-bold px-8 shadow-lg hover:bg-zinc-50 transition-colors">
                    Create an Invite Link
                  </Link>
                </div>
              </div>
              {/* Decor */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary to-emerald-800 opacity-50" />
              <Zap className="absolute -bottom-12 -right-12 h-64 w-64 text-white/5 rotate-12" />
            </div>
          </div>
        </section>

        {/* 12. COMPLIANCE */}
        <section className="py-12 bg-white text-center">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Fully Compliant & Regulated</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-zinc-500 border border-zinc-200 inline-flex px-8 py-4 rounded-full bg-zinc-50">
            <span className="flex items-center gap-2"><Scale className="h-4 w-4" /> AML Standards</span>
            <span className="w-px h-4 bg-zinc-300" />
            <span className="flex items-center gap-2"><Globe2 className="h-4 w-4" /> OFAC Screened</span>
            <span className="w-px h-4 bg-zinc-300" />
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> GDPR Ready</span>
          </div>
        </section>

        {/* 13. FAQ MINI */}
        <section className="py-24 bg-zinc-50 border-y">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center italic">Quick Answers</h2>
            <div className="space-y-4">
              {[
                { q: "Is my money safe?", a: "Yes. Funds are held in a regulated, non-interest bearing trust account until the deal is complete." },
                { q: "Can I cancel a deal?", a: "Yes, if the work hasn't started or both parties agree, funds are returned immediately." },
                { q: "Who pays the fee?", a: "You decide. It can be the sender, the recipient, or a 50/50 split." }
              ].map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm">
                  <h4 className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-zinc-400" /> {faq.q}
                  </h4>
                  <p className="text-zinc-500 pl-7">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/faq" className="text-primary font-bold hover:underline">View all FAQs &rarr;</Link>
            </div>
          </div>
        </section>

        {/* 14. CTA REPEATED */}
        <section className="py-32 bg-white text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl md:text-7xl font-black mb-8 italic text-zinc-900">Ready to deal?</h2>
            <p className="text-2xl text-zinc-500 mb-12 italic max-w-2xl mx-auto">
              Join thousands of freelancers, agencies, and traders who entrust their payments to Obviater.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex h-16 items-center justify-center rounded-2xl bg-zinc-900 px-12 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                Get Started for Free
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-16 items-center justify-center rounded-2xl bg-zinc-100 px-12 text-lg font-bold text-zinc-900 transition-all hover:bg-zinc-200"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
