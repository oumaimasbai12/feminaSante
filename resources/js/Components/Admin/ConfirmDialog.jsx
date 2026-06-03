import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Confirmer',
    danger = false,
    loading = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return;

        const onKey = (e) => {
            if (e.key === 'Escape' && !loading) onCancel();
        };

        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, loading, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-brand-ink/50 backdrop-blur-[2px]"
                aria-label="Fermer"
                onClick={onCancel}
                disabled={loading}
            />
            <div
                className="relative z-10 max-w-md w-full rounded-2xl border border-brand-border bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                danger ? 'bg-red-100 text-red-600' : 'bg-brand-soft text-brand-primary'
                            }`}
                        >
                            <AlertTriangle size={20} />
                        </div>
                        <h3 id="confirm-dialog-title" className="text-lg font-bold text-brand-ink">
                            {title}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="text-brand-muted hover:text-brand-ink transition-colors shrink-0 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>
                <p className="text-sm text-brand-muted mb-6 leading-relaxed">{message}</p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 btn-secondary py-2.5 text-sm"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-colors ${
                            danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-primary hover:opacity-90'
                        }`}
                    >
                        {loading ? 'Traitement...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
