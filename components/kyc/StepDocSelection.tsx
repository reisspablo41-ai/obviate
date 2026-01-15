'use client'

import React from 'react'
import { CreditCard, FileText, UserSquare2 } from 'lucide-react'
import { KYCFormData } from './StepBasicInfo'

interface StepProps {
    formData: KYCFormData
    updateFormData: (data: Partial<KYCFormData>) => void
    onNext: () => void
    onBack: () => void
}

export default function StepDocSelection({ formData, updateFormData, onNext, onBack }: StepProps) {

    const handleSelect = (type: KYCFormData['documentType']) => {
        updateFormData({ documentType: type })
        onNext()
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900">Document Selection</h3>
                <p className="text-sm text-gray-600 mt-1">
                    Select a valid government-issued document to verify your identity.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <button
                    onClick={() => handleSelect('passport')}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                >
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-700">
                        <UserSquare2 className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-medium text-gray-900">Passport</h4>
                        <p className="text-xs text-gray-500">Travel document for all countries</p>
                    </div>
                </button>

                <button
                    onClick={() => handleSelect('national_id')}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                >
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-700">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-medium text-gray-900">National ID Card</h4>
                        <p className="text-xs text-gray-500">Government issued identity card</p>
                    </div>
                </button>

                <button
                    onClick={() => handleSelect('drivers_license')}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                >
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-700">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-medium text-gray-900">Driver's License</h4>
                        <p className="text-xs text-gray-500">Valid license from your country</p>
                    </div>
                </button>
            </div>

            <button
                onClick={onBack}
                className="w-full py-3 px-4 text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
                Back
            </button>
        </div>
    )
}
