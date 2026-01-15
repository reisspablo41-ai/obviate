import Link from 'next/link';

export default function DisputesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dispute Management</h1>
                <p className="text-gray-600">Review and resolve transaction disputes.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">Dispute ID</th>
                                <th className="px-6 py-4">Deal</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Date Opened</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-500">#D-9942</td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <Link href="/admin/deals/9942" className="hover:underline">Web Development Project</Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Open
                                    </span>
                                </td>
                                <td className="px-6 py-4 truncate max-w-[200px]">Service not delivered as promised</td>
                                <td className="px-6 py-4">Jan 10, 2024</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-emerald-600 hover:text-emerald-700 font-medium border border-emerald-200 px-3 py-1 rounded hover:bg-emerald-50">
                                        Resolve
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-500">#D-8120</td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <Link href="/admin/deals/8120" className="hover:underline">Vintage Watch</Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                        Under Review
                                    </span>
                                </td>
                                <td className="px-6 py-4 truncate max-w-[200px]">Item arrived damaged</td>
                                <td className="px-6 py-4">Jan 09, 2024</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-emerald-600 hover:text-emerald-700 font-medium border border-emerald-200 px-3 py-1 rounded hover:bg-emerald-50">
                                        Resume
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors opacity-60">
                                <td className="px-6 py-4 font-mono text-gray-500">#D-7701</td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <Link href="/admin/deals/7701" className="hover:underline">Logo Design</Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Resolved
                                    </span>
                                </td>
                                <td className="px-6 py-4 truncate max-w-[200px]">Misunderstanding about deliverables</td>
                                <td className="px-6 py-4">Jan 05, 2024</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-600 font-medium">
                                        Details
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
