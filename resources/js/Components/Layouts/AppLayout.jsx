import React from 'react';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900 flex flex-col selection:bg-rose-100 selection:text-rose-900">
            {children}
        </div>
    );
}
