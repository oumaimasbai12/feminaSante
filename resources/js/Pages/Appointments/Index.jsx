import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '@/Components/UI/GlassCard';
import StatTile from '@/Components/UI/StatTile';
import StatusBadge from '@/Components/UI/StatusBadge';
import { getSearchParams, scrollMainToElement } from '@/utils/url';
import {
    Calendar,
    Clock,
    User,
    MapPin,
    Video,
    Plus,
    FileText,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

const STATUS_LABELS = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Refusé',
    completed: 'Terminé',
};

const EMPTY_COPY = {
    none: {
        title: 'Aucun rendez-vous pour le moment',
        body: 'Prenez votre premier rendez-vous avec un gynécologue certifié.',
        cta: true,
    },
    upcoming: {
        title: 'Aucun rendez-vous à venir',
        body: 'Réservez un créneau avec un gynécologue pour planifier votre prochaine consultation.',
        cta: true,
    },
    past: {
        title: 'Aucun rendez-vous passé',
        body: 'Vos consultations terminées et comptes-rendus apparaîtront ici.',
        cta: false,
    },
};

const TABS = [
    { key: 'upcoming', label: 'À venir' },
    { key: 'past', label: 'Passés' },
];

function AppointmentSkeleton() {
    return (
        <div className="space-y-4 w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <GlassCard key={i} className="h-[118px] animate-pulse" />
                ))}
            </div>
            <GlassCard className="h-14 animate-pulse" />
            {[...Array(3)].map((_, i) => (
                <GlassCard key={i} className="h-36 animate-pulse" />
            ))}
        </div>
    );
}

