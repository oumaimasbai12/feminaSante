import React, { useState, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Plus, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAYS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const moods = [{v:'happy',l:'Joyeuse',icon:'😊'},{v:'calm',l:'Calme',icon:'😐'},{v:'sad',l:'Triste',icon:'😔'},{v:'anxious',l:'Anxieuse',icon:'😟'},{v:'irritable',l:'Irritable',icon:'🥲'},{v:'other',l:'Autre',icon:'😴'}];
const flows = [{v:'light',l:'Léger'},{v:'medium',l:'Moyen'},{v:'heavy',l:'Abondant'}];

export default function Cycles() {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [cycles, setCycles] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ start_date: today.toISOString().split('T')[0], end_date: '', flow_intensity: 'medium', mood: 'calm', notes: '', phase: 'menstruation' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            window.axios.get('/api/v1/cycles').catch(() => ({ data: [] })),
            window.axios.get('/api/v1/predictions').catch(() => ({ data: { predictions: [] } })),
        ]).then(([cyclesRes, predictionsRes]) => {
            setCycles(Array.isArray(cyclesRes.data) ? cyclesRes.data : cyclesRes.data.data || []);
            setPredictions(predictionsRes.data?.predictions || []);
        });
    }, []);

    const daysInMonth = new Date(year, month+1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Get prediction dates
    const nextPeriodPrediction = predictions.find(p => p.type === 'period');
    const nextOvulationPrediction = predictions.find(p => p.type === 'ovulation');
    const fertileWindow = predictions.find(p => p.type === 'fertile_window');

    const getDateStatus = (dateStr) => {
        const d = new Date(dateStr);
        
        // Check if it's a logged period
        for (const c of cycles) {
            const s = new Date(c.start_date), e = c.end_date ? new Date(c.end_date) : new Date(s.getTime()+5*86400000);
            if (d >= s && d <= e) return { type: 'period', intensity: c.flow_intensity };
        }

        // Check if it's a predicted period
        if (nextPeriodPrediction) {
            const predictedStart = new Date(nextPeriodPrediction.predicted_date);
            // Assume period lasts 5 days
            const predictedEnd = new Date(predictedStart.getTime() + 5 * 86400000);
            if (d >= predictedStart && d <= predictedEnd) {
                return { type: 'predicted-period' };
            }
        }

        // Check if it's ovulation day
        if (nextOvulationPrediction) {
            const ovulationDate = new Date(nextOvulationPrediction.predicted_date);
            if (d.toDateString() === ovulationDate.toDateString()) {
                return { type: 'ovulation' };
            }
        }

        // Check if it's fertile window
        if (fertileWindow && fertileWindow.end_date) {
            const fertileStart = new Date(fertileWindow.predicted_date);
            const fertileEnd = new Date(fertileWindow.end_date);
            if (d >= fertileStart && d <= fertileEnd) {
                return { type: 'fertile' };
            }
        }

        return null;
    };

    const saveCycle = async () => {
        setSaving(true);
        try {
            const payload = {
                ...form,
                end_date: form.end_date || form.start_date,
            };
            const r = await window.axios.post('/api/v1/cycles', payload);
            const cycle = r.data?.cycle || r.data;
            setCycles([cycle, ...cycles]);
            setShowForm(false);
            
            // Refresh predictions
            window.axios.get('/api/v1/predictions').then(predictionsRes => {
                setPredictions(predictionsRes.data?.predictions || []);
            });
        } catch (e) { alert(e.response?.data?.message||'Error saving'); }
        setSaving(false);
    };

    return (
        <AppLayout title='Suivi du cycle'>
            <div className='grid lg:grid-cols-3 gap-6'>
                {/* Calendar */}
                <div className='lg:col-span-2'>
                    <div className='bg-white rounded-2xl p-8 border border-slate-200 shadow-sm'>
                        {/* Calendar header */}
                        <div className='flex items-center justify-between mb-6'>
                            <button onClick={() => { if(month===0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); }} className='p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors'>
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className='text-xl font-semibold text-slate-900'>{MONTHS[month]} {year}</h2>
                            <button onClick={() => { if(month===11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); }} className='p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors'>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        {/* Day headers */}
                        <div className='grid grid-cols-7 mb-4'>
                            {DAYS.map(d => <div key={d} className='text-center text-sm font-semibold text-slate-400 py-2'>{d}</div>)}
                        </div>
                        {/* Day cells */}
                        <div className='grid grid-cols-7 gap-3'>
                            {[...Array(firstDay)].map((_,i) => <div key={'e'+i} />)}
                            {[...Array(daysInMonth)].map((_,i) => {
                                const d = i+1;
                                const dateStr = year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
                                const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                const dateStatus = getDateStatus(dateStr);
                                
                                let buttonClass = 'relative aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 ';
                                
                                if (isToday) buttonClass += 'ring-2 ring-rose-500 ';
                                
                                if (dateStatus?.type === 'period') {
                                    buttonClass += 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-sm';
                                } else if (dateStatus?.type === 'predicted-period') {
                                    buttonClass += 'bg-rose-50 text-rose-700 border-2 border-dashed border-rose-300';
                                } else if (dateStatus?.type === 'ovulation') {
                                    buttonClass += 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm';
                                } else if (dateStatus?.type === 'fertile') {
                                    buttonClass += 'bg-blue-50 text-blue-700';
                                } else {
                                    buttonClass += 'text-slate-700 hover:bg-slate-50';
                                }

                                return (
                                    <button key={d} className={buttonClass}>
                                        {d}
                                        {dateStatus?.type === 'period' && <span className='absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/70' />}
                                    </button>
                                );
                            })}
                        </div>
                        {/* Legend */}
                        <div className='flex flex-wrap gap-6 mt-10 pt-6 border-t border-slate-100'>
                            {[
                                {c:'bg-gradient-to-br from-rose-500 to-rose-600',l:'Règles'},
                                {c:'bg-rose-50 border-2 border-dashed border-rose-300',l:'Prédiction règles'},
                                {c:'bg-gradient-to-br from-amber-500 to-amber-600',l:'Ovulation'},
                                {c:'bg-blue-50',l:'Fenêtre fertile'},
                                {c:'ring-2 ring-rose-500',l:'Aujourd\'hui'}
                            ].map(i => {
                                return (
                                    <div key={i.l} className='flex items-center gap-2'>
                                        <div className={'w-6 h-6 rounded-xl ' + i.c} />
                                        <span className='text-sm text-slate-600'>{i.l}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className='space-y-5'>
                    {/* Predictions Panel */}
                    {predictions.length > 0 && (
                        <div className='bg-gradient-to-br from-rose-50 to-orange-50 p-6 rounded-2xl border border-rose-100 shadow-sm'>
                            <h3 className='text-lg font-bold text-rose-900 mb-4'>Prédictions</h3>
                            <div className='space-y-3'>
                                {(() => {
                                    const period = predictions.find(p => p.type === 'period');
                                    const ovulation = predictions.find(p => p.type === 'ovulation');
                                    const fertile = predictions.find(p => p.type === 'fertile_window');
                                    const today = new Date();

                                    const formatDate = (dateStr) => {
                                        const d = new Date(dateStr);
                                        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                                    };

                                    const daysUntil = (dateStr) => {
                                        const d = new Date(dateStr);
                                        const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
                                        if (diff === 0) return "Aujourd'hui";
                                        if (diff < 0) return `Il y a ${Math.abs(diff)} jours`;
                                        return `Dans ${diff} jours`;
                                    };

                                    return (
                                        <>
                                            {period && (
                                                <div className='bg-white/70 p-4 rounded-xl border border-white/40'>
                                                    <p className='text-rose-700 text-sm font-semibold mb-1'>Prochaines Règles</p>
                                                    <p className='text-2xl font-black text-rose-600'>{daysUntil(period.predicted_date)}</p>
                                                    <p className='text-xs text-rose-800/70 mt-1'>Prévues le {formatDate(period.predicted_date)}</p>
                                                </div>
                                            )}
                                            {ovulation && (
                                                <div className='bg-white/70 p-4 rounded-xl border border-white/40'>
                                                    <p className='text-amber-700 text-sm font-semibold mb-1'>Ovulation</p>
                                                    <p className='text-xl font-bold text-amber-600'>{daysUntil(ovulation.predicted_date)}</p>
                                                    <p className='text-xs text-amber-800/70 mt-1'>Prévue le {formatDate(ovulation.predicted_date)}</p>
                                                </div>
                                            )}
                                            {fertile && (
                                                <div className='bg-white/70 p-4 rounded-xl border border-white/40'>
                                                    <p className='text-blue-700 text-sm font-semibold mb-1'>Fenêtre Fertile</p>
                                                    <p className='text-sm font-bold text-blue-600'>{formatDate(fertile.predicted_date)} - {formatDate(fertile.end_date)}</p>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Add button */}
                    <button onClick={() => setShowForm(!showForm)} className='w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm'>
                        <Plus size={20} /> Enregistrer un cycle
                    </button>

                    {/* Form */}
                    {showForm && (
                        <div className='bg-white rounded-2xl p-6 border border-slate-200 shadow-sm'>
                            <h3 className='text-lg font-semibold text-slate-900 mb-6'>Enregistrer un cycle</h3>
                            <div className='space-y-5'>
                                <div>
                                    <label className='block text-sm font-semibold text-slate-700 mb-2'>Date de début</label>
                                    <input type='date' value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-50 outline-none transition-all' />
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-slate-700 mb-2'>Date de fin (optionnel)</label>
                                    <input type='date' value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-50 outline-none transition-all' />
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-slate-700 mb-3'>Intensité du flux</label>
                                    <div className='grid grid-cols-3 gap-2'>
                                        {flows.map(f => {
                                            return (
                                                <button key={f.v} onClick={() => setForm({...form,flow_intensity:f.v})} className={'px-4 py-3 rounded-xl text-sm font-semibold transition-all ' + (form.flow_intensity === f.v ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-slate-600 border border-slate-200 hover:border-rose-100')}>
                                                    {f.l}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-slate-700 mb-3'>Humeur</label>
                                    <div className='grid grid-cols-3 gap-2'>
                                        {moods.map(m => {
                                            return (
                                                <button key={m.v} onClick={() => setForm({...form,mood:m.v})} className={'px-3 py-3 rounded-xl text-sm font-medium transition-all text-center ' + (form.mood === m.v ? 'bg-rose-50 border border-rose-200' : 'border border-slate-200 hover:border-rose-100')}>
                                                    <div className='text-2xl mb-1'>{m.icon}</div>
                                                    <div className='text-slate-700'>{m.l}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-slate-700 mb-2'>Notes</label>
                                    <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3} placeholder='Comment vous sentez-vous ?' className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-50 outline-none transition-all resize-none' />
                                </div>
                                <div className='flex gap-3'>
                                    <button onClick={saveCycle} disabled={saving} className='flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm disabled:opacity-50'>
                                        {saving && <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />}
                                        Enregistrer
                                    </button>
                                    <button onClick={() => setShowForm(false)} className='flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all'>
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent cycles */}
                    <div className='bg-white rounded-2xl p-6 border border-slate-200 shadow-sm'>
                        <h3 className='text-lg font-semibold text-slate-900 mb-5'>Cycles récents</h3>
                        {cycles.length === 0 ? (
                            <div className='text-center py-10'>
                                <div className='text-5xl mb-3'>🌸</div>
                                <p className='text-slate-500'>Aucun cycle enregistré</p>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {cycles.slice(0,5).map((c,i) => {
                                    return (
                                        <div key={i} className='flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors'>
                                            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center flex-shrink-0'>
                                                <Droplets size={18} className='text-white' />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <div className='text-sm font-semibold text-slate-900'>
                                                    {new Date(c.start_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className='text-xs text-slate-500 capitalize mt-0.5'>{c.flow_intensity} • {c.mood}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
