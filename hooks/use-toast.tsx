'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
}

interface ToastContextValue {
    toasts: Toast[];
    toast: (props: Omit<Toast, 'id'>) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((props: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { ...props, id }]);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Auto-dismiss toasts after 5 seconds
    useEffect(() => {
        if (toasts.length === 0) return;

        const timer = setTimeout(() => {
            setToasts((prev) => prev.slice(1));
        }, 5000);

        return () => clearTimeout(timer);
    }, [toasts]);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
            <ToastContainer toasts={toasts} dismiss={dismiss} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`p-4 rounded-lg shadow-lg border animate-in slide-in-from-right-5 fade-in duration-200 ${toast.variant === 'destructive'
                            ? 'bg-red-50 border-red-200 text-red-900'
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            {toast.title && (
                                <p className={`font-semibold text-sm ${toast.variant === 'destructive' ? 'text-red-900' : 'text-gray-900'}`}>
                                    {toast.title}
                                </p>
                            )}
                            {toast.description && (
                                <p className={`text-sm mt-1 ${toast.variant === 'destructive' ? 'text-red-700' : 'text-gray-600'}`}>
                                    {toast.description}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className={`text-sm font-medium hover:opacity-70 ${toast.variant === 'destructive' ? 'text-red-600' : 'text-gray-400'}`}
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        // Return a no-op toast function if used outside provider
        // This prevents crashes during SSR or if provider is missing
        return {
            toast: (props: Omit<Toast, 'id'>) => {
                console.warn('Toast called outside of ToastProvider:', props);
            },
            toasts: [] as Toast[],
            dismiss: () => { },
        };
    }

    return context;
}
