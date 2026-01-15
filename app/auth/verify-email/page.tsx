import Link from 'next/link'
import { MailCheck, ArrowRight } from 'lucide-react'

export default function VerifyEmailPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <MailCheck className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
                <p className="text-gray-600 mb-8">
                    We've sent a verification link to your email address.<br />
                    Please click the link in your inbox to verify your account.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/login"
                        className="flex w-full justify-center items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all"
                    >
                        Log In <ArrowRight className="w-4 h-4" />
                    </Link>

                    <div className="text-sm text-gray-500 pt-2">
                        Did not receive the email?{' '}
                        <button className="text-emerald-600 hover:text-emerald-500 font-medium underline-offset-4 hover:underline">
                            Resend email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
