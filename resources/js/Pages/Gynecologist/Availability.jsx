import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import GynecologistLayout from '@/Layouts/GynecologistLayout';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import GlassCard from '@/Components/UI/GlassCard';
import FilterPills from '@/Components/UI/FilterPills';
import StatTile from '@/Components/UI/StatTile';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useDeferredLoading } from '@/hooks/useDeferredLoading';
import {
    DataTable,
    DataTableToolbar,
    DataTableScroll,
    DataTableEmpty,
    DataTableLoading,
} from '@/Components/UI/DataTable';
import { TableActionIconButton } from '@/Components/UI/TableActions';
import {
    Plus,
    Trash2,
    Loader2,
    CalendarClock,
    CheckCircle2,
    AlertTriangle,
    Calendar,
    CalendarDays,
    Clock,
    Search,
} from 'lucide-react';

const WEEKDAYS = [
    { value: 1, label: 'Lun' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Mer' },
    { value: 4, label: 'Jeu' },
    { value: 5, label: 'Ven' },
    { value: 6, label: 'Sam' },
    { value: 0, label: 'Dim' },
];

const TIME_PRESETS = [
    { id: 'morning', label: 'Matin', start: '09:00', end: '12:00' },
    { id: 'afternoon', label: 'Après-midi', start: '14:00', end: '17:00' },
    { id: 'full', label: 'Journée', start: '09:00', end: '17:00' },
];

const TABLE_FILTERS = [
    { value: 'all', label: 'Tous' },
    { value: 'week', label: '7 jours' },
    { value: 'month', label: '30 jours' },
];

const DAYS_AHEAD = 28;

function toDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

function buildUpcomingDays(count = DAYS_AHEAD) {
    const today = startOfToday();
    return Array.from({ length: count }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return {
            key: toDateKey(date),
            date,
            weekday: date.getDay(),
            dayNum: date.getDate(),
            month: date.toLocaleDateString('fr-FR', { month: 'short' }),
            weekdayLabel: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        };
    });
}

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

