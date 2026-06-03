import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import GynecologistLayout from '@/Layouts/GynecologistLayout';
import StatTile from '@/Components/UI/StatTile';
import StatusBadge from '@/Components/UI/StatusBadge';
import {
    DataTable,
    DataTableToolbar,
    DataTableScroll,
    DataTableEmpty,
    DataTableLoading,
} from '@/Components/UI/DataTable';
import { TableActionLink } from '@/Components/UI/TableActions';
import FilterPills from '@/Components/UI/FilterPills';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useDeferredLoading } from '@/hooks/useDeferredLoading';
import { priorityClass, priorityLabel } from '@/utils/statusBadges';
import { Search, User, Calendar, FileText, Users, AlertTriangle, Clock, Loader2 } from 'lucide-react';

const PRIORITY_FILTERS = [
    { value: 'all', label: 'Toutes' },
    { value: 'emergency', label: 'Urgences' },
    { value: 'follow_up', label: 'Suivi' },
    { value: 'routine', label: 'Routine' },
];

const fmt = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';

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

export default function GynecologistPatients() {
    const validPriorities = PRIORITY_FILTERS.map((o) => o.value);
    const initialPriority = new URLSearchParams(window.location.search).get('priority') || 'all';

    const [query, setQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState(
        validPriorities.includes(initialPriority) ? initialPriority : 'all',
    );

    const { data, isInitialLoading } = useApiQuery(
        'gynecologist:patients',
        () =>
            window.axios
                .get('/api/v1/gynecologist/patients')
                .then((r) => (Array.isArray(r.data) ? r.data : []))
                .catch(() => []),
    );
    const patients = Array.isArray(data) ? data : [];
    const showSkeleton = useDeferredLoading(isInitialLoading);

    const stats = useMemo(
        () => ({
            total: patients.length,
            emergency: patients.filter((p) => p.priority === 'emergency').length,
            followUp: patients.filter((p) => p.priority === 'follow_up').length,
            upcoming: patients.filter((p) => p.next_appointment).length,
        }),
        [patients],
    );

    const filterCounts = useMemo(
        () => ({
            all: patients.length,
            emergency: stats.emergency,
            follow_up: stats.followUp,
            routine: patients.filter((p) => p.priority === 'routine').length,
        }),
        [patients, stats],
    );

    const filtered = useMemo(() => {
        let result = patients;

        if (priorityFilter !== 'all') {
            result = result.filter((p) => p.priority === priorityFilter);
        }

        if (query.trim()) {
            const q = query.trim().toLowerCase();
            result = result.filter(
                (p) => p.nom?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q),
            );
        }

        return result;
    }, [patients, priorityFilter, query]);

    const handlePriorityChange = (value) => {
        setPriorityFilter(value);
        const nextUrl = new URL(window.location.href);
        if (value === 'all') nextUrl.searchParams.delete('priority');
        else nextUrl.searchParams.set('priority', value);
        window.history.replaceState({}, '', nextUrl);
    };

    return (
        <GynecologistLayout title="Mes patientes">
            <Head title="Mes patientes - FeminaSante" />

            <div className="space-y-6">
                <p className="text-brand-muted text-sm">
                    Patientes avec lesquelles vous avez eu ou aurez un rendez-vous.
                </p>

                {showSkeleton ? (
                    <StatSkeleton />
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatTile
                            label="Total"
                            value={stats.total}
                            icon={Users}
                            onClick={() => handlePriorityChange('all')}
                        />
                        <StatTile
                            label="Urgences"
                            value={stats.emergency}
                            icon={AlertTriangle}
                            onClick={() => handlePriorityChange('emergency')}
                        />
                        <StatTile
                            label="Suivi"
                            value={stats.followUp}
                            icon={Clock}
                            onClick={() => handlePriorityChange('follow_up')}
                        />
                        <StatTile
                            label="RDV à venir"
                            value={stats.upcoming}
                            icon={Calendar}
                            href="/gynecologist/appointments?status=confirmed"
                        />
                    </div>
                )}

                <DataTable>
                    <DataTableToolbar className="!flex-col lg:!flex-row !items-stretch lg:!items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-base font-bold text-brand-ink">Liste des patientes</h2>
                            <p className="text-xs text-brand-muted mt-0.5">
                                {showSkeleton
                                    ? 'Chargement…'
                                    : `${filtered.length} patiente${filtered.length > 1 ? 's' : ''}${query.trim() ? ' trouvée(s)' : ''}`}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 sm:flex-initial">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
                                />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Nom, e-mail…"
                                    className="input-field pl-9 w-full sm:w-64 py-2.5"
                                />
                            </div>
                            <FilterPills
                                options={PRIORITY_FILTERS}
                                value={priorityFilter}
                                onChange={handlePriorityChange}
                                counts={filterCounts}
                            />
                        </div>
                    </DataTableToolbar>

                    {showSkeleton ? (
                        <DataTableLoading>
                            <Loader2 className="animate-spin text-brand-primary w-6 h-6 mx-auto" />
                        </DataTableLoading>
                    ) : filtered.length === 0 ? (
                        <DataTableEmpty>
                            <User size={32} className="text-brand-border mx-auto mb-2" />
                            {query.trim() || priorityFilter !== 'all'
                                ? 'Aucune patiente ne correspond à vos critères.'
                                : 'Aucune patiente pour le moment.'}
                        </DataTableEmpty>
                    ) : (
                        <DataTableScroll>
                            <table className="fs-table">
                                <thead>
                                    <tr>
                                        <th>Patiente</th>
                                        <th className="hidden sm:table-cell">E-mail</th>
                                        <th>Priorité</th>
                                        <th className="hidden lg:table-cell">Dernier RDV</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((p) => (
                                        <tr key={p.id}>
                                            <td>
                                                <p className="font-semibold text-brand-ink">{p.nom}</p>
                                                <p className="text-xs text-brand-muted sm:hidden">{p.email}</p>
                                                {p.age != null && (
                                                    <p className="text-[11px] text-brand-muted mt-0.5">
                                                        {p.age} ans · {p.appointments_count} RDV
                                                    </p>
                                                )}
                                            </td>
                                            <td className="text-brand-muted hidden sm:table-cell">{p.email}</td>
                                            <td>
                                                <span className={`status-badge ${priorityClass(p.priority)}`}>
                                                    {priorityLabel(p.priority)}
                                                </span>
                                            </td>
                                            <td className="hidden lg:table-cell whitespace-nowrap">
                                                {p.last_appointment ? (
                                                    <div>
                                                        <p className="text-sm text-brand-muted">
                                                            {fmt(p.last_appointment.start_time)}
                                                        </p>
                                                        <StatusBadge
                                                            status={p.last_appointment.status}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-brand-muted">—</span>
                                                )}
                                            </td>
                                            <td className="text-right">
                                                <TableActionLink
                                                    href={`/gynecologist/patients/${p.id}`}
                                                    icon={FileText}
                                                >
                                                    Dossier
                                                </TableActionLink>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </DataTableScroll>
                    )}
                </DataTable>
            </div>
        </GynecologistLayout>
    );
}
