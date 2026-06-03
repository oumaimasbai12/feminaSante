import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '@/Components/UI/GlassCard';
import StatTile from '@/Components/UI/StatTile';
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Droplets,
    Smile,
    Meh,
    Frown,
    AlertCircle,
    Annoyed,
    Moon,
    Heart,
    Calendar,
    Sparkles,
    Activity,
    AlertTriangle,
} from 'lucide-react';

const MONTHS = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const moods = [
    { v: 'happy', l: 'Joyeuse', Icon: Smile },
    { v: 'calm', l: 'Calme', Icon: Meh },
    { v: 'sad', l: 'Triste', Icon: Frown },
    { v: 'anxious', l: 'Anxieuse', Icon: AlertCircle },
    { v: 'irritable', l: 'Irritable', Icon: Annoyed },
    { v: 'other', l: 'Autre', Icon: Moon },
];

const flows = [
    { v: 'light', l: 'Léger' },
    { v: 'medium', l: 'Moyen' },
    { v: 'heavy', l: 'Abondant' },
];

const flowLabels = Object.fromEntries(flows.map((f) => [f.v, f.l]));
const moodLabels = Object.fromEntries(moods.map((m) => [m.v, m.l]));

const defaultForm = () => {
    const today = new Date().toISOString().split('T')[0];
    return {
        start_date: today,
        end_date: '',
        flow_intensity: 'medium',
        mood: 'calm',
        notes: '',
        phase: 'menstruation',
    };
};

const parseLocalDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const isWithinRange = (date, start, end) => {
    const time = date.getTime();
    return time >= start.getTime() && time <= end.getTime();
};

