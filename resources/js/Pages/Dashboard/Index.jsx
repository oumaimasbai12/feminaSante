import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import StatTile from '@/Components/UI/StatTile';
import GlassCard from '@/Components/UI/GlassCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import { LineChart, DonutChart } from '@/Components/UI/Charts';
import { getStoredUser } from '@/utils/auth';
import { isMenopauseEligible } from '@/utils/menopause';
import {
    Heart,
    Droplets,
    Calendar,
    MessageCircle,
    Stethoscope,
    Baby,
    BookOpen,
    ArrowRight,
    Activity,
    Moon,
    AlertCircle,
    Sparkles,
    Sun,
    Clock,
    MapPin,
    Brain,
} from 'lucide-react';

const phases = {
    period: { label: 'Phase menstruelle', icon: Droplets },
    follicular: { label: 'Phase folliculaire', icon: Sun },
    ovulation: { label: "Phase d'ovulation", icon: Sparkles },
    luteal: { label: 'Phase lutéale', icon: Moon },
};

const quickActions = [
    { label: 'Mes règles', href: '/cycles', icon: Droplets },
    { label: 'Assistant IA', href: '/chat', icon: MessageCircle },
    { label: 'Trouver un médecin', href: '/gynecologists', icon: Stethoscope },
    { label: 'Articles', href: '/articles', icon: BookOpen },
    { label: 'Grossesse', href: '/pregnancies', icon: Baby },
    { label: 'Rendez-vous', href: '/appointments', icon: Calendar },
];

function StatSkeleton() {
    return (
        <div className="glass-card h-[118px] animate-pulse p-5">
            <div className="w-10 h-10 rounded-xl bg-brand-bg mb-3" />
            <div className="h-7 w-16 bg-brand-bg rounded mb-2" />
            <div className="h-3 w-24 bg-brand-bg rounded" />
        </div>
    );
}

function formatShortDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
}

