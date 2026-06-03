import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import PregnancyDashboard from '../../Components/Pregnancy/PregnancyDashboard';
import StatTile from '@/Components/UI/StatTile';
import GlassCard from '@/Components/UI/GlassCard';
import FilterPills from '@/Components/UI/FilterPills';
import { Baby, Plus, Heart, Weight, Activity, Calendar, CheckCircle, AlertCircle, Clock, X, TrendingUp, Footprints, Timer, Scale, Thermometer, ChevronRight, Trash2, Square, Play, Lightbulb, ClipboardList, Info, Sprout, AlertTriangle } from 'lucide-react';

const weeks = [
    { w: 4, label: '4 sem.', d: 'Taille d\'une graine de pavot' },
    { w: 8, label: '8 sem.', d: 'Taille d\'une framboise' },
    { w: 12, label: '12 sem.', d: 'Taille d\'un citron vert' },
    { w: 16, label: '16 sem.', d: 'Taille d\'un avocat' },
    { w: 20, label: '20 sem.', d: 'Taille d\'une banane' },
    { w: 24, label: '24 sem.', d: 'Taille d\'un épi de maïs' },
    { w: 28, label: '28 sem.', d: 'Taille d\'une aubergine' },
    { w: 32, label: '32 sem.', d: 'Taille d\'une courge' },
    { w: 36, label: '36 sem.', d: 'Taille d\'un melon' },
    { w: 40, label: 'Terme', d: 'Bébé est prêt à vous rencontrer !' },
];

/* ───────── Tabs definition ───────── */
const TABS = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Baby },
    { id: 'kicks', label: 'Coups de pied', icon: Footprints },
    { id: 'contractions', label: 'Contractions', icon: Timer },
    { id: 'weight', label: 'Poids', icon: Scale },
    { id: 'symptoms', label: 'Symptômes', icon: Thermometer },
];

/* ════════════════════════════════════════════════════
   SYMPTOM DATA
   ════════════════════════════════════════════════════ */
const SYMPTOM_LIST = [
    'Nausées', 'Fatigue', 'Maux de dos', 'Brûlures d\'estomac',
    'Insomnie', 'Crampes', 'Maux de tête', 'Vertiges',
    'Gonflements', 'Essoufflement', 'Envies alimentaires', 'Sautes d\'humeur',
];

