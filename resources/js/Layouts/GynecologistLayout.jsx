import React, { useEffect } from 'react';
import AppShell from '@/Components/Layouts/AppShell';
import { requireGynecologist } from '@/utils/auth';
import { gynecologistNav } from '@/config/navigation';

export default function GynecologistLayout({ children, title }) {
    useEffect(() => {
        requireGynecologist();
    }, []);

    return (
        <AppShell
            title={title}
            roleLabel="Espace praticien"
            navItems={gynecologistNav}
            showProfileLink={false}
            maxWidth="max-w-7xl"
        >
            {children}
        </AppShell>
    );
}
