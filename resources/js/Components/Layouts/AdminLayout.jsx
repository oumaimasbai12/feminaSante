import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Heart, Stethoscope } from 'lucide-react';
import AppShell from './AppShell';
import { getStoredUser, requireAdmin } from '@/utils/auth';
import { adminNav } from '@/config/navigation';

export default function AdminLayout({ title, header, children }) {
    const [user, setUser] = useState(getStoredUser());

    useEffect(() => {
        requireAdmin().then(u => { if (u) setUser(u); });
    }, []);

    const sections = [];
    if (user?.is_gynecologist) {
        sections.push({
            title: 'Autres espaces',
            items: [{ label: 'Espace praticien', href: '/gynecologist/dashboard', icon: Stethoscope }],
        });
    }
    if (!user?.is_admin) {
        sections.push({
            title: 'Autres espaces',
            items: [{ label: 'Espace patiente', href: '/dashboard', icon: Heart }],
        });
    }

    return (
        <AppShell
            title={title}
            roleLabel="Administration"
            navItems={adminNav}
            navSections={sections}
            showProfileLink={false}
            maxWidth="max-w-7xl"
        >
            {header && <div className="mb-6">{header}</div>}
            {children}
        </AppShell>
    );
}
