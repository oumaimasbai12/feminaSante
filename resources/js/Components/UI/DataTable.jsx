import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function DataTable({ children, className = '' }) {
    return <div className={`table-shell ${className}`}>{children}</div>;
}

export function DataTableToolbar({ children, className = '' }) {
    return <div className={`table-toolbar ${className}`}>{children}</div>;
}

export function DataTableFoot({ children, className = '' }) {
    return <div className={`table-foot ${className}`}>{children}</div>;
}

export function DataTableScroll({ children }) {
    return <div className="overflow-x-auto">{children}</div>;
}

export function DataTableEmpty({ children }) {
    return <div className="table-empty">{children}</div>;
}

export function DataTableLoading({ children = 'Chargement...' }) {
    return <div className="table-empty">{children}</div>;
}

export function DataTablePagination({ page, lastPage, onPrev, onNext }) {
    if (lastPage <= 1) return null;

    return (
        <DataTableFoot className="flex items-center justify-between">
            <button
                type="button"
                disabled={page <= 1}
                onClick={onPrev}
                className="flex items-center gap-1 text-sm font-semibold text-brand-muted disabled:opacity-40 hover:text-brand-primary transition-colors"
            >
                <ChevronLeft size={16} /> Précédent
            </button>
            <span className="text-sm text-brand-muted">Page {page} / {lastPage}</span>
            <button
                type="button"
                disabled={page >= lastPage}
                onClick={onNext}
                className="flex items-center gap-1 text-sm font-semibold text-brand-muted disabled:opacity-40 hover:text-brand-primary transition-colors"
            >
                Suivant <ChevronRight size={16} />
            </button>
        </DataTableFoot>
    );
}
