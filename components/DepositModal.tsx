'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Building, Bitcoin, Clock, Copy, Check, AlertCircle, QrCode, Upload, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { submitBankDeposit } from '@/actions/submit-deposit';
import { createClient } from '@/utils/supabase/client';
interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    currency: string;
    dealId: string;
    onDepositComplete?: () => void;
}

type DepositMethod = 'bank' | 'crypto';

// Platform bank account details (placeholder)
const PLATFORM_BANK_DETAILS = {
    bankName: 'Chase Bank',
    accountName: 'Obviate Escrow Holdings LLC',
    accountNumber: '9876543210',
    routingNumber: '021000021',
    swiftCode: 'CHASUS33',
    reference: 'ESCROW-', // Will append deal ID
};

// Platform crypto wallet (placeholder - in production this would be generated per transaction via Coinbase Commerce)
const PLATFORM_CRYPTO_DETAILS = {
    network: 'Ethereum (ERC-20)',
    coin: 'USDC',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1A0b3',
};

const DEPOSIT_TIMEOUT_MINUTES = 10;

export default function DepositModal({ isOpen, onClose, amount, currency, dealId, onDepositComplete }: DepositModalProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<DepositMethod>('bank');
    const [timerStarted, setTimerStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(DEPOSIT_TIMEOUT_MINUTES * 60); // in seconds
    const [copied, setCopied] = useState<string | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Calculate fee and total
    const fee = amount * 0.05;
    const totalAmount = amount + fee;

    // Format time as MM:SS
    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Timer effect
    useEffect(() => {
        if (!timerStarted || isExpired) return;

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setIsExpired(true);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timerStarted, isExpired]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimerStarted(false);
            setTimeRemaining(DEPOSIT_TIMEOUT_MINUTES * 60);
            setIsExpired(false);
            setCopied(null);
            setReceiptFile(null);
            setReceiptPreview(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleCopy = async (text: string, field: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleStartDeposit = () => {
        setTimerStarted(true);
    };

    const handleRestartTimer = () => {
        setIsExpired(false);
        setTimeRemaining(DEPOSIT_TIMEOUT_MINUTES * 60);
        setTimerStarted(true);
        setReceiptFile(null);
        setReceiptPreview(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file (JPG, PNG, etc.)');
                return;
            }
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            setReceiptFile(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setReceiptPreview(previewUrl);
        }
    };

    const handleRemoveReceipt = () => {
        setReceiptFile(null);
        if (receiptPreview) {
            URL.revokeObjectURL(receiptPreview);
            setReceiptPreview(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCompleteDeposit = async () => {
        if (!receiptFile) return;

        setIsSubmitting(true);
        try {
            // 1. Upload file on client side using Supabase client
            const supabase = createClient();
            const bucketName = process.env.NEXT_PUBLIC_ESCROW_STORAGE_BUCKET || 'escrow-storage';
            const filePath = `receipts/${dealId}/${Date.now()}_${receiptFile.name}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, receiptFile);

            if (uploadError) {
                console.error('Receipt upload error:', uploadError);
                alert('Failed to upload receipt: ' + uploadError.message);
                return;
            }

            // 2. Call the server action to submit the deposit with the file path
            const result = await submitBankDeposit(dealId, totalAmount, currency, filePath);

            if (result.error) {
                alert(result.error);
                return;
            }

            // Success - close modal and refresh page
            alert('Deposit confirmation submitted! Our team will verify your payment within 24 hours.');
            onClose();
            onDepositComplete?.();
            router.refresh();
        } catch (error) {
            console.error('Failed to submit deposit:', error);
            alert('Failed to submit deposit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate timer progress percentage
    const timerProgress = (timeRemaining / (DEPOSIT_TIMEOUT_MINUTES * 60)) * 100;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Deposit Funds</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(totalAmount)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Timer Display (when active) */}
                {timerStarted && !isExpired && (
                    <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12">
                                    {/* Circular progress */}
                                    <svg className="w-12 h-12 transform -rotate-90">
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            fill="none"
                                            stroke="#fde68a"
                                            strokeWidth="4"
                                        />
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            fill="none"
                                            stroke="#f59e0b"
                                            strokeWidth="4"
                                            strokeDasharray={`${timerProgress * 1.256} 125.6`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <Clock className="w-5 h-5 text-amber-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Time remaining to deposit</p>
                                    <p className="text-2xl font-bold text-amber-900 font-mono">{formatTime(timeRemaining)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Expired State */}
                {isExpired && (
                    <div className="px-6 py-4 bg-red-50 border-b border-red-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-full">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-800">Payment window expired</p>
                                <p className="text-xs text-red-600">The deposit window has closed.</p>
                            </div>
                            <button
                                onClick={handleRestartTimer}
                                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Restart
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex p-1.5 mx-6 mt-4 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => setActiveTab('bank')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'bank'
                            ? 'bg-white shadow-sm text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Building className="w-4 h-4" />
                        Bank Transfer
                    </button>
                    <button
                        onClick={() => setActiveTab('crypto')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'crypto'
                            ? 'bg-white shadow-sm text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Bitcoin className="w-4 h-4" />
                        Crypto (USDC)
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'bank' ? (
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Bank Name</span>
                                    <span className="text-sm font-medium text-gray-900">{PLATFORM_BANK_DETAILS.bankName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Account Name</span>
                                    <span className="text-sm font-medium text-gray-900">{PLATFORM_BANK_DETAILS.accountName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Account Number</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900 font-mono">{PLATFORM_BANK_DETAILS.accountNumber}</span>
                                        <button
                                            onClick={() => handleCopy(PLATFORM_BANK_DETAILS.accountNumber, 'account')}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                            {copied === 'account' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Routing Number</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900 font-mono">{PLATFORM_BANK_DETAILS.routingNumber}</span>
                                        <button
                                            onClick={() => handleCopy(PLATFORM_BANK_DETAILS.routingNumber, 'routing')}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                            {copied === 'routing' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">SWIFT Code</span>
                                    <span className="text-sm font-medium text-gray-900 font-mono">{PLATFORM_BANK_DETAILS.swiftCode}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Reference</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-emerald-600 font-mono">{PLATFORM_BANK_DETAILS.reference}{dealId.slice(0, 8).toUpperCase()}</span>
                                            <button
                                                onClick={() => handleCopy(`${PLATFORM_BANK_DETAILS.reference}${dealId.slice(0, 8).toUpperCase()}`, 'reference')}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                            >
                                                {copied === 'reference' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Receipt Upload Section - Only shown when timer is active */}
                            {timerStarted && !isExpired && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Upload className="w-4 h-4 text-gray-600" />
                                        <h4 className="text-sm font-medium text-gray-900">Upload Payment Receipt</h4>
                                    </div>

                                    {/* Hidden file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    {!receiptPreview ? (
                                        /* Upload Zone */
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                                                    <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-emerald-600" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-700">Click to upload receipt</p>
                                                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                            </div>
                                        </button>
                                    ) : (
                                        /* Receipt Preview */
                                        <div className="relative rounded-xl overflow-hidden border border-gray-200">
                                            <img
                                                src={receiptPreview}
                                                alt="Payment receipt"
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-white">
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-sm font-medium">{receiptFile?.name}</span>
                                                </div>
                                                <button
                                                    onClick={handleRemoveReceipt}
                                                    className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                <p className="text-xs text-blue-700">
                                    <strong>Important:</strong> Include the reference number in your transfer. Upload your payment confirmation receipt to complete the deposit.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* QR Code Placeholder */}
                            <div className="flex justify-center">
                                <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <div className="text-center">
                                        <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-xs text-gray-500">QR Code</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Network</span>
                                    <span className="text-sm font-medium text-gray-900">{PLATFORM_CRYPTO_DETAILS.network}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Coin</span>
                                    <span className="text-sm font-medium text-gray-900">{PLATFORM_CRYPTO_DETAILS.coin}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm text-gray-500">Wallet Address</span>
                                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                                            <span className="text-xs font-medium text-gray-900 font-mono break-all flex-1">
                                                {PLATFORM_CRYPTO_DETAILS.address}
                                            </span>
                                            <button
                                                onClick={() => handleCopy(PLATFORM_CRYPTO_DETAILS.address, 'wallet')}
                                                className="p-1.5 hover:bg-gray-100 rounded transition-colors shrink-0"
                                            >
                                                {copied === 'wallet' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                                <p className="text-xs text-purple-700">
                                    <strong>Coinbase Commerce:</strong> Send exactly <strong>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(totalAmount)} USDC</strong> to this address. Transactions are typically confirmed within 5 minutes.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    {!timerStarted ? (
                        <button
                            onClick={handleStartDeposit}
                            className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                        >
                            Start Deposit ({formatTime(DEPOSIT_TIMEOUT_MINUTES * 60)} window)
                        </button>
                    ) : timerStarted && !isExpired && receiptFile && activeTab === 'bank' ? (
                        <button
                            onClick={handleCompleteDeposit}
                            disabled={isSubmitting}
                            className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Complete Deposit
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
