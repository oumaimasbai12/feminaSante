import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import Logo from '../Logo';
import EmergencyBanner from '../Common/EmergencyBanner';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const navItems = [
        { href: '/dashboard', label: 'Tableau de bord' },
        { href: '/diseases', label: 'Encyclopédie Médicale' },
        { href: '/cycle', label: 'Mon Cycle' },
        { href: '/pregnancy', label: 'Grossesse' },
    ];

    return (
        <div className="min-h-screen fs-app-bg flex flex-col">
            <EmergencyBanner />
            <nav className="glass-header sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/dashboard">
                                    <Logo size="sm" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-brand-muted hover:text-brand-ink hover:border-brand-primary/40 focus:outline-none"
                                        style={{
                                            transition:
                                                'color var(--fs-page-transition) var(--fs-page-easing), border-color var(--fs-page-transition) var(--fs-page-easing)',
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {user ? (
                                <Link href="/profile" className="btn-secondary text-sm py-2 px-3">
                                    {user.nom || user.name || 'Profil'}
                                </Link>
                            ) : (
                                <Link href="/login" className="text-sm font-semibold text-brand-primary hover:text-brand-dark">Se connecter</Link>
                            )}
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                type="button"
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-brand-muted hover:text-brand-ink hover:bg-brand-soft focus:outline-none"
                                style={{
                                    transition:
                                        'color var(--fs-page-transition) var(--fs-page-easing), background var(--fs-page-transition) var(--fs-page-easing)',
                                }}
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={`sm:hidden overflow-hidden sidebar-collapse ${
                        showingNavigationDropdown ? 'sidebar-collapse--open' : 'sidebar-collapse--closed'
                    }`}
                >
                    <div className="min-h-0">
                        <div className="glass-panel border-x-0 border-t-0 rounded-none pt-2 pb-3 space-y-1">
                            {navItems.map((item, i) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium ${i === 0 ? 'border-brand-primary text-brand-ink bg-brand-soft' : 'border-transparent text-brand-muted hover:bg-brand-soft/60'}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 page-blocks">
                    {header && <div className="pt-6 pb-2">{header}</div>}
                    {children}
                </div>
            </main>

            <footer className="glass-header mt-12 py-8 text-center text-brand-muted text-sm border-t">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="mb-2 flex items-center justify-center gap-2">
                        <AlertTriangle size={16} className="text-brand-primary flex-shrink-0" aria-hidden />
                        Femina Santé est un outil d'accompagnement éducatif. Il ne se substitue en aucun cas à un avis médical professionnel.
                    </p>
                    <p>&copy; {new Date().getFullYear()} Femina Santé. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}
