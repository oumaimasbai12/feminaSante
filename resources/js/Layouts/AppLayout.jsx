import React, { useState, useEffect } from 'react';
import AppShell from '../Components/Layouts/AppShell';
import { getStoredUser, refreshUser, requireAuth } from '../utils/auth';
import { patientNav, patientNavSections } from '../config/navigation';

export default function AppLayout({ children, title }) {
    const [user, setUser] = useState(() => getStoredUser());

    useEffect(() => {
        if (!requireAuth()) return;
        refreshUser().then(u => { if (u) setUser(u); });
    }, []);

    return (
        <AppShell
            title={title}
            roleLabel="Espace patiente"
            navItems={patientNav(user)}
            navSections={patientNavSections(user)}
            showNotifications
            showProfileLink={!user?.is_admin}
            maxWidth="max-w-7xl"
        >
            {children}
        </AppShell>
    );
}
