import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import GynecologistLayout from '@/Layouts/GynecologistLayout';
import GlassCard from '@/Components/UI/GlassCard';
import Modal from '@/Components/Common/Modal';
import StatTile from '@/Components/UI/StatTile';
import { DonutChart } from '@/Components/UI/Charts';
import {
    DataTable,
    DataTableToolbar,
    DataTableScroll,
    DataTableEmpty,
    DataTableLoading,
} from '@/Components/UI/DataTable';
import StatusBadge from '@/Components/UI/StatusBadge';
import FilterPills from '@/Components/UI/FilterPills';
import {
    TableActionGroup,
    TableActionLink,
    TableActionButton,
    TableActionExternalLink,
} from '@/Components/UI/TableActions';
import { priorityClass, priorityLabel } from '@/utils/statusBadges';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useDeferredLoading } from '@/hooks/useDeferredLoading';
import {
    Calendar,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Users,
    Video,
    X,
    ArrowRight,
    CalendarDays,
    Search,
    FileText,
    CalendarX,
    Loader2,
} from 'lucide-react';

const APPOINTMENT_CHART_COLORS = {
    pending: '#D97706',
    confirmed: '#059669',
    completed: '#853953',
    cancelled: '#DC2626',
};

const FILTER_OPTIONS = [
    { value: 'all', label: 'Tous' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmés' },
    { value: 'completed', label: 'Terminés' },
    { value: 'cancelled', label: 'Refusés' },
];

function StatSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                    <div className="h-3 w-20 bg-brand-border/60 rounded mb-3" />
                    <div className="h-8 w-12 bg-brand-border/60 rounded" />
                </div>
            ))}
        </div>
    );
}

