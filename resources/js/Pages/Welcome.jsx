import React from 'react';
import { Link } from '@inertiajs/react';
import Logo from '../Components/Logo';
import {
    Heart,
    Activity,
    Brain,
    Stethoscope,
    Baby,
    BookOpen,
    ArrowRight,
    CheckCircle,
    Sparkles,
    Shield,
    Moon,
} from 'lucide-react';

const features = [
    {
        icon: Heart,
        title: 'Suivi du cycle',
        desc: 'Cycle, symptômes et humeur avec prédictions intelligentes.',
        tag: 'Essentiel',
        bento: 'hero',
    },
    {
        icon: Activity,
        title: 'Analyse de santé',
        desc: 'Recommandations personnalisées basées sur vos données.',
        bento: 'tile',
    },
    {
        icon: Brain,
        title: 'Quiz santé',
        desc: 'Comprenez mieux votre corps de façon interactive.',
        bento: 'tile',
    },
    {
        icon: Stethoscope,
        title: 'Réseau d\'experts',
        desc: 'Gynécologues certifiés en ligne ou en cabinet.',
        bento: 'tile',
    },
    {
        icon: Baby,
        title: 'Suivi grossesse',
        desc: 'Du premier trimestre à l\'accouchement.',
        bento: 'tile',
    },
    {
        icon: Moon,
        title: 'Ménopause',
        desc: 'Journal des symptômes et suivi personnalisé.',
        bento: 'wide',
    },
    {
        icon: BookOpen,
        title: 'Bibliothèque',
        desc: 'Articles rédigés par des professionnels de santé.',
        bento: 'wide',
    },
];

function FeatureCard({ feature }) {
    const I = feature.icon;
    const isHero = feature.bento === 'hero';
    const isWide = feature.bento === 'wide';

    return (
        <div
            className={[
                'glass-card group relative overflow-hidden transition-all duration-200',
                'hover:border-brand-primary/25 hover:bg-white/80',
                isHero
                    ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2 p-6 lg:p-8 flex flex-col justify-between min-h-[220px] lg:min-h-0'
                    : isWide
                      ? 'sm:col-span-2 lg:col-span-2 p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-4'
                      : 'p-5 lg:p-6 flex flex-col',
            ].join(' ')}
        >
            {isHero && (
                <div
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none"
                    style={{ background: 'var(--fs-primary)' }}
                />
            )}
            <div className={isWide ? 'flex items-start gap-4 flex-1 min-w-0' : ''}>
                <div
                    className={[
                        'rounded-xl flex items-center justify-center shrink-0 bg-brand-bg text-brand-primary border border-brand-border',
                        'transition-colors group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20',
                        isHero ? 'w-14 h-14' : 'w-11 h-11',
                    ].join(' ')}
                >
                    <I size={isHero ? 24 : 20} />
                </div>
                <div className={isWide ? 'min-w-0' : 'mt-4'}>
                    {feature.tag && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md mb-2">
                            {feature.tag}
                        </span>
                    )}
                    <h3
                        className={[
                            'font-bold text-brand-ink',
                            isHero ? 'text-xl lg:text-2xl mb-2' : 'text-base mb-1.5',
                        ].join(' ')}
                    >
                        {feature.title}
                    </h3>
                    <p
                        className={[
                            'text-brand-muted leading-relaxed',
                            isHero ? 'text-sm lg:text-base max-w-md' : 'text-sm',
                        ].join(' ')}
                    >
                        {feature.desc}
                    </p>
                </div>
            </div>
            {isHero && (
                <ul className="mt-6 space-y-2 relative z-10">
                    {['Calendrier & prédictions', 'Symptômes & humeur', 'Historique complet'].map(
                        (item) => (
                            <li
                                key={item}
                                className="flex items-center gap-2 text-sm text-brand-muted"
                            >
                                <CheckCircle size={14} className="text-brand-primary shrink-0" />
                                {item}
                            </li>
                        ),
                    )}
                </ul>
            )}
        </div>
    );
}

const stats = [
    { v: '50K+', l: 'Femmes accompagnées' },
    { v: '200+', l: 'Articles santé' },
    { v: '98%', l: 'Satisfaction' },
    { v: '24/7', l: 'Assistant IA' },
];

