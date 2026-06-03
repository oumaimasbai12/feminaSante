import React from 'react';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen fs-app-bg font-sans antialiased text-brand-ink flex flex-col selection:bg-brand-soft selection:text-brand-ink">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </div>
    );
}
