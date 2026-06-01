import React from 'react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-slate-50">
            <div>
                <Link href="/">
                    <h1 className="text-4xl font-extrabold text-rose-600 tracking-wider">FEMINA SANTÉ</h1>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white shadow-sm overflow-hidden sm:rounded-2xl border border-slate-200">
                {children}
            </div>
        </div>
    );
}