const INTENSITY_LEVELS = [
    { value: 'faible', label: 'Faible', color: 'bg-green-100 text-green-700', dot: 'bg-green-400' },
    { value: 'modéré', label: 'Modéré', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
    { value: 'élevé', label: 'Élevé', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400' },
    { value: 'intense', label: 'Intense', color: 'bg-red-100 text-red-700', dot: 'bg-red-400' },
];

function formatShortDate(value) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function mapSymptomFromApi(symptom) {
    const recordedAt = symptom.recorded_at || symptom.created_at;
    const d = new Date(recordedAt);
    return {
        id: symptom.id,
        name: symptom.name,
        intensity: symptom.intensity,
        notes: symptom.notes || '',
        date: Number.isNaN(d.getTime())
            ? '—'
            : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: Number.isNaN(d.getTime())
            ? ''
            : d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
}

/* ════════════════════════════════════════════════════
   KICK COUNTER COMPONENT
   ════════════════════════════════════════════════════ */
function KickCounterTab({ pregnancyId }) {
    const [kicks, setKicks] = useState(0);
    const [sessionActive, setSessionActive] = useState(false);
    const [sessionStart, setSessionStart] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [history, setHistory] = useState([]);
    const [saving, setSaving] = useState(false);
    const [sessionError, setSessionError] = useState('');
    const timerRef = useRef(null);

    useEffect(() => {
        if (!pregnancyId) return;
        window.axios.get(`/api/v1/pregnancies/${pregnancyId}/kicks`)
            .then(r => setHistory(Array.isArray(r.data) ? r.data.slice(0, 10) : []))
            .catch(() => {});
    }, [pregnancyId]);

    useEffect(() => {
        if (sessionActive) {
            timerRef.current = setInterval(() => {
                setElapsed(Math.floor((Date.now() - sessionStart) / 1000));
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [sessionActive, sessionStart]);

    const startSession = () => {
        setSessionError('');
        setKicks(0);
        setElapsed(0);
        setSessionStart(Date.now());
        setSessionActive(true);
    };

    const recordKick = () => {
        if (sessionActive) setKicks(k => k + 1);
    };

    const endSession = async () => {
        setSessionActive(false);
        clearInterval(timerRef.current);
        if (!pregnancyId || kicks === 0) return;
        setSaving(true);
        setSessionError('');
        const now = new Date();
        const startTime = new Date(sessionStart);
        const mins = Math.floor(elapsed / 60);
        let timeTo10 = null;
        if (kicks >= 10) {
            if (mins < 30) timeTo10 = '<30min';
            else if (mins <= 60) timeTo10 = '30-60min';
            else if (mins <= 120) timeTo10 = '1-2hours';
            else timeTo10 = '>2hours';
        }
        try {
            const r = await window.axios.post(`/api/v1/pregnancies/${pregnancyId}/kicks`, {
                date: now.toISOString().split('T')[0],
                start_time: startTime.toTimeString().slice(0, 8),
                end_time: now.toTimeString().slice(0, 8),
                kicks_count: kicks,
                time_to_10_kicks: timeTo10,
                activity_level: kicks >= 10 ? 'high' : kicks >= 5 ? 'normal' : 'low',
            });
            const newEntry = r.data?.kick_counter || r.data;
            setHistory(prev => [newEntry, ...prev].slice(0, 10));
        } catch (e) {
            const data = e.response?.data;
            const validationMsg = data?.errors
                ? Object.values(data.errors).flat().join(' ')
                : null;
            setSessionError(validationMsg || data?.message || 'Erreur lors de l\'enregistrement de la session.');
        }
        setSaving(false);
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            {/* Main kick area */}
            <div className="glass-card text-center px-6 py-10 sm:py-12">
                <div className="mb-2 flex justify-center">
                    <Footprints size={48} className="text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-brand-ink mb-1">Compteur de Mouvements</h3>
                <p className="text-sm text-brand-muted mb-6">Suivez l'activité de votre bébé en comptant ses mouvements.</p>

                {!sessionActive ? (
                    <>
                        {sessionError && (
                            <div className="mb-4 p-3 rounded-xl text-sm border bg-red-50/80 border-red-200 text-red-800 flex items-start gap-2 max-w-md mx-auto text-left">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                {sessionError}
                            </div>
                        )}
                        <button onClick={startSession} className="btn-primary mx-auto flex items-center gap-2 text-lg px-8 py-4">
                            <Activity size={20} /> Démarrer une session
                        </button>
                    </>
                ) : (
                    <div className="space-y-6">
                        {/* Timer */}
                        <div className="flex items-center justify-center gap-6">
                            <div className="text-center">
                                <p className="text-xs text-brand-muted font-medium uppercase tracking-wider mb-1">Durée</p>
                                <p className="text-3xl font-mono font-bold text-brand-ink">{formatTime(elapsed)}</p>
                            </div>
                            <div className="w-px h-12 bg-brand-border"></div>
                            <div className="text-center">
                                <p className="text-xs text-brand-muted font-medium uppercase tracking-wider mb-1">Coups</p>
                                <p className="text-5xl font-black text-brand-primary">{kicks}</p>
                            </div>
                        </div>

                        {/* Kick button */}
                        <button
                            onClick={recordKick}
                            className="w-28 h-28 mx-auto rounded-full flex items-center justify-center text-3xl font-bold transition-all duration-300 active:scale-95 border-2 border-brand-primary bg-brand-bg text-brand-primary hover:bg-brand-soft"
                        >
                            +1
                        </button>
                        <p className="text-brand-muted text-xs">Appuyez à chaque mouvement ressenti</p>

                        {kicks >= 10 && (
                            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-xl p-3">
                                <CheckCircle size={18} />
                                <span className="font-semibold text-sm">10 mouvements atteints — très bon signe</span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={endSession}
                            disabled={saving}
                            className="btn-secondary border-red-200 text-red-700 hover:bg-red-50 px-8 py-3 text-sm inline-flex items-center gap-2 mx-auto disabled:opacity-50"
                        >
                            <Square size={16} />
                            {saving ? 'Enregistrement...' : 'Terminer et enregistrer'}
                        </button>
                    </div>
                )}
            </div>

            {/* History */}
            {history.length > 0 && (
                <div className="glass-card p-5 sm:p-6">
                    <h4 className="font-bold text-brand-ink mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-brand-primary" /> Historique récent
                    </h4>
                    <div className="space-y-2">
                        {history.map((h, i) => (
                            <div key={h.id || i} className="flex items-center justify-between gap-3 p-4 rounded-xl bg-brand-soft border border-brand-border">
                                <div className="min-w-0">
                                    <p className="font-semibold text-brand-ink text-sm">{h.kicks_count} mouvement{h.kicks_count > 1 ? 's' : ''}</p>
                                    <p className="text-xs text-brand-muted mt-0.5">
                                        {new Date(String(h.date).includes('T') ? h.date : `${h.date}T12:00:00`).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}{' '}
                                        · {String(h.start_time || '').slice(0, 5)} - {String(h.end_time || '?').slice(0, 5)}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${h.activity_level === 'high' ? 'bg-green-100 text-green-700' : h.activity_level === 'normal' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {h.activity_level === 'high' ? 'Élevé' : h.activity_level === 'normal' ? 'Normal' : 'Faible'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tips */}
            <GlassCard className="p-5">
                <h4 className="font-bold text-brand-ink mb-3 flex items-center gap-2">
                    <Lightbulb size={16} className="text-brand-primary" /> Conseils
                </h4>
                <ul className="space-y-2 text-sm text-brand-muted">
                    <li className="flex items-start gap-2"><span className="text-brand-primary mt-0.5">•</span> Comptez les mouvements à la même heure chaque jour</li>
                    <li className="flex items-start gap-2"><span className="text-brand-primary mt-0.5">•</span> 10 mouvements en 2 heures est un bon objectif</li>
                    <li className="flex items-start gap-2"><span className="text-brand-primary mt-0.5">•</span> Consultez si vous remarquez une baisse significative d'activité</li>
                </ul>
            </GlassCard>
        </div>
    );
}

/* ════════════════════════════════════════════════════
   CONTRACTION TIMER COMPONENT
   ════════════════════════════════════════════════════ */
function ContractionTimerTab({ pregnancyId }) {
    const [isTiming, setIsTiming] = useState(false);
    const [contractionStart, setContractionStart] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [contractions, setContractions] = useState([]);
    const [intensity, setIntensity] = useState('moderate');
    const [saving, setSaving] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!pregnancyId) return;
        window.axios.get(`/api/v1/pregnancies/${pregnancyId}/contractions`)
            .then(r => setContractions(Array.isArray(r.data) ? r.data.slice(0, 15) : []))
            .catch(() => {});
    }, [pregnancyId]);

    useEffect(() => {
        if (isTiming) {
            timerRef.current = setInterval(() => {
                setElapsed(Math.floor((Date.now() - contractionStart) / 1000));
            }, 100);
        }
        return () => clearInterval(timerRef.current);
    }, [isTiming, contractionStart]);

    const startContraction = () => {
        setContractionStart(Date.now());
        setElapsed(0);
        setIsTiming(true);
    };

    const stopContraction = async () => {
        setIsTiming(false);
        clearInterval(timerRef.current);
        if (!pregnancyId) return;
        setSaving(true);
        const startTime = new Date(contractionStart);
        const endTime = new Date();
        const durationSeconds = elapsed;

        // Calculate interval from the last contraction
        let intervalSeconds = 0;
        if (contractions.length > 0 && contractions[0].start_time) {
            const lastStart = new Date(contractions[0].start_time);
            intervalSeconds = Math.floor((startTime - lastStart) / 1000);
        }
        if (intervalSeconds <= 0) intervalSeconds = 1;

        try {
            const r = await window.axios.post(`/api/v1/pregnancies/${pregnancyId}/contractions`, {
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                duration_seconds: Math.max(1, durationSeconds),
                interval_seconds: intervalSeconds,
                intensity: intensity,
            });
            const newEntry = r.data?.contraction || r.data;
            setContractions(prev => [newEntry, ...prev].slice(0, 15));
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const fmtDuration = (s) => {
        if (!s) return '-';
        const m = Math.floor(s / 60);
        const sec = s % 60;
        if (m > 0) return `${m}m ${sec}s`;
        return `${sec}s`;
    };

    const fmtInterval = (s) => {
        if (!s || s <= 1) return '-';
        const m = Math.floor(s / 60);
        if (m > 0) return `${m} min`;
        return `${s}s`;
    };

    const intensityOptions = [
        { value: 'mild', label: 'Légère' },
        { value: 'moderate', label: 'Modérée' },
        { value: 'strong', label: 'Forte' },
        { value: 'very strong', label: 'Très forte' },
    ];

    // Check if contractions suggest going to hospital
    const recentContractions = contractions.slice(0, 6);
    const avgInterval = recentContractions.length >= 3
        ? recentContractions.reduce((sum, c) => sum + (c.interval_seconds || 0), 0) / recentContractions.length
        : null;
    const showAlert = avgInterval && avgInterval > 0 && avgInterval < 5 * 60; // less than 5 min apart

    return (
        <div className="space-y-6">
            {/* Alert banner */}
            {showAlert && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
                    <AlertCircle size={22} className="text-red-500 flex-shrink-0" />
                    <div>
                        <p className="font-bold text-red-800 text-sm">Contractions rapprochées détectées !</p>
                        <p className="text-xs text-red-600">Vos contractions sont espacées de moins de 5 minutes. Contactez votre maternité.</p>
                    </div>
                </div>
            )}

            {/* Timer card */}
            <div className="glass-card text-center px-6 py-10 sm:py-12">
                <div className="mb-3 flex justify-center">
                    <Timer size={40} className="text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-brand-ink mb-1">Chronomètre de Contractions</h3>
                <p className="text-sm text-brand-muted mb-6">Minutez la durée et la fréquence de vos contractions.</p>

                {/* Timer display */}
                <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-36 h-36 rounded-full text-4xl font-mono font-bold transition-all duration-300 ${isTiming ? 'text-red-800 bg-red-50 border-2 border-red-300' : 'text-brand-muted border-4 border-dashed border-brand-border'}`}>
                        {fmtDuration(elapsed)}
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-xs text-brand-muted font-medium uppercase tracking-wider mb-3">Intensité ressentie</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                        {intensityOptions.map(opt => (
                            <button key={opt.value} type="button" onClick={() => setIntensity(opt.value)}
                                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${intensity === opt.value ? 'border-brand-primary bg-brand-soft text-brand-primary' : 'border-brand-border text-brand-muted hover:border-brand-primary/40'}`}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={isTiming ? stopContraction : startContraction}
                    disabled={saving}
                    className={isTiming ? 'btn-secondary border-red-200 text-red-700 hover:bg-red-50 px-10 py-4 text-lg' : 'btn-primary px-10 py-4 text-lg'}
                >
                    {saving ? 'Enregistrement...' : isTiming ? (
                        <span className="flex items-center gap-2 justify-center"><Square size={18} /> Arrêter</span>
                    ) : (
                        <span className="flex items-center gap-2 justify-center"><Play size={18} /> Démarrer</span>
                    )}
                </button>
            </div>

            {/* History */}
            {contractions.length > 0 && (
                <div className="table-shell">
                    <div className="table-toolbar">
                        <h4 className="font-bold text-brand-ink flex items-center gap-2 text-sm">
                            <Clock size={16} className="text-brand-primary" /> Contractions enregistrées
                        </h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="fs-table">
                            <thead>
                                <tr>
                                    <th>Heure</th>
                                    <th>Durée</th>
                                    <th>Intervalle</th>
                                    <th>Intensité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contractions.map((c, i) => (
                                    <tr key={c.id || i}>
                                        <td className="text-brand-muted">
                                            {c.start_time ? new Date(c.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                        </td>
                                        <td className="font-semibold text-brand-ink">{fmtDuration(c.duration_seconds)}</td>
                                        <td className="text-brand-muted">{fmtInterval(c.interval_seconds)}</td>
                                        <td>
                                            <span className={`status-badge ${
                                                c.intensity === 'very strong' ? 'badge-cancelled'
                                                    : c.intensity === 'strong' ? 'badge-pending'
                                                    : c.intensity === 'moderate' ? 'badge-pending'
                                                    : 'badge-confirmed'
                                            }`}>
                                                {c.intensity === 'very strong' ? 'Très forte' : c.intensity === 'strong' ? 'Forte' : c.intensity === 'moderate' ? 'Modérée' : 'Légère'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* When to call info */}
            <GlassCard className="p-5 border-amber-200/60 bg-amber-50/30">
                <h4 className="font-bold text-brand-ink mb-3 flex items-center gap-2">
                    <Info size={16} className="text-brand-primary" /> Quand contacter la maternité ?
                </h4>
                <ul className="space-y-2 text-sm text-brand-muted">
                    <li className="flex items-start gap-2"><span className="text-brand-primary mt-0.5">•</span> Contractions régulières toutes les 5 minutes pendant 1 heure</li>
                    <li className="flex items-start gap-2"><span className="text-brand-primary mt-0.5">•</span> Durée des contractions d'environ 1 minute chacune</li>
                    <li className="flex items-start gap-2"><span className="text-brand-primary mt-0.5">•</span> Intensité croissante qui ne diminue pas au repos</li>
                    <li className="flex items-start gap-2"><span className="text-brand-primary mt-0.5">•</span> Perte des eaux ou saignements</li>
                </ul>
            </GlassCard>
        </div>
    );
}

/* ════════════════════════════════════════════════════
   WEIGHT TRACKER COMPONENT
   ════════════════════════════════════════════════════ */
function WeightTrackerTab({ pregnancyId, currentWeek }) {
    const [entries, setEntries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ weight: '', notes: '' });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (!pregnancyId) return;
        window.axios.get(`/api/v1/pregnancies/${pregnancyId}/weight-gains`)
            .then(r => setEntries(Array.isArray(r.data) ? r.data : []))
            .catch(() => {});
    }, [pregnancyId]);

    const save = async () => {
        if (!form.weight || !pregnancyId) return;
        setSaving(true);
        setFormError('');
        try {
            const r = await window.axios.post(`/api/v1/pregnancies/${pregnancyId}/weight-gains`, {
                date: new Date().toISOString().split('T')[0],
                week: currentWeek || 1,
                weight: parseFloat(form.weight),
                notes: form.notes || null,
            });
            const newEntry = r.data?.weight_gain || r.data;
            setEntries(prev => [newEntry, ...prev]);
            setForm({ weight: '', notes: '' });
            setShowForm(false);
        } catch (e) {
            const data = e.response?.data;
            const validationMsg = data?.errors
                ? Object.values(data.errors).flat().join(' ')
                : null;
            setFormError(validationMsg || data?.message || 'Erreur lors de l\'enregistrement.');
        } finally {
            setSaving(false);
        }
    };

    const firstWeight = entries.length > 0 ? entries[entries.length - 1].weight : null;
    const lastWeight = entries.length > 0 ? entries[0].weight : null;
    const gain = firstWeight && lastWeight ? (lastWeight - firstWeight).toFixed(1) : null;

    // Simple visual chart using bars
    const maxWeight = Math.max(...entries.map(e => e.weight), 0);
    const minWeight = Math.min(...entries.map(e => e.weight), maxWeight);
    const range = maxWeight - minWeight || 1;

    return (
        <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatTile label="Poids initial" value={firstWeight ?? '—'} sub="kg" icon={Scale} />
                <StatTile label="Poids actuel" value={lastWeight ?? '—'} sub="kg" icon={Weight} />
                <StatTile
                    label="Prise totale"
                    value={gain ? `+${gain}` : '—'}
                    sub="kg depuis le début"
                    icon={TrendingUp}
                />
            </div>

            {/* Visual chart */}
            {entries.length > 1 && (
                <div className="glass-card p-5 sm:p-6">
                    <h4 className="font-bold text-brand-ink mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-brand-primary" /> Courbe de poids
                    </h4>
                    <div className="flex items-end gap-1 h-32">
                        {[...entries].reverse().map((e, i) => {
                            const height = ((e.weight - minWeight) / range) * 100;
                            return (
                                <div key={e.id || i} className="flex-1 flex flex-col items-center gap-1" title={`${e.weight}kg — Sem. ${e.week}`}>
                                    <span className="text-[10px] text-brand-muted font-medium">{e.weight}</span>
                                    <div className="w-full rounded-t-lg transition-all duration-300" style={{
                                        height: `${Math.max(8, height)}%`,
                                        background: 'var(--fs-primary, #853953)',
                                    }}></div>
                                    <span className="text-[10px] text-brand-muted">S{e.week}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Add weight form */}
            {!showForm ? (
                <div key="weight-add" className="fs-reveal py-1">
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="btn-primary flex items-center gap-2 group"
                    >
                        <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
                        Ajouter une pesée
                    </button>
                </div>
            ) : (
                <div key="weight-form" className="glass-card fs-reveal p-5 sm:p-6">
                    <h4 className="font-bold text-brand-ink mb-4">Nouvelle pesée</h4>
                    {formError && (
                        <div className="mb-4 p-3 rounded-xl text-sm border bg-red-50/80 border-red-200 text-red-800 flex items-start gap-2">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            {formError}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">Poids (kg)</label>
                            <input type="number" step="0.1" min="20" max="250" value={form.weight}
                                onChange={e => setForm({ ...form, weight: e.target.value })}
                                placeholder="Ex: 65.5" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">Notes (optionnel)</label>
                            <input type="text" value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                                placeholder="Ex: après le petit-déjeuner" className="input-field" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={save} disabled={saving || !form.weight} className="btn-primary flex-1">
                                {saving ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-secondary">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* History */}
            {entries.length > 0 && (
                <div className="glass-card p-5 sm:p-6">
                    <h4 className="font-bold text-brand-ink mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-brand-primary" /> Historique des pesées
                    </h4>
                    <div className="space-y-2">
                        {entries.map((e, i) => (
                            <div key={e.id || i} className="flex items-center justify-between p-3 rounded-xl bg-brand-bg/60 border border-brand-border">
                                <div>
                                    <p className="font-semibold text-brand-ink">{e.weight} kg</p>
                                    <p className="text-xs text-brand-muted">Semaine {e.week} · {formatShortDate(e.date)}</p>
                                </div>
                                {i < entries.length - 1 && (
                                    <span className={`text-xs font-bold ${(e.weight - entries[i + 1].weight) >= 0 ? 'text-brand-primary' : 'text-green-500'}`}>
                                        {(e.weight - entries[i + 1].weight) >= 0 ? '+' : ''}{(e.weight - entries[i + 1].weight).toFixed(1)} kg
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended gain info */}
            <GlassCard className="p-5">
                <h4 className="font-bold text-brand-ink mb-3 flex items-center gap-2">
                    <Scale size={16} className="text-brand-primary" /> Prise de poids recommandée
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border">
                        <p className="text-xs text-brand-muted mb-1">IMC {"<"} 18.5</p>
                        <p className="font-bold text-brand-ink">12.5 - 18 kg</p>
                    </div>
                    <div className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border">
                        <p className="text-xs text-brand-muted mb-1">IMC 18.5 - 24.9</p>
                        <p className="font-bold text-brand-ink">11.5 - 16 kg</p>
                    </div>
                    <div className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border">
                        <p className="text-xs text-brand-muted mb-1">IMC ≥ 25</p>
                        <p className="font-bold text-brand-ink">7 - 11.5 kg</p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}

/* ════════════════════════════════════════════════════
   PREGNANCY SYMPTOMS COMPONENT
   ════════════════════════════════════════════════════ */
function PregnancySymptomsTab({ pregnancyId }) {
    const [symptoms, setSymptoms] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedSymptom, setSelectedSymptom] = useState('');
    const [selectedIntensity, setSelectedIntensity] = useState('modéré');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (!pregnancyId) return;
        window.axios.get(`/api/v1/pregnancies/${pregnancyId}/symptoms`)
            .then(r => setSymptoms(Array.isArray(r.data) ? r.data.map(mapSymptomFromApi) : []))
            .catch(() => {});
    }, [pregnancyId]);

    const addSymptom = async () => {
        if (!selectedSymptom || !pregnancyId) return;
        setSaving(true);
        setFormError('');
        try {
            const r = await window.axios.post(`/api/v1/pregnancies/${pregnancyId}/symptoms`, {
                name: selectedSymptom,
                intensity: selectedIntensity,
                notes: notes || null,
            });
            const saved = r.data?.symptom || r.data;
            setSymptoms(prev => [mapSymptomFromApi(saved), ...prev]);
            setSelectedSymptom('');
            setSelectedIntensity('modéré');
            setNotes('');
            setShowForm(false);
        } catch (e) {
            const data = e.response?.data;
            const validationMsg = data?.errors
                ? Object.values(data.errors).flat().join(' ')
                : null;
            setFormError(validationMsg || data?.message || 'Erreur lors de l\'enregistrement.');
        } finally {
            setSaving(false);
        }
    };

    const removeSymptom = async (id) => {
        try {
            await window.axios.delete(`/api/v1/pregnancy-symptoms/${id}`);
            setSymptoms(prev => prev.filter(s => s.id !== id));
        } catch {
            // keep list unchanged on failure
        }
    };

    const getIntensityStyle = (intensity) => {
        return INTENSITY_LEVELS.find(l => l.value === intensity) || INTENSITY_LEVELS[1];
    };

    // Group symptoms by name for overview
    const symptomCounts = symptoms.reduce((acc, s) => {
        acc[s.name] = (acc[s.name] || 0) + 1;
        return acc;
    }, {});
    const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Quick stats */}
            {topSymptoms.length > 0 && (
                <div className="glass-card p-5 sm:p-6">
                    <h4 className="font-bold text-brand-ink mb-4">Symptômes les plus fréquents</h4>
                    <div className="flex flex-wrap gap-2">
                        {topSymptoms.map(([name, count]) => (
                            <span key={name} className="px-3 py-1.5 rounded-full bg-brand-soft border border-brand-border text-sm font-medium text-brand-primary">
                                {name} <span className="text-brand-primary/70 ml-1">×{count}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Add symptom button/form */}
            {!showForm ? (
                <div key="symptom-add" className="fs-reveal py-1">
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="btn-primary flex items-center gap-2 group"
                    >
                        <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
                        Saisir un symptôme
                    </button>
                </div>
            ) : (
                <div key="symptom-form" className="glass-card fs-reveal p-5 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-brand-ink">Nouveau symptôme</h4>
                        <button onClick={() => setShowForm(false)} className="text-brand-muted hover:text-brand-muted">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formError && (
                            <div className="p-3 rounded-xl text-sm border bg-red-50/80 border-red-200 text-red-800 flex items-start gap-2">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                {formError}
                            </div>
                        )}
                        {/* Symptom selector */}
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">Type de symptôme</label>
                            <div className="flex flex-wrap gap-2">
                                {SYMPTOM_LIST.map(s => (
                                    <button key={s} onClick={() => setSelectedSymptom(s)}
                                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border-2 ${selectedSymptom === s ? 'border-brand-primary bg-brand-soft text-brand-primary' : 'border-brand-border text-brand-muted hover:border-brand-primary/30 bg-white'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Intensity */}
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">Intensité</label>
                            <div className="flex gap-2">
                                {INTENSITY_LEVELS.map(level => (
                                    <button key={level.value} onClick={() => setSelectedIntensity(level.value)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${selectedIntensity === level.value ? 'border-brand-primary ' + level.color : 'border-brand-border text-brand-muted bg-white hover:border-brand-primary/30'}`}>
                                        {level.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">Notes (optionnel)</label>
                            <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
                                placeholder="Détails supplémentaires..." className="input-field" />
                        </div>

                        <button onClick={addSymptom} disabled={!selectedSymptom || saving}
                            className="btn-primary w-full disabled:opacity-50">
                            {saving ? 'Enregistrement...' : 'Enregistrer le symptôme'}
                        </button>
                    </div>
                </div>
            )}

            {/* Symptoms log */}
            {symptoms.length > 0 && (
                <div className="glass-card p-5 sm:p-6">
                    <h4 className="font-bold text-brand-ink mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-brand-primary" /> Journal des symptômes
                    </h4>
                    <div className="space-y-2">
                        {symptoms.map((s) => {
                            const style = getIntensityStyle(s.intensity);
                            return (
                                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-brand-bg/60 border border-brand-border group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></div>
                                        <div>
                                            <p className="font-semibold text-brand-ink text-sm">{s.name}</p>
                                            <p className="text-xs text-brand-muted">{s.date} à {s.time}{s.notes ? ` · ${s.notes}` : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${style.color}`}>
                                            {style.label}
                                        </span>
                                        <button onClick={() => removeSymptom(s.id)}
                                            className="opacity-0 group-hover:opacity-100 text-brand-muted hover:text-red-500 transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* No symptoms */}
            {symptoms.length === 0 && !showForm && (
                <div className="glass-card text-center px-6 py-12">
                    <ClipboardList size={48} className="text-brand-border mx-auto mb-4" />
                    <h4 className="font-bold text-brand-ink mb-2">Aucun symptôme enregistré</h4>
                    <p className="text-sm text-brand-muted">Ajoutez vos symptômes pour en garder une trace et les partager avec votre médecin.</p>
                </div>
            )}

            {/* Common symptoms info */}
            <GlassCard className="p-5">
                <h4 className="font-bold text-brand-ink mb-3 flex items-center gap-2">
                    <Info size={16} className="text-brand-primary" /> Symptômes courants par trimestre
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border">
                        <p className="font-bold text-brand-ink mb-1">1er trimestre</p>
                        <p className="text-brand-muted text-xs">Nausées, fatigue, sensibilité des seins</p>
                    </div>
                    <div className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border">
                        <p className="font-bold text-brand-ink mb-1">2ème trimestre</p>
                        <p className="text-brand-muted text-xs">Maux de dos, brûlures d'estomac, crampes</p>
                    </div>
                    <div className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border">
                        <p className="font-bold text-brand-ink mb-1">3ème trimestre</p>
                        <p className="text-brand-muted text-xs">Insomnie, essoufflement, gonflements</p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}


/* ════════════════════════════════════════════════════
   MAIN PREGNANCIES PAGE
   ════════════════════════════════════════════════════ */
export default function Pregnancies() {
    const [preg, setPreg] = useState([]);
    const [active, setActive] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ start_date: '', due_date: '', pregnancy_type: 'simple', notes: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        window.axios.get('/api/v1/pregnancies').then(r => {
            const d = Array.isArray(r.data) ? r.data : (r.data.data || []);
            setPreg(d);
            if (d.length > 0) setActive(d[0]);
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const currentWeek = active ? (active.current_week || Math.max(1, Math.floor((new Date() - new Date(active.start_date)) / (1000 * 60 * 60 * 24 * 7)))) : 0;
    const weekInfo = weeks.reduce((best, w) => (w.w <= currentWeek ? w : best), weeks[0]);
    const progress = Math.min(100, (currentWeek / 40) * 100);

    const save = async () => {
        setSaving(true);
        setFormError('');
        try {
            const r = await window.axios.post('/api/v1/pregnancies', form);
            const pregnancy = r.data?.pregnancy || r.data;
            setPreg([pregnancy, ...preg]);
            setActive(pregnancy);
            setShowForm(false);
        } catch (e) {
            setFormError(e.response?.data?.message || 'Erreur lors de l\'enregistrement.');
        } finally {
            setSaving(false);
        }
    };

    const pregnancyTypeLabel =
        active?.pregnancy_type === 'twins'
            ? 'Jumeaux'
            : active?.pregnancy_type === 'triplets'
              ? 'Triplés'
              : 'Simple';

    const trimesterLabel =
        currentWeek <= 12 ? '1er' : currentWeek <= 26 ? '2ème' : '3ème';

    const trimesters = [
        { n: '1er Trimestre', w: '1-12 semaines', done: currentWeek >= 12 },
        { n: '2ème Trimestre', w: '13-26 semaines', done: currentWeek >= 26 },
        { n: '3ème Trimestre', w: '27-40 semaines', done: currentWeek >= 40 },
    ];

    return (
        <AppLayout title="Suivi de grossesse">
            <Head title="Suivi de grossesse - FeminaSante" />

            <p className="text-brand-muted text-sm mb-6">
                Suivez votre grossesse semaine par semaine — bébé, symptômes, poids et rendez-vous.
            </p>

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

            {/* ── No pregnancy yet ── */}
            {!loading && !active && !showForm && (
                <GlassCard className="p-8 sm:p-10 w-full">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary shrink-0">
                                    <Baby size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-ink mb-2">
                                        Commencer le suivi de votre grossesse
                                    </h2>
                                    <p className="text-brand-muted text-sm leading-relaxed">
                                        Suivez la croissance de votre bébé semaine par semaine, enregistrez les
                                        contrôles et surveillez vos symptômes.
                                    </p>
                                </div>
                            </div>
                            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-brand-muted">
                                {[
                                    'Calendrier semaine par semaine',
                                    'Compteur de coups de pied',
                                    'Chronomètre de contractions',
                                    'Suivi du poids & rendez-vous',
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-brand-primary shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:w-72 shrink-0 flex flex-col items-stretch lg:items-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(true);
                                    setFormError('');
                                }}
                                className="btn-primary inline-flex items-center justify-center gap-2 py-3"
                            >
                                <Plus size={18} /> Commencer le suivi
                            </button>
                            <p className="text-xs text-brand-muted text-center lg:text-right">
                                Quelques informations suffisent pour démarrer.
                            </p>
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* ── Create form ── */}
            {!loading && showForm && (
                <GlassCard className="p-6 sm:p-8 w-full">
                    <h3 className="text-xl font-bold text-brand-ink mb-2">Nouvelle grossesse</h3>
                    <p className="text-sm text-brand-muted mb-6">
                        Indiquez la date de vos dernières règles pour calculer automatiquement la semaine de
                        grossesse.
                    </p>
                    {formError && (
                        <div className="mb-4 p-3 rounded-xl text-sm border bg-red-50/80 border-red-200 text-red-800 flex items-start gap-2">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            {formError}
                        </div>
                    )}
                    <div className="grid lg:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">
                                Date des dernières règles
                            </label>
                            <input
                                type="date"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">
                                Date d&apos;accouchement prévue (optionnel)
                            </label>
                            <input
                                type="date"
                                value={form.due_date}
                                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">
                                Type de grossesse
                            </label>
                            <select
                                value={form.pregnancy_type}
                                onChange={(e) => setForm({ ...form, pregnancy_type: e.target.value })}
                                className="input-field"
                            >
                                <option value="simple">Simple</option>
                                <option value="twins">Jumeaux</option>
                                <option value="triplets">Triplés</option>
                            </select>
                        </div>
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-brand-ink mb-2">Notes</label>
                            <textarea
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                rows={3}
                                placeholder="Informations utiles pour votre suivi…"
                                className="input-field resize-none"
                            />
                        </div>
                        <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="button"
                                onClick={save}
                                disabled={saving}
                                className="sm:flex-1 btn-primary"
                            >
                                {saving ? 'Enregistrement…' : 'Commencer'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setFormError('');
                                }}
                                className="sm:flex-1 btn-secondary"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* ── Active pregnancy ── */}
            {!loading && active && (
                <div className="space-y-6">
                    <GlassCard className="p-6">
                        <div className="grid md:grid-cols-2 gap-6 items-center">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary shrink-0">
                                    <Sprout size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                                        {weekInfo.label}
                                    </p>
                                    <h2 className="text-2xl font-bold text-brand-ink mt-1">
                                        Semaine {currentWeek}
                                    </h2>
                                    <p className="text-sm text-brand-muted mt-1">{weekInfo.d}</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-semibold text-brand-muted mb-2">
                                    <span>Semaine 1</span>
                                    <span className="text-brand-primary">{Math.round(progress)}%</span>
                                    <span>Semaine 40</span>
                                </div>
                                <div className="w-full bg-brand-border rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-2 rounded-full bg-brand-primary transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatTile
                            label="Semaines restantes"
                            value={Math.max(0, 40 - currentWeek)}
                            sub="avant terme"
                            icon={Calendar}
                        />
                        <StatTile
                            label="Date prévue"
                            value={
                                active.due_date
                                    ? new Date(active.due_date).toLocaleDateString('fr-FR', {
                                          month: 'short',
                                          day: 'numeric',
                                      })
                                    : '—'
                            }
                            sub={active.due_date ? 'accouchement' : 'À définir'}
                            icon={Baby}
                        />
                        <StatTile label="Trimestre" value={trimesterLabel} sub="en cours" icon={Heart} />
                        <StatTile label="Type" value={pregnancyTypeLabel} sub="de grossesse" icon={Activity} />
                    </div>

                    <FilterPills
                        options={TABS.map((tab) => ({ value: tab.id, label: tab.label }))}
                        value={activeTab}
                        onChange={setActiveTab}
                        size="md"
                        className="overflow-x-auto flex-nowrap !flex-nowrap"
                    />

                    {/* Tab content */}
                    <div key={activeTab} className="fs-enter-item">
                        {activeTab === 'dashboard' && (
                            <PregnancyDashboard
                                pregnancyId={active.id}
                                currentWeek={currentWeek}
                                progress={progress}
                                weekInfo={weekInfo}
                                trimesters={trimesters}
                                onOpenTab={setActiveTab}
                            />
                        )}

                        {activeTab === 'kicks' && <KickCounterTab pregnancyId={active.id} />}
                        {activeTab === 'contractions' && <ContractionTimerTab pregnancyId={active.id} />}
                        {activeTab === 'weight' && <WeightTrackerTab pregnancyId={active.id} currentWeek={currentWeek} />}
                        {activeTab === 'symptoms' && <PregnancySymptomsTab pregnancyId={active.id} />}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
