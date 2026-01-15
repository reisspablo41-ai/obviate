'use client'

import React from 'react'
import { useForm, UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'

// Shared types for KYC steps
export type KYCFormData = {
    fullName: string
    dateOfBirth: string
    country: string
    nationality: string
    phoneNumber: string
    ssn: string
    documentType: 'passport' | 'national_id' | 'drivers_license'
    frontImage: File | null
    backImage: File | null
    selfieImage: File | null
}

interface StepProps {
    formData: KYCFormData
    updateFormData: (data: Partial<KYCFormData>) => void
    onNext: () => void
}

export const BasicInfoSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    dateOfBirth: z.string().refine((date) => {
        return new Date(date).toString() !== 'Invalid Date' && new Date(date) < new Date()
    }, 'Please enter a valid date of birth in the past'),
    country: z.string().min(2, 'Country is required'),
    nationality: z.string().min(2, 'Nationality is required'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    ssn: z.string().min(4, 'SSN or ITIN is required'),
})

export default function StepBasicInfo({ formData, updateFormData, onNext }: StepProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth,
            country: formData.country,
            nationality: formData.nationality,
            phoneNumber: formData.phoneNumber,
            ssn: formData.ssn,
        },
    })

    const onSubmit = (data: Partial<KYCFormData>) => {
        const result = BasicInfoSchema.safeParse(data)
        if (!result.success) {
            // handle error
        }
        updateFormData(data)
        onNext()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                <p className="text-sm text-gray-600 mt-1 mb-4">
                    Please enter your details exactly as they appear on your ID.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Why do we need this?</h4>
                    <p className="text-sm text-blue-800">
                        To maintain a secure marketplace, we must verify that you are a real person. This helps prevent fraud and ensures safety for all users.
                        <br /><br />
                        <strong>Your data is fully protected.</strong> We use bank-grade encryption and only share details required by law.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Legal Full Name
                    </label>
                    <input
                        {...register('fullName', { required: 'Full name is required' })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="John Doe"
                    />
                    {errors.fullName && (
                        <p className="text-xs text-red-600 mt-1">{typeof errors.fullName.message === 'string' ? errors.fullName.message : "Required"}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        {...register('dateOfBirth', { required: 'Date of birth is required' })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.dateOfBirth && (
                        <p className="text-xs text-red-600 mt-1">{typeof errors.dateOfBirth.message === 'string' ? errors.dateOfBirth.message : "Required"}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country of Residence
                        </label>
                        <input
                            {...register('country', { required: 'Country is required' })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="United States"
                        />
                        {errors.country && (
                            <p className="text-xs text-red-600 mt-1">{typeof errors.country.message === 'string' ? errors.country.message : "Required"}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nationality
                        </label>
                        <input
                            {...register('nationality', { required: 'Nationality is required' })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="American"
                        />
                        {errors.nationality && (
                            <p className="text-xs text-red-600 mt-1">{typeof errors.nationality.message === 'string' ? errors.nationality.message : "Required"}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        {...register('phoneNumber', { required: 'Phone number is required' })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="+1 555-0123"
                    />
                    {errors.phoneNumber && (
                        <p className="text-xs text-red-600 mt-1">{typeof errors.phoneNumber.message === 'string' ? errors.phoneNumber.message : "Required"}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        SSN / ITIN
                    </label>
                    <input
                        {...register('ssn', { required: 'SSN/ITIN is required' })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="XXX-XX-XXXX"
                    />
                    {errors.ssn && (
                        <p className="text-xs text-red-600 mt-1">{typeof errors.ssn.message === 'string' ? errors.ssn.message : "Required"}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Required for identity verification and tax compliance. Stored securely.
                    </p>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
                Next Step
            </button>
        </form>
    )
}
