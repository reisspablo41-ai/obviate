import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { CreateDealForm } from './CreateDealForm'

export default async function CreateDealPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check KYC status
    const { data: kyc } = await supabase
        .from('kyc_verifications')
        .select('status')
        .eq('user_id', user.id)
        .single()

    const isVerified = kyc?.status === 'verified'
    const isPending = kyc?.status === 'pending'

    if (!isVerified) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Deal</h1>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                    <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Identity Verification Required</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {isPending
                            ? "Your verification is currently under review. You will be able to create deals once approved."
                            : "To ensure the safety of all users, you must complete identity verification before creating an escrow deal."
                        }
                    </p>

                    {isPending ? (
                        <button disabled className="px-6 py-2 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed">
                            Verification Pending
                        </button>
                    ) : (
                        <Link
                            href="/kyc"
                            className="inline-block px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Start Verification
                        </Link>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Create New Deal</h1>
                <p className="text-gray-600">Set up a new escrow transaction safely.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <CreateDealForm />
            </div>
        </div>
    )
}
