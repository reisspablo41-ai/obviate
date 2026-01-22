import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'

export default async function ClaimInvitePage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) {
    const token = (await searchParams).token
    const supabase = await createClient()

    console.log('[ClaimInvite] processing token:', token)

    if (!token) {
        // ... existing invalid token UI
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow border max-w-md w-full text-center">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold mb-2">Invalid Invitation</h1>
                    <p className="text-gray-600 mb-6">The invitation link is missing a token.</p>
                    <Link href="/" className="text-emerald-600 hover:underline">Go Home</Link>
                </div>
            </div>
        )
    }

    // 1. Fetch Invitation
    const { data: invite, error } = await supabase.rpc('get_invite_details_by_token', {
        p_token: token
    })

    console.log('[ClaimInvite] RPC result:', { invite, error })

    if (!invite || !invite.deal) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow border max-w-md w-full text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold mb-2">Invitation Not Found</h1>
                    <p className="text-gray-600 mb-6">This link may be invalid or expired.</p>
                    <Link href="/" className="text-emerald-600 hover:underline">Go Home</Link>
                </div>
            </div>
        )
    }

    if (invite.accepted) {
        // Redirect to deal if already accepted? Or show message.
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow border max-w-md w-full text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold mb-2">Inivation Already Accepted</h1>
                    <p className="text-gray-600 mb-6">You have already accepted this deal.</p>
                    <Link href={`/deals/${invite.deal_id}`} className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg">View Deal</Link>
                </div>
            </div>
        )
    }

    // 2. Check Authentication
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // Redirect to signup with return URL
        const returnUrl = encodeURIComponent(`/claim-invite?token=${token}`)
        redirect(`/signup?returnTo=${returnUrl}`)
    }

    // 3. Check KYC
    const { data: kyc } = await supabase
        .from('kyc_verifications')
        .select('status')
        .eq('user_id', user.id)
        .single()

    const isKyced = kyc?.status === 'verified'

    if (!isKyced) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg border border-emerald-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Required</h1>
                    <p className="text-gray-600">
                        To accept this deal worth <strong>{invite.deal.currency} {invite.deal.amount}</strong>,
                        we need to verify your identity.
                    </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Deal Summary</h3>
                    <p className="text-sm text-gray-500">Title: {invite.deal.title}</p>
                    <p className="text-sm text-gray-500">From: {invite.initiator?.full_name || invite.initiator?.email || invite.email}</p>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/kyc"
                        className="w-full py-3 bg-emerald-600 text-white text-center font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Start Verification
                    </Link>
                    <p className="text-xs text-center text-gray-400">
                        It only takes 2 minutes. You'll be redirected back here after.
                    </p>
                </div>
            </div>
        )
    }

    // 4. Accept Deal Action
    async function acceptDeal() {
        'use server'
        const supabase = await createClient()
        // verify auth again inside action just in case 
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        console.log('[ClaimInvite] accepting deal with params:', {
            p_deal_id: invite.deal_id,
            p_invite_id: invite.id,
            p_user_id: user.id
        })

        // Use secure RPC to accept deal (updates deal status/recipient and invite accepted status)
        const { data: result, error: rpcError } = await supabase.rpc('accept_deal_securely', {
            p_deal_id: invite.deal_id,
            p_invite_id: invite.id,
            p_user_id: user.id
        })

        console.log('[ClaimInvite] RPC result:', { result, rpcError })

        if (rpcError || (result && !result.success)) {
            console.error('[ClaimInvite] Error accepting deal:', rpcError || result)
            return // Handle error appropriately in UI if needed
        }

        redirect(`/deals/${invite.deal_id}`)
    }

    return (
        <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">You've been invited!</h1>
                <p className="text-gray-600">
                    You have been invited to participate in a secure escrow transaction.
                </p>
            </div>

            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 mb-8">
                <div className="flex justify-between items-start mb-4 border-b border-emerald-100 pb-4">
                    <div>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Project</p>
                        <p className="font-bold text-gray-900 text-lg">{invite.deal.title}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Value</p>
                        <p className="font-bold text-emerald-700 text-xl">{invite.deal.currency} {invite.deal.amount}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600">
                    {invite.deal.description || "No description provided."}
                </p>
            </div>

            <form action={acceptDeal}>
                <button
                    type="submit"
                    className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                >
                    Accept Deal Securely <ArrowRight className="w-5 h-5" />
                </button>
            </form>
            <div className="mt-4 text-center">
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">Decline & Go to Dashboard</Link>
            </div>
        </div>
    )
}