function RefuseModal({ appointment, onClose, onConfirm, saving }) {
    const [reason, setReason] = useState('');

    useEffect(() => {
        setReason('');
    }, [appointment?.id]);

    const appointmentDate = appointment?.start_time
        ? new Date(appointment.start_time).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : null;
    const appointmentTime = appointment?.start_time
        ? new Date(appointment.start_time).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    return (
        <Modal show={!!appointment} onClose={onClose} maxWidth="md" solid closeable={!saving}>
            <div className="flex flex-col max-h-[min(90vh,520px)]">
                <div className="px-6 py-5 border-b border-brand-border bg-white shrink-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                                <CalendarX size={22} className="text-red-600" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg font-bold text-brand-ink leading-tight">
                                    Refuser le rendez-vous
                                </h2>
                                <p className="text-sm text-brand-muted mt-1">
                                    La patiente sera notifiée de votre décision.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="p-2 rounded-lg text-brand-muted hover:text-brand-ink hover:bg-brand-bg transition-colors shrink-0 disabled:opacity-50"
                            aria-label="Fermer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                    {appointment && (
                        <div className="p-4 rounded-xl bg-brand-bg/60 border border-brand-border">
                            <p className="font-semibold text-brand-ink">{appointment.patient_name}</p>
                            {appointment.patient_email && (
                                <p className="text-xs text-brand-muted mt-0.5">{appointment.patient_email}</p>
                            )}
                            {appointmentDate && (
                                <p className="text-sm text-brand-muted mt-2 flex items-center gap-1.5">
                                    <Calendar size={14} className="shrink-0 text-brand-primary" />
                                    <span className="capitalize">{appointmentDate}</span>
                                    {appointmentTime && <span>· {appointmentTime}</span>}
                                </p>
                            )}
                            {appointment.reason && (
                                <p className="text-sm text-brand-ink mt-2 pt-2 border-t border-brand-border/80">
                                    {appointment.reason}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label htmlFor="refusal-reason" className="block text-sm font-semibold text-brand-ink mb-2">
                            Motif du refus{' '}
                            <span className="font-normal text-brand-muted">(optionnel)</span>
                        </label>
                        <textarea
                            id="refusal-reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            placeholder="Expliquez brièvement pourquoi vous refusez ce créneau…"
                            disabled={saving}
                            className="input-field resize-none min-h-[100px] disabled:opacity-60"
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-brand-border bg-brand-bg/30 shrink-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="btn-secondary text-sm inline-flex items-center justify-center gap-1.5 py-2.5 sm:min-w-[120px] disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={() => appointment && onConfirm(appointment.id, reason)}
                        disabled={saving}
                        className="text-sm inline-flex items-center justify-center gap-2 py-2.5 px-5 sm:min-w-[160px] rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Refus en cours…
                            </>
                        ) : (
                            'Confirmer le refus'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

function PendingAlert({ count, onAction }) {
    if (!count) return null;

    return (
        <GlassCard className="p-4 border-amber-200/80 bg-amber-50/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-100/80 text-amber-700 shrink-0">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <p className="font-semibold text-brand-text">
                            {count} demande{count > 1 ? 's' : ''} en attente
                        </p>
                        <p className="text-sm text-brand-muted mt-0.5">
                            Validez ou refusez les rendez-vous proposés par vos patientes.
                        </p>
                    </div>
                </div>
                <button type="button" onClick={onAction} className="btn-primary text-sm px-4 py-2 shrink-0">
                    Traiter maintenant
                </button>
            </div>
        </GlassCard>
    );
}

function AppointmentTable({
    list,
    loading,
    filter,
    onFilterChange,
    onConfirm,
    onComplete,
    onRefuse,
    actionLoading,
    showToolbarLink = false,
    isFullPage = false,
    search = '',
    onSearchChange,
    filterCounts = {},
}) {
    const filtered = useMemo(() => {
        let result = filter === 'all' ? list : list.filter((a) => a.status === filter);

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter(
                (a) =>
                    a.patient_name?.toLowerCase().includes(q) ||
                    a.patient_email?.toLowerCase().includes(q) ||
                    a.reason?.toLowerCase().includes(q),
            );
        }

        if (filter === 'all') {
            const order = { pending: 0, confirmed: 1, completed: 2, cancelled: 3 };
            result = [...result].sort((a, b) => {
                const statusDiff = (order[a.status] ?? 4) - (order[b.status] ?? 4);
                if (statusDiff !== 0) return statusDiff;
                return new Date(a.start_time) - new Date(b.start_time);
            });
        }

        return result;
    }, [list, filter, search]);

    const columns = [
        {
            key: 'patient',
            header: 'Patiente',
            cell: (row) => (
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-brand-text">{row.patient_name}</p>
                        {row.is_first_visit && (
                            <span className="status-badge badge-pending text-[10px]">1ère visite</span>
                        )}
                    </div>
                    <p className="text-xs text-brand-muted">{row.patient_email}</p>
                </div>
            ),
        },
        {
            key: 'datetime',
            header: 'Date & heure',
            cell: (row) => (
                <div>
                    <p className="text-sm text-brand-text">
                        {new Date(row.start_time).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                        })}
                    </p>
                    <p className="text-xs text-brand-muted">
                        {new Date(row.start_time).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        {' – '}
                        {new Date(row.end_time).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>
            ),
        },
        {
            key: 'reason',
            header: 'Motif',
            cell: (row) => (
                <div className="max-w-[180px]">
                    <p className="text-sm text-brand-text truncate" title={row.reason || undefined}>
                        {row.reason || '—'}
                    </p>
                    {row.patient_preparation && (
                        <p className="text-[11px] text-brand-primary flex items-center gap-1 mt-0.5 truncate" title={row.patient_preparation}>
                            <FileText size={11} className="shrink-0" />
                            Préparation patiente
                        </p>
                    )}
                </div>
            ),
            thClass: isFullPage ? undefined : 'hidden lg:table-cell',
            tdClass: isFullPage ? undefined : 'hidden lg:table-cell',
        },
        {
            key: 'type',
            header: 'Type',
            cell: (row) => (
                <span className="text-sm text-brand-muted">
                    {row.consultation_type === 'video' ? 'Vidéo' : 'Cabinet'}
                </span>
            ),
            thClass: 'hidden md:table-cell',
            tdClass: 'hidden md:table-cell',
        },
        {
            key: 'priority',
            header: 'Priorité',
            cell: (row) => (
                <span className={`status-badge ${priorityClass(row.priority)}`}>
                    {priorityLabel(row.priority)}
                </span>
            ),
            thClass: 'hidden lg:table-cell',
            tdClass: 'hidden lg:table-cell',
        },
        {
            key: 'status',
            header: 'Statut',
            cell: (row) => <StatusBadge status={row.status} />,
        },
        {
            key: 'actions',
            header: 'Actions',
            thClass: 'text-right',
            tdClass: 'text-right',
            cell: (row) => (
                <TableActionGroup className="flex-wrap justify-end">
                    <TableActionLink href={`/gynecologist/patients/${row.user_id}`} icon={Users}>
                        Dossier
                    </TableActionLink>
                    {row.status === 'pending' && (
                        <>
                            <TableActionButton
                                onClick={() => onConfirm(row.id)}
                                disabled={actionLoading === row.id}
                            >
                                Confirmer
                            </TableActionButton>
                            <TableActionButton danger onClick={() => onRefuse(row)}>
                                Refuser
                            </TableActionButton>
                        </>
                    )}
                    {row.status === 'confirmed' && (
                        <>
                            {row.video_call_available && row.consultation_type === 'video' && (
                                <TableActionExternalLink
                                    href={`https://meet.jit.si/feminasante-${row.id}`}
                                    icon={Video}
                                    title="Rejoindre la visio"
                                    danger={false}
                                />
                            )}
                            <TableActionButton
                                onClick={() => onComplete(row.id)}
                                disabled={actionLoading === row.id}
                            >
                                Terminer
                            </TableActionButton>
                        </>
                    )}
                </TableActionGroup>
            ),
        },
    ];

    return (
        <DataTable>
            <DataTableToolbar className="!flex-col lg:!flex-row !items-stretch lg:!items-center justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-base font-bold text-brand-ink">
                        {isFullPage ? 'Liste des rendez-vous' : 'Rendez-vous'}
                    </h2>
                    <p className="text-xs text-brand-muted mt-0.5">
                        {loading
                            ? 'Chargement…'
                            : filter === 'pending'
                              ? `${filtered.length} demande${filtered.length > 1 ? 's' : ''} en attente`
                              : `${filtered.length} rendez-vous${search.trim() ? ' trouvé(s)' : ''}`}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    {isFullPage && onSearchChange && (
                        <div className="relative flex-1 sm:flex-initial">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                            <input
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Patiente, e-mail, motif…"
                                className="input-field pl-9 w-full sm:w-64 py-2.5"
                            />
                        </div>
                    )}
                    <FilterPills options={FILTER_OPTIONS} value={filter} onChange={onFilterChange} counts={filterCounts} />
                    {showToolbarLink && (
                        <Link
                            href="/gynecologist/appointments"
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline whitespace-nowrap"
                        >
                            Voir tout
                            <ArrowRight size={14} />
                        </Link>
                    )}
                </div>
            </DataTableToolbar>
            <DataTableScroll>
                {loading ? (
                    <DataTableLoading />
                ) : filtered.length === 0 ? (
                    <DataTableEmpty>
                        {search.trim()
                            ? 'Aucun rendez-vous ne correspond à votre recherche.'
                            : 'Aucun rendez-vous pour ce filtre.'}
                    </DataTableEmpty>
                ) : (
                    <table className="fs-table">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} className={col.thClass}>
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((row) => (
                                <tr key={row.id}>
                                    {columns.map((col) => (
                                        <td key={col.key} className={col.tdClass}>
                                            {col.cell(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </DataTableScroll>
        </DataTable>
    );
}

export default function Dashboard() {
    const { url } = usePage();
    const isAppointmentsPage = url.startsWith('/gynecologist/appointments');
    const initialStatus = new URLSearchParams(window.location.search).get('status') || 'all';
    const validStatuses = FILTER_OPTIONS.map((o) => o.value);

    const [filter, setFilter] = useState(
        isAppointmentsPage
            ? (validStatuses.includes(initialStatus) ? initialStatus : 'all')
            : 'pending',
    );
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [refuseModal, setRefuseModal] = useState(null);
    const [saving, setSaving] = useState(false);

    const { data, isInitialLoading, refetch: fetchDashboard } = useApiQuery(
        'gynecologist:dashboard',
        () => window.axios.get('/api/v1/gynecologist/dashboard').then((r) => r.data),
    );
    const showSkeleton = useDeferredLoading(isInitialLoading);

    const stats = data?.stats ?? {};
    const profile = data?.profile ?? {};
    const list = data?.appointments ?? [];

    const cancelledCount = useMemo(
        () => list.filter((a) => a.status === 'cancelled').length,
        [list],
    );

    const chartSegments = useMemo(
        () => [
            { label: 'En attente', value: stats.pending_appointments || 0, color: APPOINTMENT_CHART_COLORS.pending },
            { label: 'Confirmés', value: stats.confirmed_appointments || 0, color: APPOINTMENT_CHART_COLORS.confirmed },
            { label: 'Terminés', value: stats.completed_appointments || 0, color: APPOINTMENT_CHART_COLORS.completed },
            { label: 'Refusés', value: cancelledCount, color: APPOINTMENT_CHART_COLORS.cancelled },
        ],
        [stats, cancelledCount],
    );

    const filterCounts = useMemo(
        () => ({
            all: list.length,
            pending: list.filter((a) => a.status === 'pending').length,
            confirmed: list.filter((a) => a.status === 'confirmed').length,
            completed: list.filter((a) => a.status === 'completed').length,
            cancelled: list.filter((a) => a.status === 'cancelled').length,
        }),
        [list],
    );

    const handleFilterChange = (value) => {
        setFilter(value);
        if (isAppointmentsPage) {
            const nextUrl = new URL(window.location.href);
            if (value === 'all') nextUrl.searchParams.delete('status');
            else nextUrl.searchParams.set('status', value);
            window.history.replaceState({}, '', nextUrl);
        }
    };

    const handleConfirm = async (id) => {
        setActionLoading(id);
        try {
            await window.axios.put(`/api/v1/gynecologist/appointments/${id}/confirm`);
            fetchDashboard();
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(null);
        }
    };

    const handleComplete = async (id) => {
        setActionLoading(id);
        try {
            await window.axios.put(`/api/v1/gynecologist/appointments/${id}/complete`);
            fetchDashboard();
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRefuse = async (id, reason) => {
        setSaving(true);
        try {
            await window.axios.put(`/api/v1/gynecologist/appointments/${id}/refuse`, { reason });
            setRefuseModal(null);
            fetchDashboard();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const pageTitle = isAppointmentsPage ? 'Rendez-vous' : 'Tableau de bord';

    return (
        <GynecologistLayout title={pageTitle}>
            <Head title={`${pageTitle} - FeminaSante`} />
            <div className="space-y-6">
                {!isAppointmentsPage && (
                    <>
                        <div>
                            <p className="text-sm text-brand-muted">
                                Bonjour,{' '}
                                <span className="font-semibold text-brand-text">
                                    {isInitialLoading ? '…' : `Dr ${data?.gynecologist_name ?? ''}`}
                                </span>
                            </p>
                        </div>

                        {!isInitialLoading && stats.pending_appointments > 0 && (
                            <PendingAlert
                                count={stats.pending_appointments}
                                onAction={() => setFilter('pending')}
                            />
                        )}

                        <GlassCard className="p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-base font-bold text-brand-text">Profil praticien</h2>
                                    <p className="text-sm text-brand-muted mt-1">
                                        {[profile.speciality, profile.city].filter(Boolean).join(' · ') ||
                                            'Complétez votre profil'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    {profile.consultation_duration != null && (
                                        <span className="text-brand-muted">
                                            <span className="font-semibold text-brand-text">
                                                {profile.consultation_duration} min
                                            </span>{' '}
                                            / consultation
                                        </span>
                                    )}
                                    {profile.consultation_fee != null && (
                                        <span className="text-brand-muted">
                                            <span className="font-semibold text-brand-text">
                                                {profile.consultation_fee} MAD
                                            </span>{' '}
                                            / séance
                                        </span>
                                    )}
                                </div>
                            </div>
                        </GlassCard>

                        {showSkeleton ? (
                            <StatSkeleton />
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatTile
                                    label="Aujourd'hui"
                                    value={stats.today_appointments ?? 0}
                                    icon={Calendar}
                                    onClick={() => setFilter('all')}
                                />
                                <StatTile
                                    label="En attente"
                                    value={stats.pending_appointments ?? 0}
                                    icon={Clock}
                                    onClick={() => setFilter('pending')}
                                />
                                <StatTile
                                    label="Confirmés"
                                    value={stats.confirmed_appointments ?? 0}
                                    icon={CheckCircle2}
                                    onClick={() => setFilter('confirmed')}
                                />
                                <StatTile
                                    label="Urgences"
                                    value={stats.emergency_patients ?? 0}
                                    icon={AlertTriangle}
                                    onClick={() => setFilter('all')}
                                />
                            </div>
                        )}

                        <div className="grid lg:grid-cols-2 gap-6">
                            <GlassCard className="p-5">
                                <h2 className="text-base font-bold text-brand-text mb-4">Répartition des RDV</h2>
                                {showSkeleton ? (
                                    <div className="h-48 animate-pulse bg-brand-border/30 rounded-xl" />
                                ) : (
                                    <DonutChart segments={chartSegments} />
                                )}
                            </GlassCard>

                            <GlassCard className="p-5">
                                <h2 className="text-base font-bold text-brand-text mb-4">Accès rapide</h2>
                                <div className="space-y-2">
                                    <Link
                                        href="/gynecologist/availability"
                                        className="flex items-center justify-between p-3 rounded-xl border border-brand-border bg-white/42 hover:bg-brand-bg/60 surface-transition group"
                                    >
                                        <span className="flex items-center gap-3 text-sm font-semibold text-brand-text">
                                            <CalendarDays size={18} className="text-brand-primary" />
                                            Disponibilités
                                        </span>
                                        <ArrowRight
                                            size={16}
                                            className="text-brand-muted group-hover:text-brand-primary transition-colors"
                                        />
                                    </Link>
                                    <Link
                                        href="/gynecologist/patients"
                                        className="flex items-center justify-between p-3 rounded-xl border border-brand-border bg-white/42 hover:bg-brand-bg/60 surface-transition group"
                                    >
                                        <span className="flex items-center gap-3 text-sm font-semibold text-brand-text">
                                            <Users size={18} className="text-brand-primary" />
                                            Mes patientes
                                        </span>
                                        <ArrowRight
                                            size={16}
                                            className="text-brand-muted group-hover:text-brand-primary transition-colors"
                                        />
                                    </Link>
                                    <Link
                                        href="/gynecologist/appointments"
                                        className="flex items-center justify-between p-3 rounded-xl border border-brand-border bg-white/42 hover:bg-brand-bg/60 surface-transition group"
                                    >
                                        <span className="flex items-center gap-3 text-sm font-semibold text-brand-text">
                                            <Calendar size={18} className="text-brand-primary" />
                                            Tous les rendez-vous
                                        </span>
                                        <ArrowRight
                                            size={16}
                                            className="text-brand-muted group-hover:text-brand-primary transition-colors"
                                        />
                                    </Link>
                                </div>
                            </GlassCard>
                        </div>
                    </>
                )}

                {isAppointmentsPage && (
                    <>
                        <p className="text-brand-muted text-sm">
                            Gérez l&apos;ensemble de vos rendez-vous — confirmation et visio.
                        </p>

                        {!isInitialLoading && stats.pending_appointments > 0 && (
                            <PendingAlert
                                count={stats.pending_appointments}
                                onAction={() => handleFilterChange('pending')}
                            />
                        )}

                        {showSkeleton ? (
                            <StatSkeleton />
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatTile
                                    label="En attente"
                                    value={stats.pending_appointments ?? 0}
                                    icon={Clock}
                                    onClick={() => handleFilterChange('pending')}
                                />
                                <StatTile
                                    label="Confirmés"
                                    value={stats.confirmed_appointments ?? 0}
                                    icon={CheckCircle2}
                                    onClick={() => handleFilterChange('confirmed')}
                                />
                                <StatTile
                                    label="Aujourd'hui"
                                    value={stats.today_appointments ?? 0}
                                    icon={Calendar}
                                    onClick={() => handleFilterChange('all')}
                                />
                                <StatTile
                                    label="Total"
                                    value={stats.total_appointments ?? 0}
                                    icon={CalendarDays}
                                    onClick={() => handleFilterChange('all')}
                                />
                            </div>
                        )}
                    </>
                )}

                <AppointmentTable
                    list={list}
                    loading={showSkeleton}
                    filter={filter}
                    onFilterChange={handleFilterChange}
                    onConfirm={handleConfirm}
                    onComplete={handleComplete}
                    onRefuse={setRefuseModal}
                    actionLoading={actionLoading}
                    showToolbarLink={!isAppointmentsPage}
                    isFullPage={isAppointmentsPage}
                    search={search}
                    onSearchChange={isAppointmentsPage ? setSearch : undefined}
                    filterCounts={isAppointmentsPage ? filterCounts : undefined}
                />
            </div>

            <RefuseModal
                appointment={refuseModal}
                onClose={() => setRefuseModal(null)}
                onConfirm={handleRefuse}
                saving={saving}
            />
        </GynecologistLayout>
    );
}
