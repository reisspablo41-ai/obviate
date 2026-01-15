'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, UserPlus } from 'lucide-react'
import { createProfileAction } from '@/actions/create-profile'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
// phone-input.css removed 
// Actually, let's just use a style block or wrapper since we can't easily create a new CSS file in this tool call without a separate step, 
// and I want to keep it simple. Detailed CSS refinement can happen later.
// I'll drop the import './phone-input.css' and just style the container.

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()
    const supabase = createClient()

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // Redirect to verify email page or callback
                    emailRedirectTo: `${location.origin}/auth/callback`,
                    data: {
                        full_name: fullName,
                        phone_number: phone,
                    },
                },
            })

            if (signUpError) throw signUpError

            if (authData.user) {
                // 2. Create Profile Record via Server Action
                // This ensures we verify the session server-side and handle DB constraints safely
                const result = await createProfileAction(authData.user.id, fullName, phone)

                if (result.error) {
                    // If error is "Not authenticated", it might just mean email verification is pending.
                    // We shouldn't block the flow for that, as the user exists.
                    if (result.error !== 'Not authenticated') {
                        console.error('Profile creation warning:', result.error)
                        // Optional: throw error or just proceed? 
                        // Proceeding is safer if the account was created.
                    }
                }

                // 3. Navigate to Verify Email Page
                router.push('/auth/verify-email')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create account')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Start using secure escrow services today
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <PhoneInput
                                    placeholder="Enter phone number"
                                    value={phone}
                                    onChange={(value) => setPhone(value as string)}
                                    defaultCountry="US"
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 [&>input]:outline-none [&>input]:bg-transparent [&>div]:mr-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