function formatDateTime(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function resolveActiveJourney(health) {
    const pregnancy = health?.active_pregnancy;
    const menopause = health?.active_menopause;

    if (pregnancy) {
        return {
            mode: 'pregnancy',
            label: 'Grossesse en cours',
            detail: pregnancy.current_week ? `Semaine ${pregnancy.current_week}` : 'Suivi actif',
            href: '/pregnancies',
            icon: Baby,
        };
    }

    if (menopause) {
        const stage = menopause.stage?.value ?? menopause.stage;
        return {
            mode: 'menopause',
            label: 'Suivi ménopause',
            detail: stage ? String(stage).replace(/_/g, ' ') : 'Profil actif',
            href: '/menopause',
            icon: Moon,
        };
    }

    if (health?.latest_cycle) {
        return {
            mode: 'cycle',
            label: 'Suivi du cycle',
            detail: health.current_cycle_day ? `Jour ${health.current_cycle_day}` : 'Cycle enregistré',
            href: '/cycles',
            icon: Heart,
        };
    }

    return null;
}

function ActiveJourneyBanner({ journey }) {
    const JourneyIcon = journey.icon;
    return (
        <GlassCard className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary shrink-0">
                    <JourneyIcon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                        Parcours actif
                    </p>
                    <p className="font-bold text-brand-ink">{journey.label}</p>
                    <p className="text-sm text-brand-muted capitalize">{journey.detail}</p>
                </div>
                <Link
                    href={journey.href}
                    className="btn-secondary text-sm py-2 px-4 inline-flex items-center gap-1 shrink-0 w-full sm:w-auto justify-center"
                >
                    Continuer <ArrowRight size={14} />
                </Link>
            </div>
        </GlassCard>
    );
}

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.axios
            .get('/api/v1/dashboard')
            .then((r) => setDashboardData(r.data))
            .catch(() => setDashboardData(null))
            .finally(() => setLoading(false));
    }, []);

    const stats = dashboardData?.stats || {};
    const health = dashboardData?.health_overview || {};
    const care = dashboardData?.care || {};
    const learning = dashboardData?.learning || {};
    const articles = learning.featured_articles || [];

    const predictions = health.predictions || [];
    const daysUntilNextPeriod = health.days_until_next_period;
    const currentCycleDay = health.current_cycle_day;
    const hasCycle = Boolean(health.latest_cycle);
    const cycleLen = predictions.find((p) => p.type === 'period')?.cycle_length_avg || 28;
    const phaseKey = !hasCycle
        ? null
        : currentCycleDay <= 5
          ? 'period'
          : currentCycleDay <= 13
            ? 'follicular'
            : currentCycleDay <= 16
              ? 'ovulation'
              : 'luteal';
    const phase = phaseKey ? phases[phaseKey] : null;
    const PhaseIcon = phase?.icon || Heart;
    const nextPeriod = predictions.find((p) => p.type === 'period');
    const nextOvulation = predictions.find((p) => p.type === 'ovulation');
    const periodDaysRemaining =
        daysUntilNextPeriod != null && daysUntilNextPeriod >= 0 ? daysUntilNextPeriod : null;
    const isPeriodSoon =
        daysUntilNextPeriod !== null && daysUntilNextPeriod <= 3 && daysUntilNextPeriod >= 0;
    const progress = hasCycle
        ? Math.min(Math.round(((currentCycleDay || 1) / cycleLen) * 100), 100)
        : 0;

    const cycleChartData = hasCycle
        ? Array.from({ length: Math.min(cycleLen, 28) }, (_, i) => ({
              label: String(i + 1),
              value: i + 1 <= (currentCycleDay || 1) ? 1 + (i + 1 === currentCycleDay ? 2 : 0) : 0.3,
          })).filter((_, i) => i % 4 === 0 || i + 1 === currentCycleDay)
        : [];

    const journeyChart = useMemo(
        () => [
            { label: 'Cycles', value: stats.cycles_count || 0 },
            { label: 'RDV', value: stats.appointments_count || 0 },
            { label: 'Quiz', value: stats.quiz_results_count || 0 },
            { label: 'Messages', value: stats.chat_messages_count || 0 },
        ],
        [stats],
    );

    const journeyTotal = journeyChart.reduce((sum, item) => sum + item.value, 0);
    const activeJourney = resolveActiveJourney(health);
    const user = getStoredUser();
    const displayName =
        dashboardData?.user?.nom ||
        dashboardData?.user?.name ||
        user?.nom ||
        user?.name ||
        'Utilisatrice';
    const nextAppointment = care.next_appointment;
    const menopauseOk = isMenopauseEligible(user || dashboardData?.user);
    const extendedQuickActions = menopauseOk
        ? [...quickActions, { label: 'Ménopause', href: '/menopause', icon: Moon, fullWidth: true }]
        : quickActions;

    return (
        <AppLayout title="Tableau de bord">
            <Head title="Tableau de bord - FeminaSante" />

            <p className="text-brand-muted text-sm mb-6">
                Bonjour, <span className="font-semibold text-brand-ink">{displayName}</span>
                {' · '}
                Voici votre santé en un coup d&apos;œil.
            </p>

            {loading ? (
                <div className="space-y-6">
                    <GlassCard className="h-36 animate-pulse" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <StatSkeleton key={i} />
                        ))}
                    </div>
                    <div className="grid lg:grid-cols-3 gap-6">
                        <GlassCard className="lg:col-span-2 h-52 animate-pulse" />
                        <GlassCard className="h-52 animate-pulse" />
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {isPeriodSoon && (
                        <GlassCard className="flex items-center gap-4 border-amber-200/70 bg-amber-50/50">
                            <div className="w-10 h-10 rounded-xl bg-brand-bg border border-amber-200 flex items-center justify-center flex-shrink-0">
                                <AlertCircle size={20} className="text-amber-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-brand-ink">
                                    Vos règles arrivent bientôt
                                </h3>
                                <p className="text-sm text-brand-muted mt-0.5">
                                    {daysUntilNextPeriod === 0
                                        ? "Elles devraient arriver aujourd'hui"
                                        : `Dans ${daysUntilNextPeriod} jour${daysUntilNextPeriod > 1 ? 's' : ''}`}
                                </p>
                            </div>
                            <Link href="/cycles" className="btn-secondary text-xs py-2 px-3 shrink-0 inline-flex w-full sm:w-auto justify-center">
                                Voir le calendrier
                            </Link>
                        </GlassCard>
                    )}

                    {activeJourney && <ActiveJourneyBanner journey={activeJourney} />}

                    {hasCycle && phase ? (
                        <GlassCard>
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary">
                                        <PhaseIcon size={26} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-brand-ink">{phase.label}</h2>
                                        <p className="text-brand-muted text-sm">
                                            Jour {currentCycleDay} sur {cycleLen}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1 lg:max-w-xs">
                                    <div className="flex justify-between text-xs font-semibold text-brand-muted mb-2">
                                        <span>Progression du cycle</span>
                                        <span className="text-brand-primary">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-brand-border/80 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-2 rounded-full bg-brand-primary/75 transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                                {cycleChartData.length > 0 && (
                                    <div className="flex-1 lg:max-w-sm">
                                        <LineChart data={cycleChartData.slice(0, 8)} height={80} />
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    ) : (
                        !activeJourney && (
                            <GlassCard className="p-6 sm:p-8 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary mx-auto mb-4">
                                    <Heart size={26} />
                                </div>
                                <h2 className="text-lg font-bold text-brand-ink mb-2">
                                    Commencez votre suivi
                                </h2>
                                <p className="text-sm text-brand-muted max-w-md mx-auto mb-5">
                                    Enregistrez votre cycle pour obtenir des prédictions, un calendrier
                                    personnalisé et des insights sur votre santé.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-3">
                                    <Link href="/cycles" className="btn-primary">
                                        Enregistrer mon cycle
                                    </Link>
                                    <Link href="/quizzes" className="btn-secondary">
                                        Faire un quiz santé
                                    </Link>
                                </div>
                            </GlassCard>
                        )
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatTile
                            label="Jour du cycle"
                            value={hasCycle ? `Jour ${currentCycleDay}` : '—'}
                            sub={hasCycle ? `sur ${cycleLen}` : 'Aucun cycle'}
                            icon={Heart}
                            href="/cycles"
                        />
                        <StatTile
                            label="Prochaines règles"
                            value={
                                periodDaysRemaining != null
                                    ? periodDaysRemaining === 0
                                        ? "Aujourd'hui"
                                        : `${periodDaysRemaining} j`
                                    : '—'
                            }
                            sub={
                                nextPeriod?.predicted_date
                                    ? formatShortDate(nextPeriod.predicted_date)
                                    : hasCycle
                                      ? 'estimation'
                                      : 'Aucun cycle'
                            }
                            icon={Calendar}
                            href="/cycles"
                        />
                        <StatTile
                            label="Cycle moyen"
                            value={hasCycle ? `${cycleLen} j` : '—'}
                            sub={`${stats.cycles_count || 0} cycle${stats.cycles_count !== 1 ? 's' : ''}`}
                            icon={Activity}
                            href="/cycles"
                        />
                        <StatTile
                            label="Rendez-vous"
                            value={stats.appointments_count || 0}
                            sub={nextAppointment ? '1 à venir' : 'aucun prévu'}
                            icon={Stethoscope}
                            href="/appointments"
                        />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <GlassCard className="lg:col-span-2 glass-card-nohover">
                            <h3 className="text-sm font-bold text-brand-ink mb-4">Actions rapides</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {extendedQuickActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <Link
                                            key={action.href}
                                            href={action.href}
                                            className={`flex gap-3 p-4 rounded-xl border border-brand-border bg-white/40 hover:bg-white/70 hover:border-brand-primary/35 active:scale-[0.98] transition-all duration-200 group ${
                                                action.fullWidth
                                                    ? 'col-span-full flex-row items-center justify-center text-center sm:text-left'
                                                    : 'flex-col items-center text-center'
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:border-brand-primary/25">
                                                <Icon size={20} className="text-brand-primary" />
                                            </div>
                                            <span className="text-xs font-semibold text-brand-ink">
                                                {action.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </GlassCard>

                        {nextAppointment ? (
                            <GlassCard className="p-5">
                                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                                    Prochain rendez-vous
                                </p>
                                <p className="font-bold text-brand-ink">
                                    Dr. {nextAppointment.gynecologist?.first_name}{' '}
                                    {nextAppointment.gynecologist?.last_name}
                                </p>
                                <p className="text-sm text-brand-muted flex items-center gap-1.5 mt-2">
                                    <Clock size={14} />
                                    {formatDateTime(nextAppointment.start_time)}
                                </p>
                                {nextAppointment.gynecologist?.city && (
                                    <p className="text-sm text-brand-muted flex items-center gap-1.5 mt-1">
                                        <MapPin size={14} />
                                        {nextAppointment.gynecologist.city}
                                    </p>
                                )}
                                <div className="flex flex-wrap items-center mt-3">
                                    <StatusBadge status={nextAppointment.status} />
                                    <Link
                                        href={`/appointments?appointment=${nextAppointment.id}`}
                                        className="text-xs font-semibold text-brand-primary inline-flex items-center gap-1 pl-3 hover:opacity-80 transition-opacity"
                                    >
                                        Voir mes rendez-vous <ArrowRight size={12} />
                                    </Link>
                                </div>
                            </GlassCard>
                        ) : (
                            <GlassCard className="p-5">
                                <h3 className="text-sm font-bold text-brand-ink mb-1">Mon activité</h3>
                                <p className="text-xs text-brand-muted mb-4">Votre engagement sur la plateforme</p>
                                {journeyTotal > 0 ? (
                                    <DonutChart segments={journeyChart} />
                                ) : (
                                    <div className="py-6 text-center">
                                        <div className="w-12 h-12 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center mx-auto mb-3 text-brand-primary">
                                            <Brain size={22} />
                                        </div>
                                        <p className="text-sm text-brand-muted">
                                            Explorez les quiz, articles et l&apos;assistant IA pour commencer.
                                        </p>
                                    </div>
                                )}
                            </GlassCard>
                        )}
                    </div>

                    {(stats.unread_notifications_count || 0) > 0 && (
                        <GlassCard className="flex items-center justify-between gap-4 p-4">
                            <p className="text-sm text-brand-muted">
                                <span className="font-semibold text-brand-ink">
                                    {stats.unread_notifications_count}
                                </span>{' '}
                                {stats.unread_notifications_count === 1
                                    ? 'notification non lue'
                                    : 'notifications non lues'}
                            </p>
                            <span className="text-xs text-brand-muted">Consultez la cloche dans le menu</span>
                        </GlassCard>
                    )}

                    {articles.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-brand-ink">Articles à la une</h3>
                                <Link
                                    href="/articles"
                                    className="text-xs font-semibold text-brand-primary flex items-center gap-1 hover:opacity-80 transition-opacity"
                                >
                                    Voir tout <ArrowRight size={14} />
                                </Link>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                {articles.map((article) => (
                                    <Link key={article.id} href={`/articles/${article.id}`} className="block group">
                                        <GlassCard
                                            hover
                                            className="h-full p-5 group-hover:border-brand-primary/30 transition-all duration-300"
                                        >
                                            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                                                {article.category?.nom || article.category?.name || 'Santé'}
                                            </span>
                                            <h4 className="font-semibold text-brand-ink mt-2 mb-2 group-hover:text-brand-primary transition-colors line-clamp-2 text-sm">
                                                {article.title}
                                            </h4>
                                            <p className="text-xs text-brand-muted line-clamp-2">
                                                {article.excerpt}
                                            </p>
                                        </GlassCard>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </AppLayout>
    );
}
