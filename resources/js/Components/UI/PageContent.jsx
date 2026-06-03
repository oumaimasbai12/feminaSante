import React from 'react';
import { usePage } from '@inertiajs/react';

/**
 * Wraps page body content so blocks animate in with a stagger on each navigation.
 * Used by AppShell — pages do not need to import this directly.
 */
export default function PageContent({ children, className = '' }) {
    const { url } = usePage();

    return (
        <div key={url} className={`page-blocks ${className}`.trim()}>
            {children}
        </div>
    );
}
