import KYCWizard from '@/components/kyc/KYCWizard'

export default function KYCPage() {
    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900">Verify Your Identity</h1>
                <p className="mt-2 text-gray-600">To create deals and handle funds, we need to verify who you are.</p>
            </div>

            <KYCWizard />
        </div>
    )
}
