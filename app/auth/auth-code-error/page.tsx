export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md text-center">
                <h2 className="text-3xl font-bold tracking-tight text-red-600">Authentication Error</h2>
                <p className="mt-2 text-gray-600">
                    There was a problem authenticating your request. The link may have expired or is invalid.
                </p>
                <div className="mt-6">
                    <a href="/login" className="font-medium text-green-600 hover:text-green-500">
                        Return to Login
                    </a>
                </div>
            </div>
        </div>
    )
}
