import React from 'react';

export default function Card({ title, children, className = '', headerAction = null }) {
    return (
        <div className={`glass-card overflow-hidden ${className}`}>
            {(title || headerAction) && (
                <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-brand-bg/40">
                    {title && <h3 className="text-lg font-bold text-brand-ink">{title}</h3>}
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
