import React from 'react';
import { Link } from '@inertiajs/react';

const actionBase = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors';

const iconButtonClass = (danger) => (
    danger
        ? 'p-2 rounded-lg border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors'
        : 'p-2 rounded-lg border border-brand-border text-brand-muted hover:text-brand-primary hover:border-brand-primary/40 transition-colors'
);

export function TableActionGroup({ children, className = '' }) {
    return <div className={`flex items-center justify-end gap-2 ${className}`}>{children}</div>;
}

export function TableActionLink({ href, icon: Icon, children, className = '' }) {
    return (
        <Link
            href={href}
            className={`${actionBase} text-brand-muted border border-brand-border hover:border-brand-primary hover:text-brand-primary ${className}`}
        >
            {Icon && <Icon size={13} />}
            {children}
        </Link>
    );
}

export function TableActionButton({ onClick, icon: Icon, children, danger = false, type = 'button', className = '', disabled = false }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${
                danger
                    ? `${actionBase} text-red-600 border border-red-100 hover:bg-red-50`
                    : `${actionBase} text-brand-muted border border-brand-border hover:border-brand-primary hover:text-brand-primary`
            } disabled:opacity-50 disabled:pointer-events-none ${className}`}
        >
            {Icon && <Icon size={13} />}
            {children}
        </button>
    );
}

export function TableActionIconButton({ onClick, href, icon: Icon, danger = true, title }) {
    const className = iconButtonClass(danger);

    if (href) {
        return (
            <Link href={href} title={title} className={className}>
                <Icon size={16} />
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} title={title} className={className}>
            <Icon size={16} />
        </button>
    );
}

export function TableActionExternalLink({ href, icon: Icon, title, danger = false }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            title={title}
            className={iconButtonClass(danger)}
        >
            <Icon size={16} />
        </a>
    );
}
