import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ToggleOption({ active, onClick, icon: Icon, label, hint }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                active
                    ? 'border-brand-primary bg-white shadow-sm ring-2 ring-brand-primary/15'
                    : 'border-brand-border bg-white hover:border-brand-primary/30 hover:bg-brand-bg/50'
            }`}
        >
            <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    active
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-brand-bg text-brand-muted border-brand-border'
                }`}
            >
                <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-brand-ink">{label}</p>
                {hint && <p className="text-xs text-brand-muted mt-0.5 leading-relaxed">{hint}</p>}
            </div>
            <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    active
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-brand-border bg-white'
                }`}
            >
                {active && <CheckCircle2 size={12} strokeWidth={3} />}
            </div>
        </button>
    );
}