function VisitSummaryBlock({ summary, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    if (!summary) return null;

    return (
        <div className="mt-3 rounded-xl border border-brand-border bg-brand-soft overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold text-brand-deep"
            >
                <span className="flex items-center gap-2">
                    <FileText size={15} /> Compte-rendu du médecin
                </span>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {open && (
                <div className="px-3 pb-3 text-sm text-brand-ink space-y-2 border-t border-brand-border pt-2">
                    <p className="whitespace-pre-wrap">{summary.patient_summary}</p>
                    {summary.prescription && (
                        <p className="text-brand-muted">
                            <span className="font-semibold">Prescription :</span> {summary.prescription}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Appointments() {
    const { url } = usePage();
    const [appts, setAppts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('upcoming');

    const params = useMemo(() => getSearchParams(url), [url]);
    const highlightId = parseInt(params.get('appointment') || '', 10) || null;
    const expandSummary = params.get('expand') === 'summary';
    const urlTab = params.get('tab');
    const gynecologistFilter = parseInt(params.get('gynecologist') || '', 10) || null;

    useEffect(() => {
        window.axios
            .get('/api/v1/appointments')
            .then((a) => setAppts(Array.isArray(a.data) ? a.data : a.data.data || []))
            .catch(() => setAppts([]))
            .finally(() => setLoading(false));
    }, []);

    const resolvedHighlightId = useMemo(() => {
        if (highlightId) return highlightId;
        if (!gynecologistFilter || !expandSummary) return null;
        const now = new Date();
        const match = appts.find(
            (a) =>
                a.gynecologist_id === gynecologistFilter &&
                a.visit_summary &&
                (new Date(a.start_time) < now || a.status === 'completed' || a.status === 'cancelled'),
        );
        return match?.id ?? null;
    }, [highlightId, gynecologistFilter, expandSummary, appts]);

    useEffect(() => {
        if (appts.length === 0) return;

        if (urlTab === 'past' || urlTab === 'upcoming') {
            setTab(urlTab);
            return;
        }

        if (!resolvedHighlightId) return;

        const target = appts.find((a) => a.id === resolvedHighlightId);
        if (!target) return;

        const now = new Date();
        const isUpcoming =
            new Date(target.start_time) >= now && target.status !== 'cancelled' && target.status !== 'completed';
        setTab(isUpcoming ? 'upcoming' : 'past');
    }, [resolvedHighlightId, appts, urlTab, url]);

    useEffect(() => {
        if (!resolvedHighlightId || loading) return;
        const timer = setTimeout(() => {
            scrollMainToElement(document.getElementById(`appointment-${resolvedHighlightId}`));
        }, 200);
        return () => clearTimeout(timer);
    }, [resolvedHighlightId, loading, tab, url]);

    const now = new Date();
    const upcoming = appts.filter(
        (a) => new Date(a.start_time) >= now && a.status !== 'cancelled',
    );
    const past = appts.filter(
        (a) =>
            new Date(a.start_time) < now ||
            a.status === 'cancelled' ||
            a.status === 'completed',
    );
    const list = tab === 'upcoming' ? upcoming : past;
    const onlineCount = appts.filter((a) => a.consultation_type === 'online').length;
    const confirmedCount = upcoming.filter((a) => a.status === 'confirmed').length;
    const hasAnyAppointments = appts.length > 0;
    const emptyCopy = !hasAnyAppointments
        ? EMPTY_COPY.none
        : tab === 'upcoming'
          ? EMPTY_COPY.upcoming
          : EMPTY_COPY.past;

    return (
        <AppLayout title="Mes rendez-vous">
            <Head title="Mes rendez-vous - FeminaSante" />

            <p className="text-brand-muted text-sm mb-6">
                Consultez vos consultations à venir, préparez votre visite et accédez aux comptes-rendus.
            </p>

            {loading && <AppointmentSkeleton />}

            {!loading && (
                <>
                    {appts.length > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <StatTile
                                label="Total"
                                value={appts.length}
                                sub="rendez-vous"
                                icon={Calendar}
                            />
                            <StatTile
                                label="À venir"
                                value={upcoming.length}
                                sub={confirmedCount ? `${confirmedCount} confirmé${confirmedCount > 1 ? 's' : ''}` : 'prochains créneaux'}
                                icon={Clock}
                            />
                            <StatTile
                                label="Passés"
                                value={past.length}
                                sub="historique"
                                icon={FileText}
                            />
                            <StatTile
                                label="En ligne"
                                value={onlineCount}
                                sub="consultations vidéo"
                                icon={Video}
                            />
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        {hasAnyAppointments && (
                            <div className="flex glass-card p-1.5 gap-1 overflow-x-auto">
                                {TABS.map((t) => {
                                    const count = t.key === 'upcoming' ? upcoming.length : past.length;
                                    const isActive = tab === t.key;
                                    return (
                                        <button
                                            key={t.key}
                                            type="button"
                                            onClick={() => setTab(t.key)}
                                            aria-pressed={isActive}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap inline-flex items-center gap-2 ${
                                                isActive
                                                    ? 'bg-brand-bg text-brand-ink border-2 border-brand-primary/35 shadow-sm'
                                                    : 'text-brand-muted hover:text-brand-ink hover:bg-brand-bg/60 border-2 border-transparent'
                                            }`}
                                        >
                                            {t.label}
                                            <span
                                                className={`text-xs tabular-nums px-1.5 py-0.5 rounded-md ${
                                                    isActive
                                                        ? 'bg-brand-primary/10 text-brand-primary font-bold'
                                                        : 'bg-brand-bg text-brand-muted'
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        <Link
                            href="/gynecologists"
                            className={`btn-primary inline-flex items-center justify-center gap-2 shrink-0 ${!hasAnyAppointments ? 'w-full sm:w-auto sm:ml-auto' : ''}`}
                        >
                            <Plus size={18} /> Prendre rendez-vous
                        </Link>
                    </div>

                    {list.length === 0 && (
                        <GlassCard className="text-center py-16 w-full">
                            <Calendar size={48} className="text-brand-border mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-brand-ink mb-2">{emptyCopy.title}</h3>
                            <p className="text-brand-muted text-sm mb-6 max-w-md mx-auto">{emptyCopy.body}</p>
                            {emptyCopy.cta && (
                                <Link href="/gynecologists" className="btn-primary inline-flex items-center gap-2">
                                    <Plus size={18} /> Trouver un gynécologue
                                </Link>
                            )}
                        </GlassCard>
                    )}

                    <div className="space-y-4 w-full">
                        {list.map((a) => {
                            const doc = a.gynecologist;
                            const isHighlighted = a.id === resolvedHighlightId;
                            const start = new Date(a.start_time);

                            return (
                                <div key={a.id} id={`appointment-${a.id}`}>
                                    <GlassCard
                                        className={`p-5 transition-colors ${
                                            isHighlighted
                                                ? 'border-brand-primary ring-2 ring-brand-primary/20'
                                                : ''
                                        }`}
                                    >
                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 bg-brand-bg border border-brand-border text-brand-primary">
                                                {doc ? (
                                                    <>
                                                        {(doc.first_name || 'D').charAt(0)}
                                                        {(doc.last_name || 'R').charAt(0)}
                                                    </>
                                                ) : (
                                                    <User size={22} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                                                    <h4 className="font-bold text-brand-ink">
                                                        {doc
                                                            ? `Dr. ${doc.first_name} ${doc.last_name}`
                                                            : 'Médecin'}
                                                    </h4>
                                                    <StatusBadge
                                                        status={a.status}
                                                        label={STATUS_LABELS[a.status] || a.status}
                                                        className="md:hidden"
                                                    />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brand-muted">
                                                    <span className="flex items-center gap-1 capitalize">
                                                        <Calendar size={15} />
                                                        {start.toLocaleDateString('fr-FR', {
                                                            weekday: 'long',
                                                            day: 'numeric',
                                                            month: 'long',
                                                        })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={15} />
                                                        {start.toLocaleTimeString('fr-FR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        {a.consultation_type === 'online' ? (
                                                            <Video size={15} />
                                                        ) : (
                                                            <MapPin size={15} />
                                                        )}
                                                        {a.consultation_type === 'online'
                                                            ? 'En ligne'
                                                            : 'En cabinet'}
                                                    </span>
                                                </div>
                                                {a.reason && (
                                                    <p className="text-sm text-brand-muted mt-2">
                                                        Motif : {a.reason}
                                                    </p>
                                                )}
                                                {a.status === 'cancelled' && a.cancellation_reason && (
                                                    <p className="text-sm text-red-600 mt-2 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                                                        Motif du refus : {a.cancellation_reason}
                                                    </p>
                                                )}
                                                {a.status === 'cancelled' && doc && (
                                                    <Link
                                                        href={`/gynecologists/${doc.id}?book=1`}
                                                        className="inline-flex mt-2 text-sm font-semibold text-brand-primary hover:opacity-80 transition-opacity"
                                                    >
                                                        Choisir un autre créneau →
                                                    </Link>
                                                )}
                                                <VisitSummaryBlock
                                                    summary={a.visit_summary}
                                                    defaultOpen={
                                                        isHighlighted &&
                                                        expandSummary &&
                                                        !!a.visit_summary
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="hidden md:block shrink-0 self-start">
                                            <StatusBadge
                                                status={a.status}
                                                label={STATUS_LABELS[a.status] || a.status}
                                            />
                                        </div>
                                    </div>
                                </GlassCard>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </AppLayout>
    );
}