function formatShortDate(dateStr) {
    return parseLocalDate(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function daysUntilLabel(dateStr) {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((parseLocalDate(dateStr) - todayDate) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Aujourd'hui";
    if (diff < 0) return `Il y a ${Math.abs(diff)} j`;
    return `Dans ${diff} j`;
}

function CalendarSkeleton() {
    return (
        <GlassCard className="p-8 animate-pulse">
            <div className="h-6 w-40 bg-brand-bg rounded mx-auto mb-6" />
            <div className="grid grid-cols-7 gap-3">
                {[...Array(35)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-brand-bg" />
                ))}
            </div>
        </GlassCard>
    );
}

function getDayClasses(dateStatus, { isToday, isSelected }) {
    const base =
        'relative aspect-square flex items-center justify-center rounded-xl text-sm font-semibold border ';

    if (dateStatus?.type === 'period') {
        let cls = `${base} bg-brand-primary/10 text-brand-primary border-brand-primary/30`;
        if (isToday) cls += ' ring-2 ring-brand-primary/35 ring-offset-1';
        else if (isSelected) cls += ' border-brand-primary/45';
        return cls;
    }
    if (dateStatus?.type === 'predicted-period') {
        return `${base} bg-brand-soft/60 text-brand-primary border-dashed border-brand-primary/35`;
    }
    if (dateStatus?.type === 'ovulation') {
        return `${base} bg-amber-50 text-amber-800 border-amber-200`;
    }
    if (dateStatus?.type === 'fertile') {
        return `${base} bg-sky-50 text-sky-800 border-sky-200`;
    }

    if (isToday) {
        return `${base} bg-brand-bg text-brand-ink border-brand-primary/40 font-bold shadow-sm`;
    }
    if (isSelected) {
        return `${base} bg-brand-bg/80 text-brand-ink border-brand-primary/30 hover:border-brand-primary/40`;
    }

    return `${base} text-brand-ink border-transparent hover:bg-brand-bg/70 hover:border-brand-border`;
}

export default function Cycles() {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [cycles, setCycles] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const loadData = () =>
        Promise.all([
            window.axios.get('/api/v1/cycles').catch(() => ({ data: [] })),
            window.axios.get('/api/v1/predictions').catch(() => ({ data: { predictions: [] } })),
        ]).then(([cyclesRes, predictionsRes]) => {
            setCycles(Array.isArray(cyclesRes.data) ? cyclesRes.data : cyclesRes.data.data || []);
            setPredictions(predictionsRes.data?.predictions || []);
        });

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const getDateStatus = (dateStr) => {
        const d = parseLocalDate(dateStr);

        for (const c of cycles) {
            const s = parseLocalDate(c.start_date);
            const e = c.end_date
                ? parseLocalDate(c.end_date)
                : new Date(s.getFullYear(), s.getMonth(), s.getDate() + 4);
            if (isWithinRange(d, s, e)) return { type: 'period', intensity: c.flow_intensity };
        }

        for (const prediction of predictions) {
            if (prediction.type === 'period') {
                const predictedStart = parseLocalDate(prediction.predicted_date);
                const predictedEnd = prediction.end_date
                    ? parseLocalDate(prediction.end_date)
                    : new Date(
                          predictedStart.getFullYear(),
                          predictedStart.getMonth(),
                          predictedStart.getDate() + 4,
                      );
                if (isWithinRange(d, predictedStart, predictedEnd)) {
                    return { type: 'predicted-period' };
                }
            }
        }

        for (const prediction of predictions) {
            if (prediction.type === 'ovulation') {
                const ovulationDate = parseLocalDate(prediction.predicted_date);
                if (isSameDay(d, ovulationDate)) return { type: 'ovulation' };
            }
        }

        for (const prediction of predictions) {
            if (prediction.type === 'fertile_window' && prediction.end_date) {
                const fertileStart = parseLocalDate(prediction.predicted_date);
                const fertileEnd = parseLocalDate(prediction.end_date);
                if (isWithinRange(d, fertileStart, fertileEnd)) return { type: 'fertile' };
            }
        }

        return null;
    };

    const nextPrediction = (type) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return predictions
            .filter((p) => p.type === type)
            .map((p) => ({ ...p, date: parseLocalDate(p.predicted_date) }))
            .filter((p) => p.date >= now)
            .sort((a, b) => a.date - b.date)[0];
    };

    const nextPeriod = useMemo(() => nextPrediction('period'), [predictions]);
    const nextOvulation = useMemo(() => nextPrediction('ovulation'), [predictions]);
    const avgCycleLength =
        predictions.find((p) => p.type === 'period')?.cycle_length_avg || null;

    const saveCycle = async () => {
        setSaving(true);
        setFormError('');
        try {
            const payload = { ...form, end_date: form.end_date || form.start_date };
            const r = await window.axios.post('/api/v1/cycles', payload);
            const cycle = r.data?.cycle || r.data;
            setCycles((prev) => [cycle, ...prev]);
            setShowForm(false);
            setForm(defaultForm());
            const predictionsRes = await window.axios.get('/api/v1/predictions');
            setPredictions(predictionsRes.data?.predictions || []);
        } catch (e) {
            setFormError(e.response?.data?.message || 'Erreur lors de l\'enregistrement.');
        } finally {
            setSaving(false);
        }
    };

    const fertileWindow = predictions
        .filter((p) => p.type === 'fertile_window')
        .map((p) => ({ ...p, date: parseLocalDate(p.predicted_date) }))
        .filter((p) => p.date >= new Date(new Date().setHours(0, 0, 0, 0)))
        .sort((a, b) => a.date - b.date)[0];

    return (
        <AppLayout title="Suivi du cycle">
            <Head title="Suivi du cycle - FeminaSante" />

            <p className="text-brand-muted text-sm mb-6">
                Enregistrez vos règles, humeur et symptômes — le calendrier se met à jour automatiquement.
            </p>

            {loading ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="glass-card h-[118px] animate-pulse" />
                        ))}
                    </div>
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <CalendarSkeleton />
                        </div>
                        <div className="space-y-4">
                            <GlassCard className="h-40 animate-pulse" />
                            <GlassCard className="h-56 animate-pulse" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatTile
                            label="Cycles enregistrés"
                            value={cycles.length}
                            sub={cycles.length >= 2 ? 'Prédictions actives' : 'Encore 1 pour prédire'}
                            icon={Heart}
                        />
                        <StatTile
                            label="Prochaines règles"
                            value={nextPeriod ? daysUntilLabel(nextPeriod.predicted_date) : '—'}
                            sub={nextPeriod ? formatShortDate(nextPeriod.predicted_date) : '2 cycles min.'}
                            icon={Calendar}
                        />
                        <StatTile
                            label="Cycle moyen"
                            value={avgCycleLength ? `${avgCycleLength} j` : '—'}
                            sub="Durée estimée"
                            icon={Activity}
                        />
                        <StatTile
                            label="Ovulation"
                            value={nextOvulation ? daysUntilLabel(nextOvulation.predicted_date) : '—'}
                            sub={nextOvulation ? formatShortDate(nextOvulation.predicted_date) : 'Estimation'}
                            icon={Sparkles}
                        />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <GlassCard className="p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (month === 0) {
                                                setMonth(11);
                                                setYear((y) => y - 1);
                                            } else setMonth((m) => m - 1);
                                        }}
                                        className="p-2.5 rounded-xl border border-brand-border hover:bg-brand-soft text-brand-muted transition-colors duration-300"
                                        aria-label="Mois précédent"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <h2 className="text-lg font-bold text-brand-ink">
                                        {MONTHS[month]} {year}
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (month === 11) {
                                                setMonth(0);
                                                setYear((y) => y + 1);
                                            } else setMonth((m) => m + 1);
                                        }}
                                        className="p-2.5 rounded-xl border border-brand-border hover:bg-brand-soft text-brand-muted transition-colors duration-300"
                                        aria-label="Mois suivant"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 mb-3 no-stagger">
                                    {DAYS.map((d) => (
                                        <div
                                            key={d}
                                            className="text-center text-xs font-semibold text-brand-muted py-2"
                                        >
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-2 sm:gap-3 no-stagger">
                                    {[...Array(firstDay)].map((_, i) => (
                                        <div key={`empty-${i}`} />
                                    ))}
                                    {[...Array(daysInMonth)].map((_, i) => {
                                        const d = i + 1;
                                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                        const isToday =
                                            d === today.getDate() &&
                                            month === today.getMonth() &&
                                            year === today.getFullYear();
                                        const dateStatus = getDateStatus(dateStr);

                                        return (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDate(dateStr);
                                                    setForm((prev) => ({ ...prev, start_date: dateStr }));
                                                }}
                                                aria-label={`${d} ${MONTHS[month]} ${year}`}
                                                aria-pressed={selectedDate === dateStr}
                                                className={getDayClasses(dateStatus, {
                                                    isToday,
                                                    isSelected: selectedDate === dateStr,
                                                })}
                                            >
                                                {d}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-wrap gap-x-5 gap-y-3 mt-8 pt-6 border-t border-brand-border">
                                    {[
                                        { c: 'bg-brand-primary/20 border border-brand-primary/35', l: 'Règles' },
                                        { c: 'bg-brand-soft border border-dashed border-brand-primary/40', l: 'Prédiction' },
                                        { c: 'bg-amber-50 border border-amber-200', l: 'Ovulation' },
                                        { c: 'bg-sky-50 border border-sky-200', l: 'Fenêtre fertile' },
                                        { c: 'bg-brand-bg border-2 border-brand-primary/40', l: "Aujourd'hui" },
                                        { c: 'bg-brand-bg/80 border border-brand-primary/30', l: 'Sélection' },
                                    ].map((item) => (
                                        <div key={item.l} className="flex items-center gap-2">
                                            <div className={`w-5 h-5 rounded-lg ${item.c}`} />
                                            <span className="text-xs text-brand-muted">{item.l}</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </div>

                        <div className="space-y-5">
                            <GlassCard className="p-5">
                                <h3 className="text-sm font-bold text-brand-ink mb-3">Prédictions</h3>
                                {predictions.length > 0 ? (
                                    <div className="space-y-3">
                                        {nextPeriod && (
                                            <div className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border">
                                                <p className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
                                                    Prochaines règles
                                                </p>
                                                <p className="text-xl font-bold text-brand-ink mt-1">
                                                    {daysUntilLabel(nextPeriod.predicted_date)}
                                                </p>
                                                <p className="text-xs text-brand-muted mt-0.5">
                                                    Prévues le {formatShortDate(nextPeriod.predicted_date)}
                                                </p>
                                            </div>
                                        )}
                                        {nextOvulation && (
                                            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
                                                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                                                    Ovulation
                                                </p>
                                                <p className="text-lg font-bold text-amber-900 mt-1">
                                                    {daysUntilLabel(nextOvulation.predicted_date)}
                                                </p>
                                                <p className="text-xs text-brand-muted mt-0.5">
                                                    Prévue le {formatShortDate(nextOvulation.predicted_date)}
                                                </p>
                                            </div>
                                        )}
                                        {fertileWindow && (
                                            <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200/80">
                                                <p className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                                                    Fenêtre fertile
                                                </p>
                                                <p className="text-sm font-bold text-sky-900 mt-1">
                                                    {formatShortDate(fertileWindow.predicted_date)} –{' '}
                                                    {formatShortDate(fertileWindow.end_date)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="w-12 h-12 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center mx-auto mb-3 text-brand-primary">
                                            <Calendar size={22} />
                                        </div>
                                        <p className="text-sm text-brand-muted">
                                            Enregistrez au moins <strong className="text-brand-ink">2 cycles</strong>{' '}
                                            pour activer les prédictions.
                                        </p>
                                    </div>
                                )}
                            </GlassCard>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(!showForm);
                                    setFormError('');
                                    if (!showForm) {
                                        setForm((prev) => ({ ...prev, start_date: selectedDate || todayStr }));
                                    }
                                }}
                                disabled={saving}
                                className="w-full btn-secondary py-3.5"
                            >
                                <Plus size={20} />
                                {showForm ? 'Masquer le formulaire' : 'Enregistrer un cycle'}
                            </button>

                            {showForm && (
                                <GlassCard className="p-6">
                                    <h3 className="text-base font-bold text-brand-ink mb-5">
                                        Enregistrer un cycle
                                    </h3>

                                    {formError && (
                                        <div className="mb-4 p-3 rounded-xl text-sm border bg-red-50/80 border-red-200 text-red-800 flex items-start gap-2">
                                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                            {formError}
                                        </div>
                                    )}

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-brand-ink mb-2">
                                                Date de début
                                            </label>
                                            <input
                                                type="date"
                                                value={form.start_date}
                                                onChange={(e) =>
                                                    setForm({ ...form, start_date: e.target.value })
                                                }
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-brand-ink mb-2">
                                                Date de fin (optionnel)
                                            </label>
                                            <input
                                                type="date"
                                                value={form.end_date}
                                                onChange={(e) =>
                                                    setForm({ ...form, end_date: e.target.value })
                                                }
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-brand-ink mb-3">
                                                Intensité du flux
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {flows.map((f) => (
                                                    <button
                                                        key={f.v}
                                                        type="button"
                                                        onClick={() =>
                                                            setForm({ ...form, flow_intensity: f.v })
                                                        }
                                                        className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                                            form.flow_intensity === f.v
                                                                ? 'bg-brand-soft text-brand-primary border border-brand-primary/30'
                                                                : 'text-brand-muted border border-brand-border hover:bg-brand-soft/80'
                                                        }`}
                                                    >
                                                        {f.l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-brand-ink mb-3">
                                                Humeur
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {moods.map((m) => {
                                                    const MoodIcon = m.Icon;
                                                    return (
                                                        <button
                                                            key={m.v}
                                                            type="button"
                                                            onClick={() => setForm({ ...form, mood: m.v })}
                                                            className={`px-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 text-center ${
                                                                form.mood === m.v
                                                                    ? 'bg-brand-soft border border-brand-primary/30'
                                                                    : 'border border-brand-border hover:bg-brand-soft/80'
                                                            }`}
                                                        >
                                                            <MoodIcon
                                                                size={18}
                                                                className="mx-auto mb-1 text-brand-primary"
                                                            />
                                                            {m.l}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-brand-ink mb-2">
                                                Notes
                                            </label>
                                            <textarea
                                                value={form.notes}
                                                onChange={(e) =>
                                                    setForm({ ...form, notes: e.target.value })
                                                }
                                                rows={3}
                                                placeholder="Comment vous sentez-vous ?"
                                                className="input-field resize-none"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={saveCycle}
                                                disabled={saving}
                                                className="flex-1 btn-primary"
                                            >
                                                {saving && (
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                )}
                                                Enregistrer
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowForm(false);
                                                    setFormError('');
                                                }}
                                                className="flex-1 btn-secondary"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            )}

                            <GlassCard className="p-5">
                                <h3 className="text-sm font-bold text-brand-ink mb-4">Cycles récents</h3>
                                {cycles.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Heart size={32} className="text-brand-border mx-auto mb-3" />
                                        <p className="text-sm text-brand-muted mb-4">Aucun cycle enregistré</p>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(true)}
                                            className="btn-secondary text-sm"
                                        >
                                            Ajouter mon premier cycle
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {cycles.slice(0, 5).map((c) => (
                                            <div
                                                key={c.id ?? c.start_date}
                                                className="flex items-center gap-3 p-3 rounded-xl border border-brand-border bg-brand-bg/60 hover:bg-brand-soft/50 transition-colors duration-300"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center shrink-0 text-brand-primary">
                                                    <Droplets size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-brand-ink">
                                                        {new Date(c.start_date).toLocaleDateString('fr-FR', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short',
                                                        })}
                                                    </p>
                                                    <p className="text-xs text-brand-muted mt-0.5">
                                                        {flowLabels[c.flow_intensity] || c.flow_intensity}
                                                        {' · '}
                                                        {moodLabels[c.mood] || c.mood}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </GlassCard>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
