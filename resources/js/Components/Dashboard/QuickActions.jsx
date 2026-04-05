import React from 'react';
import { Link } from '@inertiajs/react';

export default function QuickActions() {
    const actions = [
        { title: 'Saisir Symptômes', icon: 'plus', href: '/cycle', bg: 'bg-rose-600', text: 'text-white' },
        { title: 'Chat Assistant', icon: 'chat', href: '/chat', bg: 'bg-indigo-600', text: 'text-white' },
        { title: 'Chercher Médecin', icon: 'search', href: '/appointments', bg: 'bg-amber-500', text: 'text-white' },
        { title: 'Bibliothèque', icon: 'book', href: '/diseases', bg: 'bg-teal-600', text: 'text-white' },
    ];

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-2">Actions Rapides</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action, i) => (
                    <Link key={i} href={action.href} className={`flex flex-col items-center justify-center p-4 rounded-2xl transition hover:opacity-90 hover:scale-105 shadow-sm ${action.bg} ${action.text}`}>
                        <div className="mb-2">
                            {/* Generic icons mockup */}
                            {action.icon === 'plus' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>}
                            {action.icon === 'chat' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>}
                            {action.icon === 'search' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>}
                            {action.icon === 'book' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
                        </div>
                        <span className="font-semibold text-sm text-center">{action.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
