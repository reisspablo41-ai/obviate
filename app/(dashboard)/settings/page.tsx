import { createClient } from '@/utils/supabase/server';
import { User, Shield, Lock, CreditCard } from 'lucide-react';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account preferences and security.</p>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <User className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input disabled type="email" value={user?.email || ''} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input type="tel" placeholder="+1..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm">Save Changes</button>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Two-Factor Authentication (2FA)</p>
                            <p className="text-sm text-gray-500">Secure your account with an extra layer of protection.</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">Enable 2FA</button>
                    </div>
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Password</p>
                            <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">Change Password</button>
                    </div>
                </div>
            </div>

            {/* Connected Accounts */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Connected Accounts</h2>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                                <span className="font-bold text-gray-600">G</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Google</p>
                                <p className="text-xs text-gray-500">Connected as {user?.email}</p>
                            </div>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Connected</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
