import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '@/Components/UI/GlassCard';
import StatTile from '@/Components/UI/StatTile';
import PasswordInput from '../../Components/PasswordInput';
import {
    User,
    Mail,
    Save,
    Lock,
    CheckCircle,
    Heart,
    Baby,
    Moon,
    Calendar,
    Brain,
    Cake,
    AlertTriangle,
} from 'lucide-react';
import { isMenopauseEligible, MENOPAUSE_MIN_AGE } from '../../utils/menopause';
import { getStoredUser } from '../../utils/auth';

function normalizeUser(raw) {
    if (!raw) return {};
    return {
        ...raw,
        name: raw.name || raw.nom || '',
        nom: raw.nom || raw.name || '',
    };
}

function formatMemberSince(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function menopauseSubLabel(health, user) {
    if (health?.active_menopause) return 'Suivi actif';
    if (isMenopauseEligible(user)) return 'Configurer le profil';
    return `Disponible dès ${MENOPAUSE_MIN_AGE} ans`;
}

function PageSkeleton() {
    return (
        <div className="space-y-6 w-full animate-pulse">
            <GlassCard className="h-28" />
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <GlassCard key={i} className="h-[118px]" />
                ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard className="h-72" />
                <GlassCard className="h-72" />
            </div>
        </div>
    );
}

export default function Profile() {
    const [user, setUser] = useState({ name: '', nom: '', email: '' });
    const [stats, setStats] = useState(null);
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [passForm, setPassForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [passError, setPassError] = useState('');
    const [passSaving, setPassSaving] = useState(false);
    const [passSaved, setPassSaved] = useState(false);

    useEffect(() => {
        const stored = getStoredUser();
        if (stored?.is_admin) {
            window.location.href = '/admin/dashboard';
            return;
        }
        if (stored?.is_gynecologist) {
            window.location.href = '/gynecologist/dashboard';
            return;
        }

        Promise.all([
            window.axios.get('/api/v1/profile'),
            window.axios.get('/api/v1/dashboard').catch(() => ({ data: null })),
        ])
            .then(([profileRes, dashRes]) => {
                const u = normalizeUser(profileRes.data.user || profileRes.data);
                setUser(u);
                localStorage.setItem(
                    'user',
                    JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), ...u }),
                );

                if (dashRes.data) {
                    setStats(dashRes.data.stats || null);
                    setHealth(dashRes.data.health_overview || null);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const save = async () => {
        setSaving(true);
        setSaveError('');
        try {
            const r = await window.axios.put('/api/v1/profile', {
                name: user.name || user.nom,
                email: user.email,
            });
            const updated = normalizeUser(r.data.user || r.data);
            setUser(updated);
            localStorage.setItem(
                'user',
                JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), ...updated }),
            );
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            setSaveError(e.response?.data?.message || 'Erreur lors de l’enregistrement.');
        }
        setSaving(false);
    };

    const savePassword = async () => {
        setPassError('');
        setPassSaving(true);
        try {
            await window.axios.put('/api/v1/profile/password', passForm);
            setPassForm({ current_password: '', password: '', password_confirmation: '' });
            setPassSaved(true);
            setTimeout(() => setPassSaved(false), 3000);
        } catch (e) {
            const msg =
                e.response?.data?.message ||
                (e.response?.data?.errors
                    ? Object.values(e.response.data.errors)[0][0]
                    : 'Erreur lors de la mise à jour.');
            setPassError(msg);
        }
        setPassSaving(false);
    };

    const ini = (n) => (n || 'U').charAt(0).toUpperCase();
    const displayName = user.name || user.nom || 'Utilisatrice';
    const menopauseOk = isMenopauseEligible(user);
    const memberSince = formatMemberSince(user.created_at);

    const journeyTiles = useMemo(() => {
        const menopauseValue = health?.active_menopause
            ? 'Active'
            : menopauseOk
              ? 'À configurer'
              : `Dès ${MENOPAUSE_MIN_AGE} ans`;

        return [
            {
                label: 'Cycles',
                value: stats?.cycles_count ?? 0,
                sub: 'suivis',
                icon: Heart,
                href: '/cycles',
            },
            {
                label: 'Grossesses',
                value: stats?.pregnancies_count ?? 0,
                sub: 'enregistrées',
                icon: Baby,
                href: '/pregnancies',
            },
            {
                label: 'Ménopause',
                value: menopauseValue,
                sub: menopauseSubLabel(health, user),
                icon: Moon,
                href: menopauseOk ? '/menopause' : null,
            },
            {
                label: 'Rendez-vous',
                value: stats?.appointments_count ?? 0,
                sub: 'planifiés',
                icon: Calendar,
                href: '/appointments',
            },
            {
                label: 'Quiz',
                value: stats?.quiz_results_count ?? 0,
                sub: 'complétés',
                icon: Brain,
                href: '/quizzes',
            },
        ];
    }, [stats, health, user, menopauseOk]);

    if (loading) {
        return (
            <AppLayout title="Mon profil">
                <Head title="Mon profil - FeminaSante" />
                <PageSkeleton />
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Mon profil">
            <Head title="Mon profil - FeminaSante" />

            <p className="text-brand-muted text-sm mb-6">
                Gérez vos informations personnelles et consultez un aperçu de votre parcours santé.
            </p>

            <div className="space-y-6 w-full">
                <GlassCard className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary text-2xl font-bold shrink-0">
                            {ini(displayName)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-brand-ink">{displayName}</h2>
                            <p className="text-brand-muted text-sm mt-0.5">{user.email}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {user.age != null && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-bg border border-brand-border text-brand-ink px-3 py-1.5 rounded-full">
                                        <Cake size={13} /> {user.age} ans
                                    </span>
                                )}
                                {memberSince && (
                                    <span className="text-xs font-semibold bg-brand-soft text-brand-primary border border-brand-primary/20 px-3 py-1.5 rounded-full">
                                        Membre depuis {memberSince}
                                    </span>
                                )}
                            </div>
                            {saved && (
                                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-sm font-semibold">
                                    <CheckCircle size={15} /> Profil enregistré
                                </div>
                            )}
                        </div>
                    </div>
                </GlassCard>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {journeyTiles.map((item) =>
                        item.href ? (
                            <StatTile
                                key={item.label}
                                label={item.label}
                                value={item.value}
                                sub={item.sub}
                                icon={item.icon}
                                href={item.href}
                            />
                        ) : (
                            <StatTile
                                key={item.label}
                                label={item.label}
                                value={item.value}
                                sub={item.sub}
                                icon={item.icon}
                            />
                        ),
                    )}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <GlassCard className="p-5 sm:p-6 space-y-4">
                        <h3 className="text-base font-bold text-brand-ink">Mes informations</h3>

                        {saveError && (
                            <div className="p-3 rounded-xl text-sm border bg-red-50/80 border-red-200 text-red-800 flex items-start gap-2">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                {saveError}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">
                                Nom complet
                            </label>
                            <div className="relative">
                                <User
                                    size={17}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
                                />
                                <input
                                    type="text"
                                    value={user.name || user.nom || ''}
                                    onChange={(e) =>
                                        setUser({ ...user, name: e.target.value, nom: e.target.value })
                                    }
                                    className="input-field pl-11 w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">
                                Adresse e-mail
                            </label>
                            <div className="relative">
                                <Mail
                                    size={17}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
                                />
                                <input
                                    type="email"
                                    value={user.email || ''}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="input-field pl-11 w-full"
                                />
                            </div>
                        </div>
                        {user.age != null && (
                            <p className="text-xs text-brand-muted">
                                Votre âge ({user.age} ans) a été défini à l’inscription et détermine
                                l’accès au suivi ménopause.
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={save}
                            disabled={saving}
                            className="w-full btn-primary py-3"
                        >
                            {saving ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={17} />
                            )}
                            {saving ? 'Enregistrement…' : 'Enregistrer'}
                        </button>
                    </GlassCard>

                    <GlassCard className="p-5 sm:p-6 space-y-4">
                        <h3 className="text-base font-bold text-brand-ink">Mot de passe</h3>

                        {passError && (
                            <div className="p-3 rounded-xl text-sm border bg-red-50/80 border-red-200 text-red-800 flex items-start gap-2">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                {passError}
                            </div>
                        )}
                        {passSaved && (
                            <div className="p-3 rounded-xl bg-green-50 text-green-700 border border-green-200 text-sm flex items-center gap-2">
                                <CheckCircle size={16} /> Mot de passe mis à jour
                            </div>
                        )}
                        {[
                            { k: 'current_password', l: 'Mot de passe actuel' },
                            { k: 'password', l: 'Nouveau mot de passe' },
                            { k: 'password_confirmation', l: 'Confirmer le nouveau mot de passe' },
                        ].map((f) => (
                            <div key={f.k}>
                                <label className="block text-sm font-semibold text-brand-ink mb-2">
                                    {f.l}
                                </label>
                                <PasswordInput
                                    value={passForm[f.k]}
                                    onChange={(e) =>
                                        setPassForm({ ...passForm, [f.k]: e.target.value })
                                    }
                                    inputClassName="input-field pl-11 pr-11 w-full"
                                    autoComplete={
                                        f.k === 'current_password' ? 'current-password' : 'new-password'
                                    }
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={savePassword}
                            disabled={passSaving}
                            className="w-full btn-secondary py-3"
                        >
                            {passSaving ? (
                                <span className="w-4 h-4 border-2 border-brand-muted/30 border-t-brand-ink rounded-full animate-spin" />
                            ) : (
                                <Lock size={17} />
                            )}
                            {passSaving ? 'Mise à jour…' : 'Changer le mot de passe'}
                        </button>
                    </GlassCard>
                </div>
            </div>
        </AppLayout>
    );
}
