import React from 'react';
import { Link } from '@inertiajs/react';
import Logo from '../Components/Logo';
import { Heart, Brain, Stethoscope, Shield } from 'lucide-react';

const highlights = [
    { icon: Heart, label: 'Suivi du cycle', desc: 'Prédictions intelligentes' },
    { icon: Brain, label: 'IA & insights', desc: 'Recommandations personnalisées' },
    { icon: Stethoscope, label: 'Soins experts', desc: 'Réseau de praticiens certifiés' },
];

export function AuthFormAlert({ type = 'error', children }) {
    if (!children) return null;

    const isError = type === 'error';

    return (
        <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium border flex items-start gap-2 ${
                isError
                    ? 'bg-red-50/80 border-red-200 text-red-800'
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
            }`}
        >
            {children}
        </div>
    );
}

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen flex bg-brand-bg">
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden flex-col items-center justify-center border-r border-brand-border p-10">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div
                        className="absolute top-24 -left-24 w-80 h-80 rounded-full opacity-[0.07]"
                        style={{ background: '#853953' }}
                    />
                    <div
                        className="absolute bottom-16 right-0 w-64 h-64 rounded-full opacity-[0.05]"
                        style={{ background: '#612D53' }}
                    />
                </div>

                <div className="relative z-10 w-full max-w-md space-y-8">
                    <Logo size="xl" className="justify-center" />

                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-brand-ink">Votre santé, votre histoire</h2>
                        <p className="text-brand-muted text-base leading-relaxed mt-2">
                            Suivez votre cycle, surveillez votre santé et accédez aux soins que vous méritez.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {highlights.map(({ icon: Icon, label, desc }) => (
                            <div
                                key={label}
                                className="glass-card p-4 flex items-center gap-4 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center flex-shrink-0 text-brand-primary">
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <div className="text-brand-ink text-sm font-semibold">{label}</div>
                                    <div className="text-brand-muted text-xs">{desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="flex items-center justify-center gap-2 text-brand-muted text-xs">
                        <Shield size={14} className="text-brand-primary" />
                        Données chiffrées · Conforme RGPD
                    </p>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-screen">
                <header className="lg:hidden glass-panel border-b border-brand-border px-6 py-4 flex items-center justify-between">
                    <Link href="/">
                        <Logo size="md" />
                    </Link>
                    <Link href="/" className="text-xs font-semibold text-brand-muted hover:text-brand-primary">
                        Accueil
                    </Link>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 lg:px-12">
                    <div className="w-full max-w-md page-blocks">
                        <div className="w-full">
                            <div className="hidden lg:flex justify-end mb-6">
                                <Link
                                    href="/"
                                    className="text-xs font-semibold text-brand-muted hover:text-brand-primary transition-colors"
                                >
                                    ← Retour à l&apos;accueil
                                </Link>
                            </div>

                            {title && (
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-brand-ink mb-2">{title}</h1>
                                    {subtitle && <p className="text-brand-muted text-sm">{subtitle}</p>}
                                </div>
                            )}

                            <div className="glass-card p-6 sm:p-8">{children}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
