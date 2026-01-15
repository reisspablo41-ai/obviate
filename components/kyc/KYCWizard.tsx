'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import StepBasicInfo, { KYCFormData } from './StepBasicInfo'
import StepDocSelection from './StepDocSelection'
import StepDocUpload from './StepDocUpload'
import StepSelfie from './StepSelfie'
import { CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function KYCWizard() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [complete, setComplete] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<KYCFormData>({
        fullName: '',
        dateOfBirth: '',
        country: '',
        nationality: '',
        phoneNumber: '',
        ssn: '',
        documentType: 'passport',
        frontImage: null,
        backImage: null,
        selfieImage: null
    })

    // Function to skip kyc (for users who already kyc'd but somehow landed here? 
    // or maybe better handled by middleware) - user said "Auto-match name with ID later"

    const updateFormData = (data: Partial<KYCFormData>) => {
        setFormData(prev => ({ ...prev, ...data }))
    }

    const nextStep = () => setCurrentStep(prev => prev + 1)
    const prevStep = () => setCurrentStep(prev => prev - 1)

    const handleSubmit = async () => {
        setIsSubmitting(true)

        try {
            const supabase = createClient()
            // 1. Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // 2. Upload Profile / Basic Info
            console.log('Starting KYC Submission for:', user.id)
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: formData.fullName,
                })

            if (profileError) {
                console.error('Profile Upsert Error:', profileError)
                throw new Error(`Profile Error: ${profileError.message}`)
            }
            console.log('Profile updated.')

            // 3. Create KYC Record
            // First check if one exists to avoid duplicate key error if RLS allows reading but we blindly insert
            const { data: existingKyc } = await supabase.from('kyc_verifications').select('id').eq('user_id', user.id).single()

            let kycId = existingKyc?.id

            if (!kycId) {
                const { data: kycData, error: kycError } = await supabase
                    .from('kyc_verifications')
                    .insert({
                        user_id: user.id,
                        status: 'pending',
                        provider: 'internal',
                        ssn_or_itin: formData.ssn,
                        phone_number: formData.phoneNumber,
                    })
                    .select()
                    .single()

                if (kycError) {
                    console.error('KYC Insert Error:', kycError)
                    throw new Error(`KYC Insert Error: ${kycError.message}`)
                }
                kycId = kycData.id
            } else {
                console.log('Existing KYC record found:', kycId)
                // Optionally update it?
            }
            console.log('KYC Record ID:', kycId)

            // 4. Upload Documents & Records
            const uploadFile = async (file: File, path: string) => {
                // Changing default from 'kyc-documents' to 'escrow-storage' as per user input
                const bucketName = process.env.NEXT_PUBLIC_ESCROW_STORAGE_BUCKET || 'escrow-storage'
                console.log(`Uploading ${path} to ${bucketName}...`)
                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .upload(path, file, { upsert: true }) // upsert true to avoid conflict on retry

                if (error) {
                    console.error('Storage Upload Error:', error)
                    throw new Error(`Storage Error (${path}): ${error.message}`)
                }
                return data.path
            }

            const timestamp = Date.now()

            if (formData.frontImage) {
                await uploadFile(formData.frontImage, `${user.id}/${kycId}/front_${timestamp}`)
                const { error: docError } = await supabase.from('kyc_documents').insert({
                    kyc_id: kycId,
                    document_type: formData.documentType,
                    file_url: `${user.id}/${kycId}/front_${timestamp}`
                })
                if (docError) {
                    console.error('Doc Insert Error (Front):', docError)
                    throw new Error('Failed to save front ID record')
                }
            }

            if (formData.backImage) {
                await uploadFile(formData.backImage, `${user.id}/${kycId}/back_${timestamp}`)
                const { error: docError } = await supabase.from('kyc_documents').insert({
                    kyc_id: kycId,
                    document_type: formData.documentType,
                    file_url: `${user.id}/${kycId}/back_${timestamp}`
                })
                if (docError) {
                    console.error('Doc Insert Error (Back):', docError)
                    throw new Error('Failed to save back ID record')
                }
            }

            if (formData.selfieImage) {
                await uploadFile(formData.selfieImage, `${user.id}/${kycId}/selfie_${timestamp}`)
                const { error: docError } = await supabase.from('kyc_documents').insert({
                    kyc_id: kycId,
                    document_type: 'selfie',
                    file_url: `${user.id}/${kycId}/selfie_${timestamp}`
                })
                if (docError) {
                    console.error('Doc Insert Error (Selfie):', docError)
                    throw new Error('Failed to save selfie record')
                }
            }

            console.log('KYC Submission Complete')
            setComplete(true)
            setTimeout(() => {
                router.push('/dashboard')
            }, 3000)

        } catch (error: any) {
            console.error("KYC Submission Error Details:", error)
            // Be more verbose in the alert/UI
            const msg = error?.message || JSON.stringify(error) || 'Unknown error'
            setError(`Failed to submit: ${msg}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (complete) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h2>
                <p className="text-gray-600">Your documents are under review. We will notify you shortly.</p>
                <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>
            </div>
        )
    }

    if (isSubmitting) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                <p className="font-medium text-gray-900">Uploading your documents securely...</p>
                <p className="text-sm text-gray-500">Please do not close this window.</p>
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                    <div className="flex-1 text-sm">{error}</div>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">×</button>
                </div>
            )}
            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-100 -z-10"></div>

                {[1, 2, 3, 4].map((step) => (
                    <div
                        key={step}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}
                    >
                        {step}
                    </div>
                ))}
            </div>

            {currentStep === 1 && (
                <StepBasicInfo
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={nextStep}
                />
            )}

            {currentStep === 2 && (
                <StepDocSelection
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}

            {currentStep === 3 && (
                <StepDocUpload
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}

            {currentStep === 4 && (
                <StepSelfie
                    formData={formData}
                    updateFormData={updateFormData}
                    onSubmit={handleSubmit}
                    onBack={prevStep}
                />
            )}
        </div>
    )
}
