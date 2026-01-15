'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Check, X, FileText, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type KYCRecord = {
    id: string
    user_id: string
    status: 'pending' | 'verified' | 'rejected'
    created_at: string
    profiles: {
        full_name: string
        email: string // assuming email is in profiles or we fetch from auth
    }
    // We'll fetch docs separately or via join
}

export default function AdminKYCPage() { // Changed to Client Component for interactivity
    const [verifications, setVerifications] = useState<KYCRecord[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        fetchKYC()
    }, [])

    const fetchKYC = async () => {
        // Note: 'profiles' join requires foreign key setup properly in schema. 
        // Schema in PRD shows: user_id REFERENCES profiles(id)
        // profiles table extends auth.users but PRD schema doesn't show email column in profiles.
        // We might need to fetch email from auth.users separately or assume it's synced to profiles?
        // For now, let's just fetch what we can.
        const { data, error } = await supabase
            .from('kyc_verifications')
            .select('*, profiles(full_name)')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        if (data) {
            setVerifications(data as any)
        }
        setLoading(false)
    }

    const handleReview = async (id: string, decision: 'verified' | 'rejected') => {
        const { error } = await supabase
            .from('kyc_verifications')
            .update({
                status: decision,
                verified_at: decision === 'verified' ? new Date().toISOString() : null,
                // rejection_reason: ...
            })
            .eq('id', id)

        if (!error) {
            fetchKYC()
            // Ideally show success toast
        }
    }

    if (loading) {
        return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">KYC Verification Queue</h1>
                <p className="text-gray-600">Review pending identity documents.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {verifications.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No pending verifications.
                                    </td>
                                </tr>
                            ) : (
                                verifications.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                                    {item.profiles?.full_name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.profiles?.full_name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">ID: {item.user_id.slice(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                Pending Review
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleReview(item.id, 'verified')}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Approve"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleReview(item.id, 'rejected')}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Reject"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <button className="p-1 text-gray-400 hover:text-gray-600 rounded" title="View Docs">
                                                    <FileText className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
