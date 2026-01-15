import { Download, Filter, Search } from 'lucide-react';

export default function TransactionsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
                    <p className="text-gray-600">A complete record of all your incoming and outgoing funds.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, deal name..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                        <option>All Types</option>
                        <option>Deposit</option>
                        <option>Withdrawal</option>
                        <option>Deal Payment</option>
                        <option>Refund</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>This Year</option>
                        <option>All Time</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-900 font-medium">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {/* Mock Row 1 */}
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">Jan 10, 2024</td>
                            <td className="px-6 py-4 font-mono text-xs">TX-99382</td>
                            <td className="px-6 py-4">Deposit for "Web Design Project"</td>
                            <td className="px-6 py-4">Deposit</td>
                            <td className="px-6 py-4 text-right font-medium text-red-600">-$1,500.00</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Completed
                                </span>
                            </td>
                        </tr>
                        {/* Mock Row 2 */}
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">Jan 05, 2024</td>
                            <td className="px-6 py-4 font-mono text-xs">TX-82733</td>
                            <td className="px-6 py-4">Payout from "Consulting"</td>
                            <td className="px-6 py-4">Payment</td>
                            <td className="px-6 py-4 text-right font-medium text-emerald-600">+$250.00</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Completed
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