export default function GynecologistAvailability() {
    const { data, isInitialLoading, refetch: load } = useApiQuery(
        'gynecologist:availabilities',
        () =>
            window.axios
                .get('/api/v1/gynecologist/availabilities')
                .then((r) => (Array.isArray(r.data) ? r.data : []))
                .catch(() => []),
    );
    const slots = Array.isArray(data) ? data : [];
    const showSkeleton = useDeferredLoading(isInitialLoading);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('12:00');
    const [activePreset, setActivePreset] = useState('morning');
    const [feedback, setFeedback] = useState(null);
    const [tableFilter, setTableFilter] = useState('all');
    const [tableQuery, setTableQuery] = useState('');

    const upcomingDays = useMemo(() => buildUpcomingDays(), []);

    useEffect(() => {
        if (!feedback) return undefined;
        const t = setTimeout(() => setFeedback(null), 5000);
        return () => clearTimeout(t);
    }, [feedback]);

    const slotDateKeys = useMemo(
        () => new Set(slots.map((s) => toDateKey(new Date(s.date)))),
        [slots],
    );

    const isDayBlocked = (key) => slotDateKeys.has(key);

    const selectableDayKeys = useMemo(
        () => upcomingDays.filter((d) => !slotDateKeys.has(d.key)).map((d) => d.key),
        [upcomingDays, slotDateKeys],
    );

    useEffect(() => {
        setSelectedDates((prev) => prev.filter((k) => !slotDateKeys.has(k)));
    }, [slotDateKeys]);

    const stats = useMemo(() => {
        const today = startOfToday();
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);

        const uniqueDays = new Set(slots.map((s) => toDateKey(new Date(s.date)))).size;
        const thisWeek = slots.filter((s) => {
            const d = new Date(s.date);
            return d >= today && d < weekEnd;
        }).length;

        const sorted = [...slots].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || String(a.start_time).localeCompare(String(b.start_time)),
        );
        const next = sorted[0];

        return {
            total: slots.length,
            uniqueDays,
            thisWeek,
            nextLabel: next
                ? new Date(next.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                : '—',
        };
    }, [slots]);

    const tableFilterCounts = useMemo(() => {
        const today = startOfToday();
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        const monthEnd = new Date(today);
        monthEnd.setDate(today.getDate() + 30);

        return {
            all: slots.length,
            week: slots.filter((s) => {
                const d = new Date(s.date);
                return d >= today && d < weekEnd;
            }).length,
            month: slots.filter((s) => {
                const d = new Date(s.date);
                return d >= today && d < monthEnd;
            }).length,
        };
    }, [slots]);

    const filteredSlots = useMemo(() => {
        const today = startOfToday();
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        const monthEnd = new Date(today);
        monthEnd.setDate(today.getDate() + 30);

        let result = slots;

        if (tableFilter === 'week') {
            result = result.filter((s) => {
                const d = new Date(s.date);
                return d >= today && d < weekEnd;
            });
        } else if (tableFilter === 'month') {
            result = result.filter((s) => {
                const d = new Date(s.date);
                return d >= today && d < monthEnd;
            });
        }

        if (tableQuery.trim()) {
            const q = tableQuery.trim().toLowerCase();
            result = result.filter((s) => {
                const label = new Date(s.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                }).toLowerCase();
                const time = `${String(s.start_time).slice(0, 5)} ${String(s.end_time).slice(0, 5)}`;
                return label.includes(q) || time.includes(q);
            });
        }

        return result;
    }, [slots, tableFilter, tableQuery]);

    const toggleDate = (key) => {
        if (isDayBlocked(key)) return;
        setSelectedDates((prev) =>
            prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key],
        );
    };

    const toggleWeekday = (weekday) => {
        const keys = upcomingDays
            .filter((d) => d.weekday === weekday && !isDayBlocked(d.key))
            .map((d) => d.key);
        if (keys.length === 0) return;
        const allSelected = keys.every((k) => selectedDates.includes(k));
        setSelectedDates((prev) => {
            if (allSelected) return prev.filter((k) => !keys.includes(k));
            return [...new Set([...prev, ...keys])];
        });
    };

    const isWeekdayFullySelected = (weekday) => {
        const keys = upcomingDays
            .filter((d) => d.weekday === weekday && !isDayBlocked(d.key))
            .map((d) => d.key);
        return keys.length > 0 && keys.every((k) => selectedDates.includes(k));
    };

    const applyPreset = (preset) => {
        setActivePreset(preset.id);
        setStartTime(preset.start);
        setEndTime(preset.end);
    };

    const add = async (e) => {
        e.preventDefault();
        if (selectedDates.length === 0) {
            setFeedback({ type: 'error', message: 'Sélectionnez au moins un jour.' });
            return;
        }
        if (startTime >= endTime) {
            setFeedback({ type: 'error', message: "L'heure de fin doit être après l'heure de début." });
            return;
        }

        setSaving(true);
        setFeedback(null);
        try {
            const r = await window.axios.post('/api/v1/gynecologist/availabilities', {
                dates: selectedDates.sort(),
                start_time: startTime,
                end_time: endTime,
            });
            setFeedback({ type: 'success', message: r.data.message || 'Créneaux ajoutés.' });
            setSelectedDates([]);
            load();
        } catch (err) {
            setFeedback({
                type: 'error',
                message:
                    err.response?.data?.message ||
                    Object.values(err.response?.data?.errors || {})[0]?.[0] ||
                    'Erreur',
            });
        }
        setSaving(false);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await window.axios.delete(`/api/v1/gynecologist/availabilities/${deleteId}`);
            setSlots((prev) => prev.filter((s) => s.id !== deleteId));
            setDeleteId(null);
            setFeedback({ type: 'success', message: 'Créneau supprimé.' });
        } catch {
            setFeedback({ type: 'error', message: 'Impossible de supprimer ce créneau.' });
        }
        setDeleting(false);
    };

    const fmtDate = (d) =>
        new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <GynecologistLayout title="Disponibilités">
            <Head title="Disponibilités - FeminaSante" />
            <ConfirmDialog
                open={!!deleteId}
                title="Supprimer le créneau"
                message="Les patientes ne pourront plus réserver sur cette plage horaire."
                confirmLabel="Supprimer"
                danger
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />

            <div className="space-y-6">
                <p className="text-brand-muted text-sm">
                    Choisissez les jours et les horaires où vous acceptez des rendez-vous. Votre profil
                    devient visible dès la première disponibilité ajoutée.
                </p>

                {feedback && (
                    <div
                        className={`p-3 rounded-xl text-sm font-medium border flex items-center gap-2 ${
                            feedback.type === 'success'
                                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                                : 'bg-red-50/80 border-red-200 text-red-800'
                        }`}
                    >
                        {feedback.type === 'success' ? (
                            <CheckCircle2 size={16} />
                        ) : (
                            <AlertTriangle size={16} />
                        )}
                        {feedback.message}
                    </div>
                )}

                {!isInitialLoading && (
                    <GlassCard
                        className={`p-4 ${
                            slots.length > 0
                                ? 'border-emerald-200/80 bg-emerald-50/40'
                                : 'border-amber-200/80 bg-amber-50/40'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`p-2 rounded-xl shrink-0 ${
                                    slots.length > 0
                                        ? 'bg-emerald-100/80 text-emerald-700'
                                        : 'bg-amber-100/80 text-amber-700'
                                }`}
                            >
                                {slots.length > 0 ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                            </div>
                            <div>
                                <p className="font-semibold text-brand-text">
                                    {slots.length > 0
                                        ? 'Profil visible pour les patientes'
                                        : 'Aucune disponibilité planifiée'}
                                </p>
                                <p className="text-sm text-brand-muted mt-0.5">
                                    {slots.length > 0
                                        ? `${stats.uniqueDays} jour${stats.uniqueDays > 1 ? 's' : ''} couvert${stats.uniqueDays > 1 ? 's' : ''} · ${stats.total} créneau${stats.total > 1 ? 'x' : ''} ouvert${stats.total > 1 ? 's' : ''} aux réservations`
                                        : 'Ajoutez au moins un créneau pour apparaître dans la recherche de praticiens.'}
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                )}

                {showSkeleton ? (
                    <StatSkeleton />
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatTile label="Créneaux" value={stats.total} icon={CalendarClock} />
                        <StatTile label="Jours couverts" value={stats.uniqueDays} icon={CalendarDays} />
                        <StatTile label="Cette semaine" value={stats.thisWeek} icon={Calendar} />
                        <StatTile label="Prochain créneau" value={stats.nextLabel} icon={Clock} />
                    </div>
                )}

                <div className="grid lg:grid-cols-5 gap-6">
                    <GlassCard className="lg:col-span-2 h-fit">
                        <h2 className="font-bold text-brand-ink flex items-center gap-2 text-sm mb-4">
                            <CalendarClock size={18} className="text-brand-primary" />
                            Planifier des créneaux
                        </h2>

                        <form onSubmit={add} className="space-y-5">
                            <div>
                                <p className="text-xs font-semibold text-brand-muted mb-2">
                                    Raccourci par jour de la semaine
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {WEEKDAYS.map((day) => (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleWeekday(day.value)}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold border surface-transition ${
                                                isWeekdayFullySelected(day.value)
                                                    ? 'bg-brand-bg text-brand-primary border-brand-primary/35'
                                                    : 'bg-white/60 text-brand-muted border-brand-border hover:border-brand-primary/40 hover:text-brand-primary hover:bg-brand-bg/60'
                                            }`}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                                    <p className="text-xs font-semibold text-brand-muted">
                                        Jours ({DAYS_AHEAD} prochains jours)
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-brand-primary font-semibold">
                                            {selectedDates.length} sélectionné
                                            {selectedDates.length > 1 ? 's' : ''}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDates([...selectableDayKeys])}
                                            className="text-[11px] font-semibold text-brand-muted hover:text-brand-primary"
                                        >
                                            Tout
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDates([])}
                                            className="text-[11px] font-semibold text-brand-muted hover:text-brand-primary"
                                        >
                                            Effacer
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[11px] text-brand-muted mt-2">
                                    Les jours avec un créneau déjà planifié ne sont pas sélectionnables.
                                </p>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-52 overflow-y-auto pr-1 mt-2 no-stagger">
                                    {upcomingDays.map((day) => {
                                        const selected = selectedDates.includes(day.key);
                                        const hasSlot = isDayBlocked(day.key);
                                        return (
                                            <button
                                                key={day.key}
                                                type="button"
                                                disabled={hasSlot}
                                                title={hasSlot ? 'Créneau déjà planifié' : undefined}
                                                onClick={() => toggleDate(day.key)}
                                                className={`relative flex flex-col items-center py-2 px-1 rounded-xl border text-center surface-transition ${
                                                    hasSlot
                                                        ? 'bg-brand-bg/60 text-brand-muted border-brand-border opacity-60 cursor-not-allowed'
                                                        : selected
                                                          ? 'bg-brand-bg text-brand-ink border-brand-primary/35 shadow-sm'
                                                          : 'bg-white/60 text-brand-ink border-brand-border hover:border-brand-primary/40 hover:bg-brand-bg/60'
                                                }`}
                                            >
                                                <span
                                                    className={`text-[10px] uppercase ${
                                                        selected ? 'text-brand-primary' : 'text-brand-muted'
                                                    }`}
                                                >
                                                    {day.weekdayLabel}
                                                </span>
                                                <span className="text-sm font-bold leading-none mt-0.5">
                                                    {day.dayNum}
                                                </span>
                                                <span
                                                    className={`text-[10px] ${
                                                        selected ? 'text-brand-muted' : 'text-brand-muted'
                                                    }`}
                                                >
                                                    {day.month}
                                                </span>
                                                {hasSlot && (
                                                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-brand-primary" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-brand-muted mb-2">Plages horaires</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {TIME_PRESETS.map((preset) => (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => applyPreset(preset)}
                                            className={`px-3 py-2 rounded-xl text-xs font-semibold border surface-transition ${
                                                activePreset === preset.id
                                                    ? 'bg-brand-bg text-brand-primary border-brand-primary/35'
                                                    : 'bg-white/60 text-brand-muted border-brand-border hover:border-brand-primary/40 hover:bg-brand-bg/60'
                                            }`}
                                        >
                                            {preset.label}
                                            <span className="block text-[10px] font-normal opacity-80">
                                                {preset.start} – {preset.end}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-brand-muted mb-1">
                                            Début
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            value={startTime}
                                            onChange={(e) => {
                                                setStartTime(e.target.value);
                                                setActivePreset('custom');
                                            }}
                                            className="input-field py-2.5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-brand-muted mb-1">
                                            Fin
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            value={endTime}
                                            onChange={(e) => {
                                                setEndTime(e.target.value);
                                                setActivePreset('custom');
                                            }}
                                            className="input-field py-2.5"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving || selectedDates.length === 0}
                                className="btn-primary w-full justify-center disabled:opacity-50"
                            >
                                {saving ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Plus size={16} />
                                )}
                                {saving
                                    ? 'Ajout…'
                                    : `Ajouter ${selectedDates.length || ''} créneau${selectedDates.length > 1 ? 'x' : ''}`}
                            </button>
                        </form>
                    </GlassCard>

                    <div className="lg:col-span-3">
                        <DataTable>
                            <DataTableToolbar className="!flex-col lg:!flex-row !items-stretch lg:!items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <h2 className="text-base font-bold text-brand-ink">Créneaux planifiés</h2>
                                    <p className="text-xs text-brand-muted mt-0.5">
                                        {showSkeleton
                                            ? 'Chargement…'
                                            : `${filteredSlots.length} créneau${filteredSlots.length > 1 ? 'x' : ''}${tableQuery.trim() ? ' trouvé(s)' : ''}`}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                                    <div className="relative flex-1 sm:flex-initial">
                                        <Search
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
                                        />
                                        <input
                                            value={tableQuery}
                                            onChange={(e) => setTableQuery(e.target.value)}
                                            placeholder="Date ou horaire…"
                                            className="input-field pl-9 w-full sm:w-56 py-2.5"
                                        />
                                    </div>
                                    <FilterPills
                                        options={TABLE_FILTERS}
                                        value={tableFilter}
                                        onChange={setTableFilter}
                                        counts={tableFilterCounts}
                                    />
                                </div>
                            </DataTableToolbar>

                            {showSkeleton ? (
                                <DataTableLoading>
                                    <Loader2 className="animate-spin text-brand-primary w-6 h-6 mx-auto" />
                                </DataTableLoading>
                            ) : filteredSlots.length === 0 ? (
                                <DataTableEmpty>
                                    <CalendarClock size={32} className="text-brand-border mx-auto mb-2" />
                                    {tableQuery.trim() || tableFilter !== 'all'
                                        ? 'Aucun créneau ne correspond à vos critères.'
                                        : 'Sélectionnez des jours et des horaires à gauche pour commencer.'}
                                </DataTableEmpty>
                            ) : (
                                <DataTableScroll>
                                    <table className="fs-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Horaire</th>
                                                <th className="hidden sm:table-cell">Durée</th>
                                                <th className="text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSlots.map((s) => {
                                                const start = String(s.start_time).slice(0, 5);
                                                const end = String(s.end_time).slice(0, 5);
                                                const [sh, sm] = start.split(':').map(Number);
                                                const [eh, em] = end.split(':').map(Number);
                                                const durationMin = eh * 60 + em - (sh * 60 + sm);

                                                return (
                                                    <tr key={s.id}>
                                                        <td>
                                                            <p className="font-medium text-brand-ink capitalize">
                                                                {fmtDate(s.date)}
                                                            </p>
                                                            <p className="text-xs text-brand-muted sm:hidden">
                                                                {start} – {end}
                                                            </p>
                                                        </td>
                                                        <td className="text-brand-muted whitespace-nowrap hidden sm:table-cell">
                                                            {start} – {end}
                                                        </td>
                                                        <td className="text-brand-muted hidden sm:table-cell">
                                                            {durationMin > 0 ? `${durationMin} min` : '—'}
                                                        </td>
                                                        <td className="text-right">
                                                            <TableActionIconButton
                                                                onClick={() => setDeleteId(s.id)}
                                                                icon={Trash2}
                                                                title="Supprimer le créneau"
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </DataTableScroll>
                            )}
                        </DataTable>
                    </div>
                </div>
            </div>
        </GynecologistLayout>
    );
}
