'use client'

import { useActionState, useState } from 'react'
import { createDealAction, DealFormState } from '@/actions/create-deal'
import { Loader2, X, FileText } from 'lucide-react'
import Image from 'next/image'

const initialState: DealFormState = {
    error: '',
    fieldErrors: {},
}

export function CreateDealForm() {
    const [state, formAction, isPending] = useActionState(createDealAction, initialState)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            // Create preview if it's an image
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file)
                setPreviewUrl(url)
            } else {
                setPreviewUrl(null)
            }
        }
    }

    const removeFile = () => {
        setPreviewUrl(null)
        setFileName(null)
        // Reset file input value
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
    }

    return (
        <form action={formAction} className="space-y-6">
            {state?.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {state.error}
                </div>
            )}

            {/* Title & Description */}
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Deal Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        placeholder="e.g., Website Redesign"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {state?.fieldErrors?.title && (
                        <p className="text-red-500 text-xs mt-1">{state.fieldErrors.title}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Briefly describe the goods or services..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Role & Counterparty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        I am the...
                    </label>
                    <select
                        id="role"
                        name="role"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                        <option value="buyer">Buyer (paying)</option>
                        <option value="seller">Seller (receiving)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="counterparty_email" className="block text-sm font-medium text-gray-700 mb-1">
                        Counterparty Email
                    </label>
                    <input
                        type="email"
                        id="counterparty_email"
                        name="counterparty_email"
                        required
                        placeholder="their@email.com"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {state?.fieldErrors?.counterpartyEmail && (
                        <p className="text-red-500 text-xs mt-1">{state.fieldErrors.counterpartyEmail}</p>
                    )}
                </div>
            </div>

            {/* Amount & Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            required
                            step="0.01"
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                    {state?.fieldErrors?.amount && (
                        <p className="text-red-500 text-xs mt-1">{state.fieldErrors.amount}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                    </label>
                    <select
                        id="currency"
                        name="currency"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="USDC">USDC (Crypto)</option>
                    </select>
                </div>
            </div>

            {/* File Attachments */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachments (Optional)
                </label>

                {previewUrl ? (
                    <div className="relative mt-1 border-2 border-gray-200 rounded-lg overflow-hidden h-48 w-full bg-gray-50 flex items-center justify-center">
                        <div className="relative h-full w-full">
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={removeFile}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100 transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                ) : fileName ? (
                    <div className="relative mt-1 border-2 border-gray-200 rounded-lg p-6 bg-gray-50 flex items-center justify-center gap-3">
                        <FileText className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{fileName}</span>
                        <button
                            type="button"
                            onClick={removeFile}
                            className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                ) : (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*,application/pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-1 text-center pointer-events-none">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600 justify-center">
                                <span className="relative bg-white rounded-md font-medium text-emerald-600">
                                    Upload a file
                                </span>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, PDF up to 10MB
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
                <button type="button" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
                    Cancel
                </button>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isPending ? 'Propagating...' : 'Create Deal'}
                    </button>
                </div>
            </div>
        </form>
    )
}
