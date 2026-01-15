import { Bell, Check, AlertTriangle, Info } from 'lucide-react';

export default function NotificationsPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600">Stay updated on your deals and account activity.</p>
                </div>
                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Mark all as read</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {/* Notification Item */}
                <div className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                    <div className="mt-1">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <Info className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">Deal Status Updated</p>
                            <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">The status of <strong>Web Design Project</strong> has changed to <span className="text-blue-600 font-medium">In Progress</span>.</p>
                    </div>
                    <div className="mt-2 text-blue-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                </div>

                {/* Notification Item */}
                <div className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                    <div className="mt-1">
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">Action Required: Verify Identity</p>
                            <span className="text-xs text-gray-500">1 day ago</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Please complete your KYC verification to unlock full platform features.</p>
                        <button className="mt-2 text-sm text-emerald-600 font-medium hover:underline">Verify now</button>
                    </div>
                </div>

                {/* Notification Item */}
                <div className="p-4 flex gap-4 hover:bg-gray-50 transition-colors opacity-60">
                    <div className="mt-1">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">Funds Released</p>
                            <span className="text-xs text-gray-500">3 days ago</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Funds for <strong>Vintage Watch</strong> have been successfully released to your wallet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
