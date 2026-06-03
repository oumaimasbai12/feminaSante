import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '@/Components/UI/GlassCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import BookingWizard from '../../Components/Appointments/BookingWizard';
import DoctorAvailability from '../../Components/Appointments/DoctorAvailability';
import ConsultationMessages from '../../Components/Appointments/ConsultationMessages';
import { getSearchParams, scrollMainToElement } from '@/utils/url';

const MESSAGEABLE_APPOINTMENT_STATUSES = ['confirmed', 'completed'];
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Calendar,
    ChevronLeft,
    MessageCircle,
    Stethoscope,
    AlertTriangle,
} from 'lucide-react';

function PageSkeleton() {
    return (
        <div className="space-y-6 w-full animate-pulse">
            <div className="h-4 w-36 bg-brand-bg rounded" />
            <GlassCard className="h-40" />
            <GlassCard className="h-48" />
            <GlassCard className="h-14" />
            <GlassCard className="h-64" />
        </div>
    );
}

export default function GynecologistShow() {
    const { id: pageId } = usePage().props;
    const pageUrl = usePage().url;
    const id = pageId ?? window.location.pathname.split('/').pop();
    const params = useMemo(() => getSearchParams(pageUrl), [pageUrl]);
    const startBooking = params.get('book') === '1';
    const tabParam = params.get('tab');

    const [doc, setDoc] = useState(null);
    const [availabilityDays, setAvailabilityDays] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(true);
    const [myAppts, setMyAppts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(() => {
        if (tabParam === 'messages' || tabParam === 'rdv') return tabParam;
        if (startBooking || tabParam === 'reserver') return 'reserver';
        return 'reserver';
    });

    useEffect(() => {
        if (startBooking) {
            setTab('reserver');
            return;
        }
        if (tabParam === 'messages' || tabParam === 'rdv' || tabParam === 'reserver') {
            setTab(tabParam);
        }
    }, [startBooking, tabParam, pageUrl]);

    useEffect(() => {
        if (tab !== 'messages' || loading) return;
        const timer = setTimeout(() => {
            scrollMainToElement(document.getElementById('consultation-messages-panel'));
        }, 200);
        return () => clearTimeout(timer);
    }, [tab, loading, pageUrl]);

    useEffect(() => {
        if (!id) return;

        Promise.all([
            window.axios.get(`/api/v1/gynecologists/${id}`),
            window.axios.get(`/api/v1/gynecologists/${id}/availability`),
            window.axios.get('/api/v1/appointments').catch(() => ({ data: [] })),
        ])
            .then(([g, avail, appts]) => {
                setDoc(g.data);
                setAvailabilityDays(avail.data.days || []);
                const all = Array.isArray(appts.data) ? appts.data : appts.data.data || [];
                setMyAppts(all.filter((a) => a.gynecologist_id === parseInt(id, 10)));
            })
            .catch(() => setDoc(null))
            .finally(() => {
                setLoading(false);
                setLoadingAvailability(false);
            });
    }, [id]);

    const handleBooked = (appointment) => {
        setMyAppts((prev) => [appointment, ...prev]);
        setTab('rdv');
    };

    if (loading) {
        return (
            <AppLayout title="Gynécologue">
                <Head title="Gynécologue - FeminaSante" />
                <PageSkeleton />
            </AppLayout>
        );
    }

    if (!doc) {
        return (
            <AppLayout title="Gynécologue">
                <Head title="Gynécologue - FeminaSante" />
                <GlassCard className="text-center py-16 w-full">
                    <AlertTriangle size={36} className="text-brand-border mx-auto mb-4" />
                    <p className="text-brand-muted mb-4">Gynécologue introuvable.</p>
                    <Link href="/gynecologists" className="btn-primary inline-flex items-center gap-2">
                        <ChevronLeft size={16} /> Retour à la liste
                    </Link>
                </GlassCard>
            </AppLayout>
        );
    }

    const canMessage = myAppts.some((a) => MESSAGEABLE_APPOINTMENT_STATUSES.includes(a.status));

    const tabs = [
        { k: 'reserver', l: 'Réserver', icon: Calendar },
        { k: 'rdv', l: `Mes RDV (${myAppts.length})`, icon: Clock },
        ...(canMessage || tab === 'messages' || tabParam === 'messages'
            ? [{ k: 'messages', l: 'Messages', icon: MessageCircle }]
            : []),
    ];

    const displayName = `Dr. ${doc.first_name} ${doc.last_name}`;

    return (
        <AppLayout title={displayName}>
            <Head title={`${displayName} - FeminaSante`} />

            <Link
                href="/gynecologists"
                className="inline-flex items-center gap-2 text-sm text-brand-primary hover:opacity-80 font-semibold mb-6 transition-opacity"
            >
                <ChevronLeft size={18} /> Retour à la liste
            </Link>

            <GlassCard className="p-6 mb-6 w-full">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 bg-brand-bg border border-brand-border text-brand-primary">
                        {(doc.first_name || 'D').charAt(0)}
                        {(doc.last_name || 'R').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-brand-ink">{displayName}</h1>
                        <p className="text-brand-primary font-medium text-sm mt-0.5 flex items-center gap-1.5">
                            <Stethoscope size={14} />
                            {doc.speciality || 'Gynécologue'}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-brand-muted">
                            {doc.city && (
                                <span className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {doc.adress ? `${doc.adress}, ` : ''}
                                    {doc.city}
                                </span>
                            )}
                            {doc.phone && (
                                <span className="flex items-center gap-1">
                                    <Phone size={14} />
                                    {doc.phone}
                                </span>
                            )}
                            {doc.email && (
                                <span className="flex items-center gap-1">
                                    <Mail size={14} />
                                    {doc.email}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                            <span className="flex items-center gap-1.5 text-brand-muted">
                                <Clock size={14} />
                                {doc.consultation_duration || 30} min
                            </span>
                            {doc.consultation_fee != null && (
                                <span className="font-semibold text-brand-ink">
                                    {Number(doc.consultation_fee).toFixed(0)} MAD
                                </span>
                            )}
                        </div>
                        {doc.bio && (
                            <p className="text-sm text-brand-muted mt-3 leading-relaxed">{doc.bio}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setTab('reserver')}
                        className="btn-primary shrink-0 w-full sm:w-auto"
                    >
                        Prendre RDV
                    </button>
                </div>
            </GlassCard>

            <GlassCard className="p-6 mb-6 w-full">
                <h2 className="text-base font-bold text-brand-ink mb-1 flex items-center gap-2">
                    <Calendar size={18} className="text-brand-primary" />
                    Disponibilités
                </h2>
                <p className="text-xs text-brand-muted mb-4">Créneaux ouverts sur les 30 prochains jours</p>
                <DoctorAvailability days={availabilityDays} loading={loadingAvailability} />
            </GlassCard>

            <div className="flex gap-1 glass-card p-1 mb-6 overflow-x-auto">
                {tabs.map((t) => {
                    const Icon = t.icon;
                    const isActive = tab === t.k;
                    return (
                        <button
                            key={t.k}
                            type="button"
                            onClick={() => setTab(t.k)}
                            className={`flex-1 min-w-fit px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${
                                isActive
                                    ? 'bg-brand-soft text-brand-primary border border-brand-primary/25'
                                    : 'text-brand-muted hover:text-brand-ink hover:bg-brand-soft/50 border border-transparent'
                            }`}
                        >
                            <Icon size={15} />
                            {t.l}
                        </button>
                    );
                })}
            </div>

            {tab === 'rdv' && (
                <div className="space-y-3 w-full">
                    {myAppts.length === 0 ? (
                        <GlassCard className="p-10 text-center">
                            <Calendar size={36} className="text-brand-border mx-auto mb-3" />
                            <p className="text-brand-muted text-sm mb-4">
                                Aucun rendez-vous avec ce praticien.
                            </p>
                            <button type="button" onClick={() => setTab('reserver')} className="btn-primary">
                                Réserver
                            </button>
                        </GlassCard>
                    ) : (
                        myAppts.map((a) => (
                            <GlassCard key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex-1 text-sm min-w-0">
                                    <p className="font-semibold text-brand-ink capitalize">
                                        {new Date(a.start_time).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                        })}
                                    </p>
                                    <p className="text-brand-muted flex items-center gap-1 mt-0.5">
                                        <Clock size={13} />
                                        {new Date(a.start_time).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                        {a.reason && ` · ${a.reason}`}
                                    </p>
                                </div>
                                <StatusBadge status={a.status} />
                            </GlassCard>
                        ))
                    )}
                </div>
            )}

            {tab === 'reserver' && <BookingWizard doctor={doc} onFinished={handleBooked} />}

            {tab === 'messages' && (
                <GlassCard id="consultation-messages-panel" className="p-5 w-full">
                    <h3 className="font-bold text-brand-ink mb-4 flex items-center gap-2">
                        <MessageCircle size={18} className="text-brand-primary" /> Messages avec Dr.{' '}
                        {doc.last_name}
                    </h3>
                    {canMessage ? (
                        <ConsultationMessages
                            apiBase={`/api/v1/gynecologists/${id}/messages`}
                            emptyLabel="Posez une question à votre gynécologue."
                        />
                    ) : (
                        <div className="text-center py-10 px-4">
                            <Clock size={36} className="text-brand-border mx-auto mb-3" />
                            <p className="text-brand-ink font-semibold mb-1">Messagerie indisponible</p>
                            <p className="text-sm text-brand-muted max-w-md mx-auto">
                                Vous pourrez envoyer un message à ce praticien une fois qu&apos;il aura confirmé
                                votre rendez-vous.
                            </p>
                            {myAppts.some((a) => a.status === 'pending') && (
                                <button
                                    type="button"
                                    onClick={() => setTab('rdv')}
                                    className="btn-secondary text-sm mt-4 inline-flex items-center gap-2"
                                >
                                    <Clock size={16} />
                                    Voir mes RDV en attente
                                </button>
                            )}
                        </div>
                    )}
                </GlassCard>
            )}
        </AppLayout>
    );
}
