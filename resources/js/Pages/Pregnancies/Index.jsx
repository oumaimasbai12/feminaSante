import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Baby, Plus, Heart, Weight, Activity, Calendar, CheckCircle, AlertCircle, Clock, X, TrendingUp, Footprints, Timer, Scale, Thermometer, ChevronRight, Trash2 } from 'lucide-react';

/* ───────── Fruit milestones ───────── */
const weeks = [
    { w: 4, m: '🌱', d: 'Taille d\'une graine de pavot' },
    { w: 8, m: '🫐', d: 'Taille d\'une framboise' },
    { w: 12, m: '🍋', d: 'Taille d\'un citron vert' },
    { w: 16, m: '🥑', d: 'Taille d\'un avocat' },
    { w: 20, m: '🍌', d: 'Taille d\'une banane' },
    { w: 24, m: '🌽', d: 'Taille d\'un épi de maïs' },
    { w: 28, m: '🍆', d: 'Taille d\'une aubergine' },
    { w: 32, m: '🎃', d: 'Taille d\'une courge' },
    { w: 36, m: '🍈', d: 'Taille d\'un melon' },
    { w: 40, m: '👶', d: 'Bébé est prêt à vous rencontrer !' },
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
                start_time: startTime.toTimeString().slice(0, 5),
                end_time: now.toTimeString().slice(0, 5),
                kicks_count: kicks,
                time_to_10_kicks: timeTo10,
                activity_level: kicks >= 10 ? 'high' : kicks >= 5 ? 'normal' : 'low',
            });
            const newEntry = r.data?.kick_counter || r.data;
            setHistory(prev => [newEntry, ...prev].slice(0, 10));
        } catch (e) { console.error(e); }
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
            <div className="card text-center">
                <div className="mb-2">
                    <span className="text-6xl">👣</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Compteur de Mouvements</h3>
                <p className="text-sm text-gray-500 mb-6">Suivez l'activité de votre bébé en comptant ses mouvements.</p>

                {!sessionActive ? (
                    <button onClick={startSession} className="btn-primary mx-auto flex items-center gap-2 text-lg px-8 py-4">
                        <Activity size={20} /> Démarrer une session
                    </button>
                ) : (
                    <div className="space-y-6">
                        {/* Timer */}
                        <div className="flex items-center justify-center gap-6">
                            <div className="text-center">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Durée</p>
                                <p className="text-3xl font-mono font-bold text-gray-900">{formatTime(elapsed)}</p>
                            </div>
                            <div className="w-px h-12 bg-gray-200"></div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Coups</p>
                                <p className="text-5xl font-black text-pink-600">{kicks}</p>
                            </div>
                        </div>

                        {/* Kick button */}
                        <button
                            onClick={recordKick}
                            className="w-28 h-28 mx-auto rounded-full flex items-center justify-center text-white text-4xl font-bold transition-all duration-150 active:scale-90 shadow-lg hover:shadow-xl"
                            style={{ background: 'linear-gradient(135deg, #f472b6, #fb7185)' }}
                        >
                            +1
                        </button>
                        <p className="text-gray-400 text-xs">Appuyez à chaque mouvement ressenti</p>

                        {/* 10 kicks indicator */}
                        {kicks >= 10 && (
                            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-xl p-3">
                                <CheckCircle size={18} />
                                <span className="font-semibold text-sm">10 mouvements atteints ! Très bon signe ✨</span>
                            </div>
                        )}

                        <button onClick={endSession} disabled={saving}
                            className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 mx-auto">
                            {saving ? 'Enregistrement...' : '⏹ Terminer et enregistrer'}
                        </button>
                    </div>
                )}
            </div>

            {/* History */}
            {history.length > 0 && (
                <div className="card">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-pink-500" /> Historique récent
                    </h4>
                    <div className="space-y-2">
                        {history.map((h, i) => (
                            <div key={h.id || i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{h.kicks_count} mouvement{h.kicks_count > 1 ? 's' : ''}</p>
                                    <p className="text-xs text-gray-400">{h.date} · {h.start_time} - {h.end_time || '?'}</p>
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
            <div className="card" style={{ background: 'linear-gradient(135deg, #fdf2f8, #fff5f5)' }}>
                <h4 className="font-bold text-gray-800 mb-3">💡 Conseils</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2"><span className="text-pink-400 mt-0.5">•</span> Comptez les mouvements à la même heure chaque jour</li>
                    <li className="flex items-start gap-2"><span className="text-pink-400 mt-0.5">•</span> 10 mouvements en 2 heures est un bon objectif</li>
                    <li className="flex items-start gap-2"><span className="text-pink-400 mt-0.5">•</span> Consultez si vous remarquez une baisse significative d'activité</li>
                </ul>
            </div>
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
        { value: 'mild', label: 'Légère', emoji: '😊' },
        { value: 'moderate', label: 'Modérée', emoji: '😐' },
        { value: 'strong', label: 'Forte', emoji: '😣' },
        { value: 'very strong', label: 'Très forte', emoji: '😰' },
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
            <div className="card text-center">
                <div className="mb-3">
                    <span className="text-5xl">⏱️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Chronomètre de Contractions</h3>
                <p className="text-sm text-gray-500 mb-6">Minutez la durée et la fréquence de vos contractions.</p>

                {/* Timer display */}
                <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-36 h-36 rounded-full text-4xl font-mono font-bold transition-all duration-300 ${isTiming ? 'text-white shadow-xl scale-105' : 'text-gray-400 border-4 border-dashed border-gray-200'}`}
                        style={isTiming ? { background: 'linear-gradient(135deg, #ef4444, #f87171)', animation: 'pulse 1.5s ease-in-out infinite' } : {}}>
                        {fmtDuration(elapsed)}
                    </div>
                </div>

                {/* Intensity selector */}
                <div className="mb-6">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Intensité ressentie</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                        {intensityOptions.map(opt => (
                            <button key={opt.value} onClick={() => setIntensity(opt.value)}
                                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${intensity === opt.value ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>
                                {opt.emoji} {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Start/Stop button */}
                <button
                    onClick={isTiming ? stopContraction : startContraction}
                    disabled={saving}
                    className={`px-10 py-4 rounded-2xl font-bold text-lg text-white transition-all shadow-lg ${isTiming ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    style={!isTiming ? { background: 'linear-gradient(135deg, #f472b6, #fb7185)' } : {}}
                >
                    {saving ? 'Enregistrement...' : isTiming ? '⏹ Arrêter' : '▶ Démarrer'}
                </button>
            </div>

            {/* History */}
            {contractions.length > 0 && (
                <div className="card">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-pink-500" /> Contractions enregistrées
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                                    <th className="pb-3 pr-2">Heure</th>
                                    <th className="pb-3 pr-2">Durée</th>
                                    <th className="pb-3 pr-2">Intervalle</th>
                                    <th className="pb-3">Intensité</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {contractions.map((c, i) => (
                                    <tr key={c.id || i}>
                                        <td className="py-2.5 pr-2 text-gray-600">
                                            {c.start_time ? new Date(c.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="py-2.5 pr-2 font-semibold text-gray-800">{fmtDuration(c.duration_seconds)}</td>
                                        <td className="py-2.5 pr-2 text-gray-600">{fmtInterval(c.interval_seconds)}</td>
                                        <td className="py-2.5">
                                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${c.intensity === 'very strong' ? 'bg-red-100 text-red-700' : c.intensity === 'strong' ? 'bg-orange-100 text-orange-700' : c.intensity === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
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
            <div className="card" style={{ background: 'linear-gradient(135deg, #fef3c7, #fffbeb)' }}>
                <h4 className="font-bold text-amber-900 mb-3">📞 Quand contacter la maternité ?</h4>
                <ul className="space-y-2 text-sm text-amber-800">
                    <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Contractions régulières toutes les 5 minutes pendant 1 heure</li>
                    <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Durée des contractions d'environ 1 minute chacune</li>
                    <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Intensité croissante qui ne diminue pas au repos</li>
                    <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Perte des eaux ou saignements</li>
                </ul>
            </div>
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

    useEffect(() => {
        if (!pregnancyId) return;
        window.axios.get(`/api/v1/pregnancies/${pregnancyId}/weight-gains`)
            .then(r => setEntries(Array.isArray(r.data) ? r.data : []))
            .catch(() => {});
    }, [pregnancyId]);

    const save = async () => {
        if (!form.weight || !pregnancyId) return;
        setSaving(true);
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
            alert(e.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
        setSaving(false);
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
            <div className="grid grid-cols-3 gap-4">
                <div className="card text-center">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Poids initial</p>
                    <p className="text-2xl font-bold text-gray-900">{firstWeight ? `${firstWeight}` : '-'}<span className="text-sm text-gray-400 ml-1">kg</span></p>
                </div>
                <div className="card text-center">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Poids actuel</p>
                    <p className="text-2xl font-bold text-gray-900">{lastWeight ? `${lastWeight}` : '-'}<span className="text-sm text-gray-400 ml-1">kg</span></p>
                </div>
                <div className="card text-center">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Prise totale</p>
                    <p className={`text-2xl font-bold ${gain && gain >= 0 ? 'text-pink-600' : 'text-gray-900'}`}>
                        {gain ? `+${gain}` : '-'}<span className="text-sm text-gray-400 ml-1">kg</span>
                    </p>
                </div>
            </div>

            {/* Visual chart */}
            {entries.length > 1 && (
                <div className="card">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-pink-500" /> Courbe de poids
                    </h4>
                    <div className="flex items-end gap-1 h-32">
                        {[...entries].reverse().map((e, i) => {
                            const height = ((e.weight - minWeight) / range) * 100;
                            return (
                                <div key={e.id || i} className="flex-1 flex flex-col items-center gap-1" title={`${e.weight}kg — Sem. ${e.week}`}>
                                    <span className="text-[10px] text-gray-400 font-medium">{e.weight}</span>
                                    <div className="w-full rounded-t-lg transition-all duration-300" style={{
                                        height: `${Math.max(8, height)}%`,
                                        background: `linear-gradient(180deg, #f472b6 0%, #fbcfe8 100%)`,
                                    }}></div>
                                    <span className="text-[10px] text-gray-400">S{e.week}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Add weight form */}
            {!showForm ? (
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Ajouter une pesée
                </button>
            ) : (
                <div className="card">
                    <h4 className="font-bold text-gray-900 mb-4">Nouvelle pesée</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Poids (kg)</label>
                            <input type="number" step="0.1" min="20" max="250" value={form.weight}
                                onChange={e => setForm({ ...form, weight: e.target.value })}
                                placeholder="Ex: 65.5" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (optionnel)</label>
                            <input type="text" value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                                placeholder="Ex: après le petit-déjeuner" className="input-field" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={save} disabled={saving || !form.weight} className="btn-primary flex-1">
                                {saving ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <button onClick={() => setShowForm(false)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl px-4 py-3 hover:bg-gray-50 transition-all">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* History */}
            {entries.length > 0 && (
                <div className="card">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-pink-500" /> Historique des pesées
                    </h4>
                    <div className="space-y-2">
                        {entries.map((e, i) => (
                            <div key={e.id || i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div>
                                    <p className="font-semibold text-gray-800">{e.weight} kg</p>
                                    <p className="text-xs text-gray-400">Semaine {e.week} · {e.date}</p>
                                </div>
                                {i < entries.length - 1 && (
                                    <span className={`text-xs font-bold ${(e.weight - entries[i + 1].weight) >= 0 ? 'text-pink-500' : 'text-green-500'}`}>
                                        {(e.weight - entries[i + 1].weight) >= 0 ? '+' : ''}{(e.weight - entries[i + 1].weight).toFixed(1)} kg
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended gain info */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #f0fdf9)' }}>
                <h4 className="font-bold text-emerald-900 mb-3">📊 Prise de poids recommandée</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-white/70 p-3 rounded-xl">
                        <p className="text-xs text-gray-400 mb-1">IMC {"<"} 18.5</p>
                        <p className="font-bold text-emerald-700">12.5 - 18 kg</p>
                    </div>
                    <div className="bg-white/70 p-3 rounded-xl">
                        <p className="text-xs text-gray-400 mb-1">IMC 18.5 - 24.9</p>
                        <p className="font-bold text-emerald-700">11.5 - 16 kg</p>
                    </div>
                    <div className="bg-white/70 p-3 rounded-xl">
                        <p className="text-xs text-gray-400 mb-1">IMC ≥ 25</p>
                        <p className="font-bold text-emerald-700">7 - 11.5 kg</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════
   PREGNANCY SYMPTOMS COMPONENT
   ════════════════════════════════════════════════════ */
function PregnancySymptomsTab() {
    const [symptoms, setSymptoms] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedSymptom, setSelectedSymptom] = useState('');
    const [selectedIntensity, setSelectedIntensity] = useState('modéré');
    const [notes, setNotes] = useState('');

    const addSymptom = () => {
        if (!selectedSymptom) return;
        const newSymptom = {
            id: Date.now(),
            name: selectedSymptom,
            intensity: selectedIntensity,
            notes: notes,
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
        setSymptoms(prev => [newSymptom, ...prev]);
        setSelectedSymptom('');
        setSelectedIntensity('modéré');
        setNotes('');
        setShowForm(false);
    };

    const removeSymptom = (id) => {
        setSymptoms(prev => prev.filter(s => s.id !== id));
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
                <div className="card">
                    <h4 className="font-bold text-gray-900 mb-4">Symptômes les plus fréquents</h4>
                    <div className="flex flex-wrap gap-2">
                        {topSymptoms.map(([name, count]) => (
                            <span key={name} className="px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-sm font-medium text-pink-700">
                                {name} <span className="text-pink-400 ml-1">×{count}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Add symptom button/form */}
            {!showForm ? (
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Saisir un symptôme
                </button>
            ) : (
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-900">Nouveau symptôme</h4>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {/* Symptom selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type de symptôme</label>
                            <div className="flex flex-wrap gap-2">
                                {SYMPTOM_LIST.map(s => (
                                    <button key={s} onClick={() => setSelectedSymptom(s)}
                                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border-2 ${selectedSymptom === s ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-100 text-gray-500 hover:border-gray-200 bg-white'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Intensity */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Intensité</label>
                            <div className="flex gap-2">
                                {INTENSITY_LEVELS.map(level => (
                                    <button key={level.value} onClick={() => setSelectedIntensity(level.value)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${selectedIntensity === level.value ? 'border-pink-400 ' + level.color : 'border-gray-100 text-gray-400 bg-white hover:border-gray-200'}`}>
                                        {level.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (optionnel)</label>
                            <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
                                placeholder="Détails supplémentaires..." className="input-field" />
                        </div>

                        <button onClick={addSymptom} disabled={!selectedSymptom}
                            className="btn-primary w-full disabled:opacity-50">
                            Enregistrer le symptôme
                        </button>
                    </div>
                </div>
            )}

            {/* Symptoms log */}
            {symptoms.length > 0 && (
                <div className="card">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-pink-500" /> Journal des symptômes
                    </h4>
                    <div className="space-y-2">
                        {symptoms.map((s) => {
                            const style = getIntensityStyle(s.intensity);
                            return (
                                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                                            <p className="text-xs text-gray-400">{s.date} à {s.time}{s.notes ? ` · ${s.notes}` : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${style.color}`}>
                                            {style.label}
                                        </span>
                                        <button onClick={() => removeSymptom(s.id)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all">
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
                <div className="card text-center py-12">
                    <span className="text-5xl mb-4 block">📋</span>
                    <h4 className="font-bold text-gray-800 mb-2">Aucun symptôme enregistré</h4>
                    <p className="text-sm text-gray-500">Ajoutez vos symptômes pour en garder une trace et les partager avec votre médecin.</p>
                </div>
            )}

            {/* Common symptoms info */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff, #f0f9ff)' }}>
                <h4 className="font-bold text-blue-900 mb-3">ℹ️ Symptômes courants par trimestre</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-white/70 p-3 rounded-xl">
                        <p className="font-bold text-blue-700 mb-1">1er trimestre</p>
                        <p className="text-blue-600/70 text-xs">Nausées, fatigue, sensibilité des seins</p>
                    </div>
                    <div className="bg-white/70 p-3 rounded-xl">
                        <p className="font-bold text-blue-700 mb-1">2ème trimestre</p>
                        <p className="text-blue-600/70 text-xs">Maux de dos, brûlures d'estomac, crampes</p>
                    </div>
                    <div className="bg-white/70 p-3 rounded-xl">
                        <p className="font-bold text-blue-700 mb-1">3ème trimestre</p>
                        <p className="text-blue-600/70 text-xs">Insomnie, essoufflement, gonflements</p>
                    </div>
                </div>
            </div>
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
        try {
            const r = await window.axios.post('/api/v1/pregnancies', form);
            const pregnancy = r.data?.pregnancy || r.data;
            setPreg([pregnancy, ...preg]);
            setActive(pregnancy);
            setShowForm(false);
        } catch (e) { alert(e.response?.data?.message || 'Erreur'); }
    };

    const trimesters = [
        { n: '1er Trimestre', w: '1-12 semaines', done: currentWeek >= 12 },
        { n: '2ème Trimestre', w: '13-26 semaines', done: currentWeek >= 26 },
        { n: '3ème Trimestre', w: '27-40 semaines', done: currentWeek >= 40 },
    ];

    return (
        <AppLayout title='Suivi de grossesse'>
            {loading && (
                <div className='flex items-center justify-center h-64'>
                    <div className='w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin'></div>
                </div>
            )}

            {/* ── No pregnancy yet ── */}
            {!loading && !active && !showForm && (
                <div className='text-center py-20 card max-w-lg mx-auto'>
                    <div className='text-7xl mb-6'>👶</div>
                    <h2 className='text-2xl font-extrabold text-gray-900 mb-3'>Commencer le suivi de votre grossesse</h2>
                    <p className='text-gray-500 mb-8 leading-relaxed'>Suivez la croissance de votre bébé semaine par semaine, enregistrez les contrôles, surveillez les symptômes et restez informée tout au long de votre parcours.</p>
                    <button onClick={() => setShowForm(true)} className='btn-primary flex items-center gap-2 mx-auto'>
                        <Plus size={18} /> Commencer le suivi
                    </button>
                </div>
            )}

            {/* ── Create form ── */}
            {!loading && showForm && (
                <div className='max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6'>
                    <h3 className='text-xl font-bold text-slate-900 mb-6'>Nouvelle grossesse</h3>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-2'>Date des dernières règles</label>
                            <input type='date' value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-2'>Date d'accouchement prévue (optionnel)</label>
                            <input type='date' value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all' />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-2'>Type de grossesse</label>
                            <select value={form.pregnancy_type} onChange={e => setForm({ ...form, pregnancy_type: e.target.value })} className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all'>
                                <option value='simple'>Simple</option>
                                <option value='twins'>Jumeaux</option>
                                <option value='triplets'>Triplés</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-2'>Notes</label>
                            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all resize-none' />
                        </div>
                        <div className='flex gap-3'>
                            <button onClick={save} className='flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm'>Commencer</button>
                            <button onClick={() => setShowForm(false)} className='flex-1 px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all'>Annuler</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Active pregnancy ── */}
            {!loading && active && (
                <div className='space-y-6'>
                    {/* Main tracker card */}
                    <div className='rounded-2xl p-6 text-white relative overflow-hidden' style={{ background: 'linear-gradient(135deg,#f472b6,#fb7185)' }}>
                        <div className='absolute inset-0 opacity-10' style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }}></div>
                        <div className='relative z-10 grid md:grid-cols-2 gap-6 items-center'>
                            <div>
                                <div className='text-6xl mb-4 text-center'>{weekInfo.m}</div>
                                <h2 className='text-2xl font-extrabold text-center mb-1'>Semaine {currentWeek}</h2>
                                <p className='text-pink-200 text-center text-sm mb-6'>{weekInfo.d}</p>
                                <div className='bg-white/20 rounded-full h-3 mb-2'>
                                    <div className='bg-white rounded-full h-3 transition-all' style={{ width: progress + '%' }}></div>
                                </div>
                                <div className='flex justify-between text-xs text-pink-200'>
                                    <span>Semaine 1</span>
                                    <span>{Math.round(progress)}% complété</span>
                                    <span>Semaine 40</span>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-3'>
                                {[
                                    { l: 'Semaines restantes', v: Math.max(0, 40 - currentWeek) },
                                    { l: 'Date prévue', v: active.due_date ? new Date(active.due_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }) : 'À définir' },
                                    { l: 'Trimestre', v: currentWeek <= 12 ? '1er' : currentWeek <= 26 ? '2ème' : '3ème' },
                                    { l: 'Type', v: active.pregnancy_type === 'twins' ? 'Jumeaux' : active.pregnancy_type === 'triplets' ? 'Triplés' : 'Simple' },
                                ].map(s => (
                                    <div key={s.l} className='bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center'>
                                        <div className='text-lg font-bold'>{s.v}</div>
                                        <div className='text-xs text-pink-200'>{s.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tab navigation */}
                    <div className="flex gap-1 p-1 rounded-2xl overflow-x-auto" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
                        {TABS.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${isActive
                                            ? 'text-white shadow-md'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                        }`}
                                    style={isActive ? { background: 'linear-gradient(135deg, #f472b6, #fb7185)' } : {}}>
                                    <Icon size={16} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab content */}
                    <div>
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                {/* Trimester progress */}
                                <div className='card'>
                                    <h3 className='font-bold text-gray-900 mb-4'>Progression des trimestres</h3>
                                    <div className='grid md:grid-cols-3 gap-4'>
                                        {trimesters.map((t, i) => (
                                            <div key={t.n} className={'p-4 rounded-2xl border-2 transition-all ' + (i === 0 && currentWeek <= 12 ? 'border-pink-400 bg-pink-50' : i === 1 && currentWeek > 12 && currentWeek <= 26 ? 'border-purple-400 bg-purple-50' : i === 2 && currentWeek > 26 ? 'border-indigo-400 bg-indigo-50' : 'border-gray-100 bg-gray-50')}>
                                                <div className='flex items-center gap-2 mb-2'>
                                                    {t.done ? <CheckCircle size={18} className='text-green-500' /> : <div className={'w-5 h-5 rounded-full border-2 ' + (i === 0 ? 'border-pink-400' : i === 1 ? 'border-purple-400' : 'border-indigo-400')}></div>}
                                                    <span className='font-bold text-gray-800 text-sm'>{t.n}</span>
                                                </div>
                                                <p className='text-xs text-gray-500'>{t.w}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick access tools */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {TABS.filter(t => t.id !== 'dashboard').map(tab => {
                                        const Icon = tab.icon;
                                        return (
                                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                                className="card card-hover text-center py-6 cursor-pointer group">
                                                <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' }}>
                                                    <Icon size={22} className="text-pink-600" />
                                                </div>
                                                <p className="font-semibold text-gray-800 text-sm">{tab.label}</p>
                                                <p className="text-xs text-gray-400 mt-1">Accéder à l'outil →</p>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Multiple pregnancies */}
                                {preg.length > 1 && (
                                    <div className="card">
                                        <h4 className="font-bold text-gray-900 mb-3">Vos grossesses</h4>
                                        <div className="space-y-2">
                                            {preg.map(p => (
                                                <button key={p.id} onClick={() => setActive(p)}
                                                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${p.id === active.id ? 'border-pink-400 bg-pink-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                                    <p className="font-semibold text-gray-800 text-sm">Grossesse du {new Date(p.start_date).toLocaleDateString('fr-FR')}</p>
                                                    <p className="text-xs text-gray-400">{p.pregnancy_type === 'twins' ? 'Jumeaux' : p.pregnancy_type === 'triplets' ? 'Triplés' : 'Simple'}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button onClick={() => setShowForm(true)} className='btn-primary flex items-center gap-2'>
                                    <Plus size={18} /> Ajouter une grossesse
                                </button>
                            </div>
                        )}

                        {activeTab === 'kicks' && <KickCounterTab pregnancyId={active.id} />}
                        {activeTab === 'contractions' && <ContractionTimerTab pregnancyId={active.id} />}
                        {activeTab === 'weight' && <WeightTrackerTab pregnancyId={active.id} currentWeek={currentWeek} />}
                        {activeTab === 'symptoms' && <PregnancySymptomsTab />}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