export default function Welcome() {
    return (
        <div className="min-h-screen bg-brand-bg overflow-x-hidden">
            <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-brand-border">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                    <Link href="/">
                        <Logo size="md" />
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-muted">
                        <a href="#features" className="hover:text-brand-primary transition-colors">
                            Fonctionnalités
                        </a>
                        <a href="#stats" className="hover:text-brand-primary transition-colors">
                            Chiffres
                        </a>
                        <a href="#cta" className="hover:text-brand-primary transition-colors">
                            Commencer
                        </a>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/login"
                            className="text-sm font-semibold text-brand-muted hover:text-brand-primary transition-colors px-3 sm:px-4 py-2"
                        >
                            Se connecter
                        </Link>
                        <Link href="/register" className="btn-primary text-sm">
                            Commencer
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="page-blocks">
            <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-32 -left-32 w-96 h-96 rounded-full opacity-[0.07]"
                        style={{ background: '#853953' }}
                    />
                    <div
                        className="absolute bottom-20 right-0 w-80 h-80 rounded-full opacity-[0.05]"
                        style={{ background: '#612D53' }}
                    />
                </div>
                <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 text-sm font-semibold text-brand-primary mb-6">
                            <Sparkles size={14} />
                            Plateforme de santé féminine
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-brand-ink leading-tight mb-6">
                            Prenez soin de
                            <br />
                            <span className="text-gradient">votre santé</span>
                            <br />
                            en toute confiance
                        </h1>
                        <p className="text-lg text-brand-muted leading-relaxed mb-8 max-w-lg">
                            FeminaSante est votre compagnon intelligent — cycle, grossesse, ménopause et accès
                            aux soins, en un seul endroit.
                        </p>
                        <div className="flex flex-wrap gap-4 mb-8">
                            <Link href="/register" className="btn-primary text-base py-3 px-6">
                                Commencer <ArrowRight size={18} />
                            </Link>
                            <Link href="/login" className="btn-secondary text-base py-3 px-6">
                                Se connecter
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-5">
                            {['Gratuit pour commencer', 'Sans carte bancaire', 'Données sécurisées'].map((t) => (
                                <div key={t} className="flex items-center gap-2 text-sm text-brand-muted">
                                    <CheckCircle size={15} className="text-brand-primary shrink-0" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="glass-card p-8 w-full max-w-sm">
                            <Logo size="lg" className="justify-center mb-6" />
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { l: 'Jour du cycle', v: 'Jour 14', icon: Heart },
                                    { l: 'Prochaines règles', v: '14 jours', icon: Activity },
                                    { l: 'Phase', v: 'Ovulation', icon: Sparkles },
                                    { l: 'RDV', v: 'Confirmé', icon: Stethoscope },
                                ].map((s) => {
                                    const I = s.icon;
                                    return (
                                        <div
                                            key={s.l}
                                            className="p-3 rounded-xl border border-brand-border bg-white/42 text-center transition-colors hover:bg-brand-bg/60"
                                        >
                                            <I size={16} className="mx-auto mb-1 text-brand-primary" />
                                            <div className="text-sm font-bold text-brand-ink">{s.v}</div>
                                            <div className="text-[10px] text-brand-muted">{s.l}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="stats" className="py-14 px-6 border-y border-brand-border">
                <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <div key={s.v} className="glass-card p-6 text-center">
                            <div className="text-3xl font-extrabold text-brand-primary tabular-nums mb-1">
                                {s.v}
                            </div>
                            <div className="text-brand-muted text-sm">{s.l}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="features" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-brand-primary font-semibold text-sm uppercase tracking-wider">
                            Fonctionnalités
                        </span>
                        <h2 className="text-3xl font-extrabold text-brand-ink mt-2 mb-3">
                            Votre compagnon complet
                        </h2>
                        <p className="text-brand-muted max-w-xl mx-auto">
                            Chaque aspect de votre santé féminine, couvert avec clarté et bienveillance.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                        {features.map((f) => (
                            <FeatureCard key={f.title} feature={f} />
                        ))}
                    </div>
                </div>
            </section>

            <section id="cta" className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center glass-card p-10">
                    <div className="flex items-center justify-center gap-2 text-brand-muted text-sm mb-6">
                        <Shield size={16} className="text-brand-primary" />
                        Données sécurisées · Conforme RGPD
                    </div>
                    <h2 className="text-2xl font-extrabold text-brand-ink mb-3">Prête à commencer ?</h2>
                    <p className="text-brand-muted text-sm mb-6">
                        Créez votre compte en quelques minutes et commencez votre suivi personnalisé.
                    </p>
                    <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-base py-3 px-8">
                        Créer un compte <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <footer className="py-8 px-6 border-t border-brand-border">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <Logo size="sm" />
                    <p className="text-brand-muted text-sm">© 2026 FeminaSante. Tous droits réservés.</p>
                    <div className="flex gap-6 text-sm text-brand-muted">
                        <Link href="/privacy" className="hover:text-brand-primary transition-colors">
                            Confidentialité
                        </Link>
                        <Link href="/terms" className="hover:text-brand-primary transition-colors">
                            Conditions
                        </Link>
                        <Link href="/contact" className="hover:text-brand-primary transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
            </div>
        </div>
    );
}
