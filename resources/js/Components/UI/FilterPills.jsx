import React from 'react';

/**
 * Neutral tab / filter pills — active state uses bordered bg, not solid mauve fill.
 */
export default function FilterPills({ options, value, onChange, counts = {}, size = 'sm', className = '', disabled = false }) {
    const isSm = size === 'sm';
    const btnBase = isSm
        ? 'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5'
        : 'px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap inline-flex items-center gap-2';

    return (
        <div className={`flex flex-wrap gap-1 glass-card p-1.5 ${className}`.trim()}>
            {options.map((opt) => {
                const optValue = opt.value ?? opt;
                const optLabel = opt.label ?? opt;
                const isActive = value === optValue;
                const count = counts[optValue];
                const disabled = opt.disabled;

                return (
                    <button
                        key={String(optValue)}
                        type="button"
                        disabled={disabled || opt.disabled}
                        onClick={() => !disabled && onChange(optValue)}
                        aria-pressed={isActive}
                        className={`${btnBase} transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                            isActive
                                ? 'bg-brand-bg text-brand-ink border-2 border-brand-primary/35 shadow-sm'
                                : 'text-brand-muted hover:text-brand-ink hover:bg-brand-bg/60 border-2 border-transparent'
                        }`}
                    >
                        {optLabel}
                        {count != null && (
                            <span
                                className={`text-xs tabular-nums px-1.5 py-0.5 rounded-md ${
                                    isActive
                                        ? 'bg-brand-primary/10 text-brand-primary font-bold'
                                        : 'bg-brand-bg text-brand-muted'
                                }`}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
