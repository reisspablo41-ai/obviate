'use client'

import React, { useRef, useState } from 'react'
import { Upload, X, Check } from 'lucide-react'
import { KYCFormData } from './StepBasicInfo'

interface StepProps {
    formData: KYCFormData
    updateFormData: (data: Partial<KYCFormData>) => void
    onNext: () => void
    onBack: () => void
}

export default function StepDocUpload({ formData, updateFormData, onNext, onBack }: StepProps) {
    const [frontFile, setFrontFile] = useState<File | null>(formData.frontImage)
    const [backFile, setBackFile] = useState<File | null>(formData.backImage)

    const frontInputRef = useRef<HTMLInputElement>(null)
    const backInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (side === 'front') {
                setFrontFile(file)
                updateFormData({ frontImage: file })
            } else {
                setBackFile(file)
                updateFormData({ backImage: file })
            }
        }
    }

    const handleNext = () => {
        if (frontFile) {
            // Back file is optional for Passport usually, but required for ID/Driver License often.
            // We'll enforce front file always.
            onNext()
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900">Upload ID</h3>
                <p className="text-sm text-gray-600 mt-1">
                    Please upload clear photos of your {formData.documentType?.replace('_', ' ')}.
                    Ensure no glare and all corners are visible.
                </p>
            </div>

            {/* Front Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Front Side (Required)</label>
                <div
                    onClick={() => frontInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${frontFile ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'}`}
                >
                    <input
                        ref={frontInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'front')}
                    />

                    {frontFile ? (
                        <div className="text-center">
                            <div className="mx-auto w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                                <Check className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium text-emerald-900 truncate max-w-[200px]">{frontFile.name}</p>
                            <p className="text-xs text-emerald-600">Click to change</p>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Tap to upload front side</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Back Upload (Conditional based on doc type normally, but let's show for non-passport) */}
            {formData.documentType !== 'passport' && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Back Side</label>
                    <div
                        onClick={() => backInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${backFile ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'}`}
                    >
                        <input
                            ref={backInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'back')}
                        />

                        {backFile ? (
                            <div className="text-center">
                                <div className="mx-auto w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                                    <Check className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-medium text-emerald-900 truncate max-w-[200px]">{backFile.name}</p>
                                <p className="text-xs text-emerald-600">Click to change</p>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Tap to upload back side</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 px-4 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={!frontFile}
                    className="flex-1 py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next Step
                </button>
            </div>
        </div>
    )
}
