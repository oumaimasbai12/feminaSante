import React from 'react';
import { Link } from '@inertiajs/react';
import Logo from '../Logo';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 fs-app-bg">
            <Link href="/" className="mb-6">
                <Logo size="lg" />
            </Link>

            <div className="w-full sm:max-w-md mt-2 px-6 py-8 glass-card overflow-hidden sm:rounded-2xl">
                {children}
            </div>
        </div>
    );
}
