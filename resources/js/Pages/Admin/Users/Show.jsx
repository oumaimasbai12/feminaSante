import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import GlassCard from '@/Components/UI/GlassCard';
import StatTile from '@/Components/UI/StatTile';
import StatusBadge from '@/Components/UI/StatusBadge';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import {
    DataTable,
    DataTableToolbar,
    DataTableScroll,
} from '@/Components/UI/DataTable';
import { TableActionButton } from '@/Components/UI/TableActions';
import { Head, Link, router } from '@inertiajs/react';
import {
    Heart,
    Baby,
    Moon,
    Calendar,
    Brain,
    Cake,
    ChevronLeft,
    MapPin,
    Clock,
    Trash2,
    AlertTriangle,
} from 'lucide-react';
import { isMenopauseEligible, MENOPAUSE_MIN_AGE } from '@/utils/menopause';

function formatMemberSince(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function formatDateTime(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function menopauseLabel(health, patient) {
    if (health?.active_menopause) {
        const stage = health.active_menopause.stage?.value ?? health.active_menopause.stage;
        return stage ? String(stage).replace(/_/g, ' ') : 'Active';
    }
    return isMenopauseEligible(patient) ? 'À configurer' : `Dès ${MENOPAUSE_MIN_AGE} ans`;
}

function PageSkeleton() {
    return (
        <div className="space-y-6 w-full animate-pulse">
            <div className="glass-card h-32" />
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="glass-card h-28" />
                ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card h-40" />
                <div className="glass-card h-40" />
            </div>
        </div>
    );
}

export default function Show({ userId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        window.axios
            .get(`/api/v1/admin/users/${userId}`)
            .then((r) => {
                setData(r.data?.data || r.data);
                setError('');
            })
            .catch((e) => {
                setData(null);
                setError(e.response?.data?.message || 'Profil inaccessible.');
            })
            .finally(() => setLoading(false));
    }, [userId]);

    const patient = data?.user;
    const stats = data?.stats || {};
    const health = data?.health_overview || {};
    const state = data?.current_state;

    const displayName = patient?.nom || patient?.name || 'Utilisatrice';
    const ini = displayName.charAt(0).toUpperCase();
    const memberSince = patient ? formatMemberSince(patient.created_at) : null;

    const journeyStats = useMemo(() => {
        if (!patient) return [];
        return [
            { label: 'Cycles', value: stats.cycles_count ?? 0, icon: Heart },
            { label: 'Grossesses', value: stats.pregnancies_count ?? 0, icon: Baby },
            {
                label: 'Ménopause',
                value: menopauseLabel(health, patient),
                icon: Moon,
            },
            { label: 'Rendez-vous', value: stats.appointments_count ?? 0, icon: Calendar },
            { label: 'Quiz', value: stats.quiz_results_count ?? 0, icon: Brain },
        ];
    }, [patient, stats, health]);

    const handleDelete = async () => {
        if (!patient) return;
        setDeleting(true);
        setDeleteError('');
        try {
            await window.axios.delete(`/api/v1/admin/users/${patient.id}`);
            router.visit('/admin/users');
        } catch (e) {
            setDeleteError(e.response?.data?.message || 'Erreur lors de la suppression.');
            setDeleteOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Profil utilisatrice">
                <Head title="Profil utilisatrice - FeminaSante" />
                <PageSkeleton />
            </AdminLayout>
        );
    }

    if (!patient) {
        return (
            <AdminLayout title="Profil utilisatrice">
                <Head title="Profil utilisatrice - FeminaSante" />
                <GlassCard className="p-8 text-center max-w-md mx-auto">
                    <AlertTriangle size={32} className="text-brand-border mx-auto mb-3" />
                    <p className="text-brand-muted mb-4">{error || 'Compte introuvable.'}</p>
                    <Link
                        href="/admin/users"
                        className="text-brand-primary font-semibold hover:opacity-80 transition-opacity"
                    >
                        Retour à la liste
                    </Link>
                </GlassCard>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={displayName}>
            <Head title={`${displayName} - FeminaSante`} />

            <ConfirmDialog
                open={deleteOpen}
                title="Supprimer le compte"
                message={`Supprimer définitivement ${displayName} ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                danger
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteOpen(false)}
            />

            <div className="space-y-6 w-full">
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 text-sm text-brand-primary font-semibold hover:opacity-80 transition-opacity"
                >
                    <ChevronLeft size={16} /> Retour aux utilisatrices
                </Link>

                {deleteError && (
                    <div className="p-4 rounded-xl text-sm font-medium border bg-red-50/80 border-red-200 text-red-800 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        {deleteError}
                    </div>
                )}

                <GlassCard className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary text-2xl font-bold shrink-0">
                            {ini}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-brand-ink">{displayName}</h2>
                            <p className="text-brand-muted text-sm mt-0.5">{patient.email}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="status-badge badge-inactive">Patiente</span>
                                {patient.age != null && (
                                    <span className="status-badge badge-inactive inline-flex items-center gap-1">
                                        <Cake size={12} />
                                        {patient.age} ans
                                    </span>
                                )}
                                {memberSince && (
                                    <span className="status-badge badge-completed">
                                        Membre depuis {memberSince}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-brand-muted mt-3">
                                Inscrite le{' '}
                                {new Date(patient.created_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                </GlassCard>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {journeyStats.map((item) => (
                        <StatTile
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            icon={item.icon}
                        />
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <GlassCard className="p-5">
                        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                            Parcours actif
                        </p>
                        {state ? (
                            <>
                                <p className="font-bold text-brand-ink">{state.label}</p>
                                {state.detail ? (
                                    <p className="text-sm text-brand-muted mt-0.5 capitalize">
                                        {state.detail}
                                    </p>
                                ) : (
                                    <p className="text-sm text-brand-muted mt-0.5">
                                        Aucun détail supplémentaire
                                    </p>
                                )}
                                {health.current_cycle_day != null && state.mode === 'cycle' && (
                                    <p className="text-xs text-brand-primary mt-2 font-medium">
                                        Jour {health.current_cycle_day} du cycle
                                        {health.days_until_next_period != null &&
                                            health.days_until_next_period >= 0 && (
                                                <>
                                                    {' '}
                                                    · Prochaines règles dans{' '}
                                                    {health.days_until_next_period} j
                                                </>
                                            )}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-brand-muted">Aucun suivi actif</p>
                        )}
                    </GlassCard>

                    {data.next_appointment ? (
                        <GlassCard className="p-5">
                            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                                Prochain rendez-vous
                            </p>
                            <p className="font-bold text-brand-ink">
                                Dr. {data.next_appointment.gynecologist?.first_name}{' '}
                                {data.next_appointment.gynecologist?.last_name}
                            </p>
                            <p className="text-sm text-brand-muted flex items-center gap-1.5 mt-1">
                                <Clock size={14} />
                                {formatDateTime(data.next_appointment.start_time)}
                            </p>
                            {data.next_appointment.gynecologist?.city && (
                                <p className="text-sm text-brand-muted flex items-center gap-1.5 mt-1">
                                    <MapPin size={14} />
                                    {data.next_appointment.gynecologist.city}
                                </p>
                            )}
                            <StatusBadge
                                status={data.next_appointment.status}
                                className="mt-3"
                            />
                        </GlassCard>
                    ) : (
                        <GlassCard className="p-5">
                            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                                Prochain rendez-vous
                            </p>
                            <p className="text-sm text-brand-muted">Aucun rendez-vous à venir</p>
                        </GlassCard>
                    )}
                </div>

                <p className="text-sm text-brand-muted">
                    Aperçu du parcours santé — identique à ce que voit la patiente dans son profil.
                </p>

                {(data.appointments?.length || 0) > 0 && (
                    <DataTable>
                        <DataTableToolbar>
                            <div>
                                <h3 className="font-bold text-brand-ink">Rendez-vous récents</h3>
                                <p className="text-xs text-brand-muted mt-0.5">
                                    {data.appointments.length} rendez-vous
                                </p>
                            </div>
                        </DataTableToolbar>
                        <DataTableScroll>
                            <table className="fs-table">
                                <thead>
                                    <tr>
                                        <th>Praticien</th>
                                        <th className="hidden sm:table-cell">Date</th>
                                        <th className="hidden md:table-cell">Motif</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.appointments.map((a) => (
                                        <tr key={a.id}>
                                            <td>
                                                <p className="font-semibold text-brand-ink">
                                                    Dr. {a.gynecologist?.first_name}{' '}
                                                    {a.gynecologist?.last_name}
                                                </p>
                                                <p className="text-xs text-brand-muted sm:hidden">
                                                    {formatDateTime(a.start_time)}
                                                </p>
                                            </td>
                                            <td className="text-brand-muted hidden sm:table-cell whitespace-nowrap">
                                                {formatDateTime(a.start_time)}
                                            </td>
                                            <td className="text-brand-muted hidden md:table-cell max-w-[180px] truncate">
                                                {a.reason || '—'}
                                            </td>
                                            <td>
                                                <StatusBadge status={a.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </DataTableScroll>
                    </DataTable>
                )}

                {(data.cycles?.length || 0) > 0 && (
                    <GlassCard className="p-6">
                        <h3 className="text-base font-bold text-brand-ink mb-4">Cycles récents</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {data.cycles.map((c) => (
                                <div
                                    key={c.id}
                                    className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border text-sm"
                                >
                                    <span className="font-semibold text-brand-ink">
                                        {new Date(c.start_date).toLocaleDateString('fr-FR')}
                                    </span>
                                    {c.flow_intensity && (
                                        <p className="text-xs text-brand-muted mt-1">
                                            Flux {c.flow_intensity}
                                        </p>
                                    )}
                                    {c.mood && (
                                        <p className="text-xs text-brand-muted">Humeur {c.mood}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                )}

                <div className="flex justify-end">
                    <TableActionButton
                        type="button"
                        icon={Trash2}
                        danger
                        onClick={() => setDeleteOpen(true)}
                        className="px-5 py-3"
                    >
                        Supprimer le compte
                    </TableActionButton>
                </div>
            </div>
        </AdminLayout>
    );
}
