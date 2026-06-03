import React from 'react';
import { Link } from '@inertiajs/react';
import { Plus, MessageCircle, Search, BookOpen } from 'lucide-react';

const actions = [
    { title: 'Saisir symptômes', icon: Plus, href: '/cycle' },
    { title: 'Chat assistant', icon: MessageCircle, href: '/chat' },
    { title: 'Chercher médecin', icon: Search, href: '/appointments' },
    { title: 'Bibliothèque', icon: BookOpen, href: '/diseases' },
];

export default function QuickActions() {
    return (
        <div className="glass-card">
            <h3 className="text-lg font-bold text-brand-ink mb-6 border-b border-brand-border pb-2">Actions rapides</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl transition-colors hover:bg-brand-soft bg-brand-primary text-white"
                        >
                            <Icon size={32} className="mb-2" aria-hidden />
                            <span className="font-semibold text-sm text-center">{action.title}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
