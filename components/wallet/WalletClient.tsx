'use client';

import { useState } from 'react';
import { Wallet, CreditCard, Building, Plus, X, Trash2, Smartphone } from 'lucide-react';
import { addPaymentMethod, deletePaymentMethod } from '@/actions/wallet';
import { useToast } from '@/hooks/use-toast';

// Hardcoded top 20 wallets as per requirement
const WALLET_PROVIDERS = [
    'MetaMask', 'Coinbase Wallet', 'Trust Wallet', 'Phantom', 'Exodus',
    'Ledger Live', 'Brave Wallet', 'Trezor Suite', 'Robinhood Wallet', 'Binance Web3 Wallet',
    'Zerion', '1inch', 'Rainbow', 'Argent', 'Crypto.com DeFi Wallet',
    'BitKeep (Bitget)', 'OKX Wallet', 'Solflare', 'Glow', 'Backpack'
];

type PaymentMethodType = 'bank' | 'crypto';

export default function WalletClient({
    balance,
    paymentMethods,
    transactions
}: {
    balance: { locked: number; available: number; total: number };
    paymentMethods: any[];
    transactions: any[]; // Using deal activity or escrow funds as transactions
}) {
    const { toast } = useToast();
    const [isAdding, setIsAdding] = useState(false);
    const [methodType, setMethodType] = useState<PaymentMethodType>('bank');
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        bankName: '',
        accountHolder: '',
        routingNumber: '',
        accountNumber: '',
        walletProvider: WALLET_PROVIDERS[0],
        chain: 'Ethereum',
        walletAddress: '',
        nickname: ''
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            type: methodType,
            label: formData.nickname || (methodType === 'bank' ? formData.bankName : formData.walletProvider),
            // Bank
            bankName: formData.bankName,
            accountHolder: formData.accountHolder,
            accountNumber: formData.accountNumber,
            routingNumber: formData.routingNumber,
            // Crypto
            walletProvider: formData.walletProvider,
            chain: formData.chain,
            walletAddress: formData.walletAddress,
            isDefault: false
        };

        const res = await addPaymentMethod(payload);

        setLoading(false);
        if (res.error) {
            toast({
                title: "Error",
                description: res.error,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Success",
                description: "Payment method added successfully.",
            });
            setIsAdding(false);
            // Reset form
            setFormData({
                bankName: '',
                accountHolder: '',
                routingNumber: '',
                accountNumber: '',
                walletProvider: WALLET_PROVIDERS[0],
                chain: 'Ethereum',
                walletAddress: '',
                nickname: ''
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this payment method?')) return;

        const res = await deletePaymentMethod(id);
        if (res.error) {
            toast({
                title: "Error",
                description: res.error,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Removed",
                description: "Payment method removed.",
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 relative">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Wallet & Payouts</h1>
                <p className="text-gray-600">Manage your payment methods and withdrawals.</p>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium opacity-80">Total Escrow Balance</h3>
                        <Wallet className="w-5 h-5 opacity-80" />
                    </div>
                    <div className="text-3xl font-bold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(balance.total)}
                    </div>
                    <div className="mt-4 flex gap-2 text-sm opacity-80">
                        <span className="bg-white/20 px-2 py-1 rounded">
                            Locked: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(balance.locked)}
                        </span>
                        <span className="bg-emerald-500/20 px-2 py-1 rounded text-emerald-300">
                            Available: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(balance.available)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payout Methods */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100 min-h-[100px]">
                        {paymentMethods.length === 0 && (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                No payment methods saved.
                            </div>
                        )}
                        {paymentMethods.map((method) => (
                            <div key={method.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${method.method_type === 'bank' ? 'bg-gray-100 text-gray-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        {method.method_type === 'bank' ? <Building className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{method.label}</p>
                                        <p className="text-xs text-gray-500">
                                            {method.method_type === 'bank'
                                                ? `•••• ${method.account_number?.slice(-4) || '****'}`
                                                : `${method.wallet_address?.slice(0, 6)}...${method.wallet_address?.slice(-4)}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {method.is_default && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Default</span>
                                    )}
                                    <button onClick={() => handleDelete(method.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transaction History */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Active Deal Funds</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {transactions.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    No active fund movements.
                                </div>
                            ) : (
                                transactions.map((tx: any) => (
                                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <Wallet className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{tx.title}</p>
                                                <p className="text-xs text-gray-500 capitalize">{tx.status.replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: tx.currency }).format(tx.amount)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Method Modal (Simple Overlay) */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Add Payment Method</h3>
                            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Type Toggle */}
                        <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
                            <button
                                onClick={() => setMethodType('bank')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${methodType === 'bank' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Bank Account
                            </button>
                            <button
                                onClick={() => setMethodType('crypto')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${methodType === 'crypto' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Crypto Wallet
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            {methodType === 'bank' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                        <input
                                            required
                                            value={formData.bankName}
                                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                            type="text"
                                            placeholder="e.g. Chase Bank"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                                        <input
                                            required
                                            value={formData.accountHolder}
                                            onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
                                            <input
                                                required
                                                value={formData.routingNumber}
                                                onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                            <input
                                                required
                                                value={formData.accountNumber}
                                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Provider</label>
                                        <select
                                            value={formData.walletProvider}
                                            onChange={(e) => setFormData({ ...formData, walletProvider: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            {WALLET_PROVIDERS.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Chain / Network</label>
                                        <select
                                            value={formData.chain}
                                            onChange={(e) => setFormData({ ...formData, chain: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="Ethereum">Ethereum (ERC20)</option>
                                            <option value="Solana">Solana (SOL)</option>
                                            <option value="Bitcoin">Bitcoin (BTC)</option>
                                            <option value="Polygon">Polygon (MATIC)</option>
                                            <option value="Arbitrum">Arbitrum</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Ensure the network matches your wallet address.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
                                        <input
                                            required
                                            value={formData.walletAddress}
                                            onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                                            type="text"
                                            placeholder="0x..."
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nickname (Optional)</label>
                                <input
                                    value={formData.nickname}
                                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                    type="text"
                                    placeholder={methodType === 'bank' ? 'My Checking' : 'Trading Wallet'}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors mt-4 disabled:opacity-50">
                                {loading ? 'Saving...' : 'Save Payment Method'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
