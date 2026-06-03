import React from 'react';
import { Link } from '@inertiajs/react';
import GlassCard from './GlassCard';

export default function StatTile({ label, value, sub, icon: Icon, href, onClick }) {
    const inner = (
        <GlassCard hover={!!href || !!onClick} className="h-full">
            {Icon && (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-brand-bg text-brand-primary border border-brand-border">
                    <Icon size={18} />
                </div>
            )}
            <p className="text-2xl font-bold text-brand-ink tabular-nums">{value ?? '—'}</p>
            {sub && <p className="text-xs text-brand-muted mt-0.5">{sub}</p>}
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mt-2">{label}</p>
        </GlassCard>
    );

    if (href) {
        return (
            <Link href={href} className="block transition-opacity duration-200 hover:opacity-90">
                {inner}
            </Link>
        );
    }
    if (onClick) {
        return <button type="button" onClick={onClick} className="block w-full text-left">{inner}</button>;
    }
    return inner;
}
