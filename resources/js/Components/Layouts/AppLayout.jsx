import React from 'react';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-gray-900 flex flex-col selection:bg-rose-100 selection:text-rose-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </div>
    );
}
