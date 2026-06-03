import React, { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '@/Components/UI/GlassCard';
import StatTile from '@/Components/UI/StatTile';
import FilterPills from '@/Components/UI/FilterPills';
import MenopauseDashboard from '../../Components/Menopause/MenopauseDashboard';
import SymptomLogger from '../../Components/Menopause/SymptomLogger';
import TreatmentManager from '../../Components/Menopause/TreatmentManager';
import ProfileWizard from '../../Components/Menopause/ProfileWizard';
import {
    BookOpen,
    Pill,
    Moon,
    Lock,
    AlertTriangle,
    Plus,
    CheckCircle2,
    Calendar,
    Activity,
    Smile,
    Clock,
    ThermometerSun,
} from 'lucide-react';
import { getStoredUser, refreshUser } from '../../utils/auth';
import { isMenopauseEligible, MENOPAUSE_MIN_AGE, menopauseStageLabel } from '../../utils/menopause';

const TABS = [
    { id: 'dashboard', label: 'Tableau de bord' },
    { id: 'journal', label: 'Journal' },
    { id: 'treatments', label: 'Traitements' },
];

export default function MenopauseIndex() {
    const [menopause, setMenopause] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [symptomCatalog, setSymptomCatalog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eligible, setEligible] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showWizard, setShowWizard] = useState(false);

    useEffect(() => {
        refreshUser().then((u) => setEligible(isMenopauseEligible(u || getStoredUser())));
    }, []);

    const loadDashboard = useCallback(async (id) => {
        if (!id) {
            setDashboard(null);
            return;
        }
        try {
            const r = await window.axios.get(`/api/v1/menopauses/${id}/dashboard`);
            setDashboard(r.data?.dashboard ?? null);
        } catch {
            setDashboard(null);
        }
    }, []);

    const loadData = useCallback(async () => {
        if (eligible === false) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [mpRes, catalogRes] = await Promise.all([
                window.axios.get('/api/v1/menopauses'),
                window.axios.get('/api/v1/menopause-symptoms/catalog'),
            ]);
            const record = mpRes.data?.length > 0 ? mpRes.data[0] : null;
            setMenopause(record);
            setSymptomCatalog(catalogRes.data?.symptoms || []);
            if (record?.id) {
                await loadDashboard(record.id);
            } else {
                setDashboard(null);
            }
        } catch (err) {
            console.error('Failed to load menopause data', err);
        } finally {
            setLoading(false);
        }
    }, [eligible, loadDashboard]);

    useEffect(() => {
        if (eligible === null) return;
        loadData();
    }, [loadData, eligible]);

    const handleProfileCreated = async (record) => {
        setMenopause(record);
        setShowWizard(false);
        setActiveTab('journal');
        await loadDashboard(record.id);
    };

    const handleSaveProfile = async (payload) => {
        if (menopause?.id) {
            await window.axios.put(`/api/v1/menopauses/${menopause.id}`, payload);
            await loadData();
        } else {
            const r = await window.axios.post('/api/v1/menopauses', payload);
            await handleProfileCreated(r.data.menopause);
        }
    };

    const handleDataChange = async () => {
        if (menopause?.id) {
            await loadDashboard(menopause.id);
            try {
                const mpRes = await window.axios.get('/api/v1/menopauses');
                if (mpRes.data?.length > 0) {
                    setMenopause(mpRes.data[0]);
                }
            } catch {
                /* ignore */
            }
        }
    };

    const logCount = menopause?.symptom_logs_count ?? menopause?.symptom_logs?.length ?? 0;
    const treatmentCount = menopause?.treatments_count ?? menopause?.treatments?.length ?? 0;
    const profile = dashboard?.profile;
    const insights = dashboard?.insights;

    const tabCounts = {
        dashboard: null,
        journal: logCount,
        treatments: treatmentCount,
    };

    if (eligible === false) {
        return (
            <AppLayout title="Ménopause">
                <Head title="Ménopause - FeminaSante" />
                <p className="text-brand-muted text-sm mb-6">
                    Module réservé aux femmes de {MENOPAUSE_MIN_AGE} ans et plus.
                </p>
                <GlassCard className="p-8 sm:p-10 w-full">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center shrink-0">
                            <Lock size={26} className="text-brand-muted" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-brand-ink mb-2">
                                Suivi ménopause non disponible
                            </h2>
                            <p className="text-brand-muted text-sm leading-relaxed">
                                Ce module s&apos;active automatiquement à partir de {MENOPAUSE_MIN_AGE} ans.
                                En attendant, explorez le suivi du cycle, la grossesse et nos articles santé.
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Ménopause">
            <Head title="Ménopause - FeminaSante" />

            <p className="text-brand-muted text-sm mb-6">
                Symptômes, traitements et statistiques — un suivi personnalisé de votre parcours ménopause.
            </p>

            <GlassCard className="p-4 flex items-start gap-3 border-amber-200/70 bg-amber-50/50 mb-6">
                <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900">
                    <span className="font-semibold">Information médicale :</span> ces outils sont éducatifs et ne
                    remplacent pas l&apos;avis d&apos;un professionnel de santé.
                </p>
            </GlassCard>

            {loading && (
                <div className="space-y-6">
                    <GlassCard className="h-40 animate-pulse" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="glass-card h-[118px] animate-pulse" />
                        ))}
                    </div>
                    <GlassCard className="h-14 animate-pulse" />
                    <GlassCard className="h-64 animate-pulse" />
                </div>
            )}

            {!loading && !menopause && !showWizard && (
                <GlassCard className="p-8 sm:p-10 w-full">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary shrink-0">
                                    <Moon size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-ink mb-2">
                                        Commencer votre suivi ménopause
                                    </h2>
                                    <p className="text-brand-muted text-sm leading-relaxed">
                                        Suivez vos symptômes, traitements et l&apos;évolution de votre parcours pour
                                        mieux comprendre votre corps.
                                    </p>
                                </div>
                            </div>
                            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-brand-muted">
                                {[
                                    'Classification automatique du stade',
                                    'Journal quotidien des symptômes',
                                    'Graphiques humeur & sommeil',
                                    'Gestion THS et traitements',
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-brand-primary shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:w-72 shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowWizard(true)}
                                className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3"
                            >
                                <Plus size={18} />
                                Configurer mon profil
                            </button>
                        </div>
                    </div>
                </GlassCard>
            )}

            {!loading && menopause && (
                <div className="space-y-6">
                    <GlassCard className="p-6">
                        <div className="grid md:grid-cols-2 gap-6 items-center">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary shrink-0">
                                    <Moon size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                                        Stade actuel
                                    </p>
                                    <h2 className="text-2xl font-bold text-brand-ink mt-1">
                                        {profile?.stage_label || menopauseStageLabel(menopause.stage)}
                                    </h2>
                                    <p className="text-sm text-brand-muted mt-1">
                                        {profile?.months_without_period != null
                                            ? `${profile.months_without_period} mois sans règles`
                                            : menopause.last_period_date
                                              ? `Dernières règles : ${new Date(menopause.last_period_date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                              : 'Complétez votre profil pour affiner le stade'}
                                    </p>
                                </div>
                            </div>
                            {profile?.months_without_period != null && profile.stage !== 'postmenopause' && (
                                <div>
                                    <div className="flex justify-between text-xs font-semibold text-brand-muted mb-2">
                                        <span>Périménopause</span>
                                        <span className="text-brand-primary">
                                            {Math.min(
                                                100,
                                                Math.round(
                                                    (profile.months_without_period /
                                                        (profile.months_without_period +
                                                            (profile.months_until_postmenopause ?? 0))) *
                                                        100,
                                                ) || 0,
                                            )}
                                            %
                                        </span>
                                        <span>Post-ménopause</span>
                                    </div>
                                    <div className="w-full bg-brand-border rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-2 rounded-full bg-brand-primary transition-all duration-500"
                                            style={{
                                                width: `${Math.min(100, Math.round((profile.months_without_period / 12) * 100))}%`,
                                            }}
                                        />
                                    </div>
                                    {profile.months_until_postmenopause > 0 && (
                                        <p className="text-xs text-brand-muted mt-2">
                                            {profile.months_until_postmenopause} mois avant post-ménopause (règle 12
                                            mois)
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatTile
                            label="Stade"
                            value={profile?.stage_label || menopauseStageLabel(menopause.stage)}
                            sub={
                                profile?.months_without_period != null
                                    ? `${profile.months_without_period} mois sans règles`
                                    : 'Suivi actif'
                            }
                            icon={Moon}
                        />
                        <StatTile
                            label="Dernières règles"
                            value={
                                profile?.last_period_date || menopause.last_period_date
                                    ? new Date(
                                          (profile?.last_period_date || menopause.last_period_date) + 'T12:00:00',
                                      ).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                                    : '—'
                            }
                            sub="date de référence"
                            icon={Calendar}
                        />
                        <StatTile
                            label="Journal"
                            value={logCount}
                            sub={`entrée${logCount !== 1 ? 's' : ''}`}
                            icon={BookOpen}
                            onClick={() => setActiveTab('journal')}
                        />
                        <StatTile
                            label="Traitements"
                            value={treatmentCount}
                            sub="enregistrés"
                            icon={Pill}
                            onClick={() => setActiveTab('treatments')}
                        />
                    </div>

                    {insights && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatTile
                                label="Humeur moyenne"
                                value={`${insights.avg_mood}/10`}
                                sub="7 derniers jours"
                                icon={Smile}
                            />
                            <StatTile
                                label="Sommeil"
                                value={`${insights.avg_sleep}/10`}
                                sub="qualité moyenne"
                                icon={Clock}
                            />
                            <StatTile
                                label="Bouffées (7j)"
                                value={insights.hot_flash_count}
                                sub="épisodes"
                                icon={ThermometerSun}
                            />
                            <StatTile
                                label="Stress moyen"
                                value={`${insights.avg_stress}/10`}
                                sub="niveau ressenti"
                                icon={Activity}
                            />
                        </div>
                    )}

                    <FilterPills
                        options={TABS.map((tab) => ({ value: tab.id, label: tab.label }))}
                        value={activeTab}
                        onChange={setActiveTab}
                        counts={tabCounts}
                        size="md"
                        className="overflow-x-auto flex-nowrap !flex-nowrap"
                    />

                    <div key={activeTab} className="fs-enter-item">
                        {activeTab === 'dashboard' && (
                            <MenopauseDashboard
                                menopauseId={menopause.id}
                                dashboard={dashboard}
                                onRefresh={handleDataChange}
                                onOpenTab={setActiveTab}
                                onEditProfile={() => setShowWizard(true)}
                            />
                        )}
                        {activeTab === 'journal' && (
                            <SymptomLogger
                                menopauseId={menopause.id}
                                symptomCatalog={symptomCatalog}
                                onSave={handleDataChange}
                            />
                        )}
                        {activeTab === 'treatments' && (
                            <TreatmentManager menopauseId={menopause.id} onSave={handleDataChange} />
                        )}
                    </div>
                </div>
            )}

            <ProfileWizard
                show={showWizard}
                onClose={() => setShowWizard(false)}
                onSave={handleSaveProfile}
                isEdit={Boolean(menopause?.id)}
                initialData={
                    menopause
                        ? {
                              last_period_date: menopause.last_period_date || '',
                              diagnosis_date: menopause.diagnosis_date || '',
                              age_at_onset: menopause.age_at_onset ?? '',
                              symptom_history_months: menopause.symptom_history_months ?? '',
                              cycle_irregularity: menopause.cycle_irregularity,
                              hormone_therapy: menopause.hormone_therapy,
                              notes: menopause.notes || '',
                              hot_flashes: menopause.hot_flashes,
                              night_sweats: menopause.night_sweats,
                              mood_changes: menopause.mood_changes,
                              sleep_changes: menopause.sleep_changes,
                          }
                        : undefined
                }
            />
        </AppLayout>
    );
}
