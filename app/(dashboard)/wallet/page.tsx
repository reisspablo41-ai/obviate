'use client';
import { useState } from 'react';
import { Wallet, CreditCard, Building, Plus, X, Trash2, Check, Smartphone } from 'lucide-react';

// Hardcoded top 20 wallets as per requirement
const WALLET_PROVIDERS = [
    'MetaMask', 'Coinbase Wallet', 'Trust Wallet', 'Phantom', 'Exodus',
    'Ledger Live', 'Brave Wallet', 'Trezor Suite', 'Robinhood Wallet', 'Binance Web3 Wallet',
    'Zerion', '1inch', 'Rainbow', 'Argent', 'Crypto.com DeFi Wallet',
    'BitKeep (Bitget)', 'OKX Wallet', 'Solflare', 'Glow', 'Backpack'
];

type PaymentMethodType = 'bank' | 'crypto';

interface SavedMethod {
    id: string;
    type: PaymentMethodType;
    label: string;
    detail: string; // e.g., "•••• 4242" or "0x...1234"
    provider?: string;
    isDefault?: boolean;
}

export default function WalletPage() {
    const [isAdding, setIsAdding] = useState(false);
    const [methodType, setMethodType] = useState<PaymentMethodType>('bank');

    // Mock Data State
    const [savedMethods, setSavedMethods] = useState<SavedMethod[]>([
        { id: '1', type: 'bank', label: 'Chase Bank', detail: 'Checking •••• 4242', isDefault: true },
        { id: '2', type: 'crypto', label: 'USDC Cloud Wallet', detail: 'Ethereum •••• 8x92', provider: 'MetaMask' }
    ]);

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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock Save Logic
        const newMethod: SavedMethod = {
            id: Date.now().toString(),
            type: methodType,
            label: formData.nickname || (methodType === 'bank' ? formData.bankName : formData.walletProvider),
            detail: methodType === 'bank' ? `•••• ${formData.accountNumber.slice(-4)}` : `${formData.walletAddress.slice(0, 6)}...${formData.walletAddress.slice(-4)}`,
            provider: methodType === 'crypto' ? formData.walletProvider : undefined
        };

        setSavedMethods([...savedMethods, newMethod]);
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
    };

    const deleteMethod = (id: string) => {
        setSavedMethods(savedMethods.filter(m => m.id !== id));
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
                    <div className="text-3xl font-bold">$1,950.00</div>
                    <div className="mt-4 flex gap-2 text-sm opacity-80">
                        <span className="bg-white/20 px-2 py-1 rounded">Locked: $1,500.00</span>
                        <span className="bg-emerald-500/20 px-2 py-1 rounded text-emerald-300">Available: $450.00</span>
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

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                        {savedMethods.map((method) => (
                            <div key={method.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${method.type === 'bank' ? 'bg-gray-100 text-gray-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        {method.type === 'bank' ? <Building className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{method.label}</p>
                                        <p className="text-xs text-gray-500">{method.detail}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {method.isDefault && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Default</span>
                                    )}
                                    <button onClick={() => deleteMethod(method.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transaction History */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                        <CreditCard className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Deposit for Deal #123</p>
                                        <p className="text-xs text-gray-500">Jan 10, 2024</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-900">-$1,500.00</span>
                            </div>

                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                        <Wallet className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Payout from Deal #789</p>
                                        <p className="text-xs text-gray-500">Jan 05, 2024</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-green-600">+$200.00</span>
                            </div>
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

                            <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors mt-4">
                                Save Payment Method
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
