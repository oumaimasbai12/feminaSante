import React, { useState, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Plus, ChevronLeft, ChevronRight, Droplets, Smile, Frown, Meh, Sun, Moon, Wind } from 'lucide-react';

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAYS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const moods = [{v:'happy',l:'Joyeuse',icon:'😊'},{v:'neutral',l:'Neutre',icon:'😐'},{v:'sad',l:'Triste',icon:'😔'},{v:'anxious',l:'Anxieuse',icon:'😟'},{v:'energetic',l:'Énergique',icon:'🥳'},{v:'tired',l:'Fatiguée',icon:'😴'}];
const flows = [{v:'light',l:'Léger',c:'bg-violet-200'},{v:'medium',l:'Moyen',c:'bg-violet-400'},{v:'heavy',l:'Abondant',c:'bg-violet-600'},{v:'spotting',l:'Spotting',c:'bg-violet-100'}];
const symptoms = ['Cramps','Headache','Bloating','Breast tenderness','Fatigue','Nausea','Back pain','Mood swings'];

export default function Cycles() {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [cycles, setCycles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ start_date: today.toISOString().split('T')[0], end_date: '', flow_intensity: 'medium', mood: 'neutral', notes: '', phase: 'period' });
    const [selected, setSelected] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        window.axios.get('/api/v1/cycles').then(r => setCycles(Array.isArray(r.data)?r.data:r.data.data||[])).catch(()=>{});
    }, []);

    const daysInMonth = new Date(year, month+1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const getCycleDay = (dateStr) => {
        const d = new Date(dateStr);
        for (const c of cycles) {
            const s = new Date(c.start_date), e = c.end_date ? new Date(c.end_date) : new Date(s.getTime()+5*86400000);
            if (d>=s && d<=e) return { type: 'period', intensity: c.flow_intensity };
        }
        return null;
    };

    const saveCycle = async () => {
        setSaving(true);
        try {
            const r = await window.axios.post('/api/v1/cycles', form);
            setCycles([r.data, ...cycles]);
            setShowForm(false);
        } catch(e) { alert(e.response?.data?.message||'Error saving'); }
        setSaving(false);
    };

    const phaseColors = { period: 'bg-violet-500 text-white', ovulation: 'bg-amber-500 text-white', fertile: 'bg-indigo-300 text-white', today: 'ring-2 ring-violet-500' };

    return (
        <AppLayout title='Suivi du cycle'>
            <div className='grid lg:grid-cols-3 gap-6'>
                {/* Calendar */}
                <div className='lg:col-span-2'>
                    <div className='card'>
                        {/* Calendar header */}
                        <div className='flex items-center justify-between mb-6'>
                            <button onClick={()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);}} className='p-2 rounded-xl hover:bg-violet-50 text-gray-600 hover:text-violet-700 transition-colors'><ChevronLeft size={20}/></button>
                            <h2 className='text-lg font-bold text-gray-900'>{MONTHS[month]} {year}</h2>
                            <button onClick={()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);}} className='p-2 rounded-xl hover:bg-violet-50 text-gray-600 hover:text-violet-700 transition-colors'><ChevronRight size={20}/></button>
                        </div>
                        {/* Day headers */}
                        <div className='grid grid-cols-7 mb-2'>
                            {DAYS.map(d=><div key={d} className='text-center text-xs font-semibold text-gray-400 py-2'>{d}</div>)}
                        </div>
                        {/* Day cells */}
                        <div className='grid grid-cols-7 gap-1'>
                            {[...Array(firstDay)].map((_,i)=><div key={'e'+i}/>)}
                            {[...Array(daysInMonth)].map((_,i)=>{
                                const d = i+1;
                                const dateStr = year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
                                const isToday = d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
                                const cycleInfo = getCycleDay(dateStr);
                                return (
                                    <button key={d} onClick={()=>setSelected(dateStr)} className={'relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 '+(isToday?'ring-2 ring-violet-500 ring-offset-1 ':'' )+(cycleInfo?' bg-violet-500 text-white shadow-sm':(selected===dateStr?'bg-violet-100 text-violet-700':'text-gray-700 hover:bg-violet-50'))}>
                                        {d}
                                        {cycleInfo && <span className='absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white opacity-70'></span>}
                                    </button>
                                );
                            })}
                        </div>
                        {/* Legend */}
                        <div className='flex flex-wrap gap-4 mt-6 pt-4 border-t border-pink-50'>
                            {[{c:'bg-violet-500',l:'Règles'},{c:'bg-amber-500',l:'Ovulation'},{c:'bg-indigo-300',l:'Fenêtre fertile'},{c:'ring-2 ring-violet-500 bg-white',l:'Aujourd’hui'}].map(i=>(
                                <div key={i.l} className='flex items-center gap-2'><div className={'w-4 h-4 rounded '+i.c}></div><span className='text-xs text-gray-500'>{i.l}</span></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar panel */}
                <div className='space-y-4'>
                    {/* Log cycle button */}
                    <button onClick={()=>setShowForm(!showForm)} className='btn-primary w-full flex items-center justify-center gap-2'>
                        <Plus size={18}/> Log New Cycle
                    </button>

                    {/* Log form */}
                    {showForm && (
                        <div className='card border border-violet-100'>
                            <h3 className='font-bold text-gray-900 mb-4'>Log Cycle</h3>
                            <div className='space-y-3'>
                                <div>
                                    <label className='text-xs font-semibold text-gray-600 mb-1 block'>Start Date</label>
                                    <input type='date' value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} className='input-field text-sm'/>
                                </div>
                                <div>
                                    <label className='text-xs font-semibold text-gray-600 mb-1 block'>End Date (optional)</label>
                                    <input type='date' value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} className='input-field text-sm'/>
                                </div>
                                <div>
                                    <label className='text-xs font-semibold text-gray-600 mb-2 block'>Flow Intensity</label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        {flows.map(f=>(
                                            <button key={f.v} onClick={()=>setForm({...form,flow_intensity:f.v})} className={'px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all '+(form.flow_intensity===f.v?'border-violet-400 bg-violet-50 text-violet-700':'border-gray-100 text-gray-500 hover:border-violet-200')}>{f.l}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className='text-xs font-semibold text-gray-600 mb-2 block'>Mood</label>
                                    <div className='grid grid-cols-3 gap-2'>
                                        {moods.map(m=>(
                                            <button key={m.v} onClick={()=>setForm({...form,mood:m.v})} className={'px-2 py-2 rounded-xl text-xs font-medium border-2 transition-all text-center '+(form.mood===m.v?'border-violet-400 bg-violet-50':'border-gray-100 hover:border-violet-200')}>
                                                <div className='text-lg'>{m.icon}</div><div className='text-gray-600 mt-0.5'>{m.l}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className='text-xs font-semibold text-gray-600 mb-1 block'>Notes</label>
                                    <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} placeholder='Comment vous sentez-vous ?' className='input-field text-sm resize-none'/>
                                </div>
                                <button onClick={saveCycle} disabled={saving} className='btn-primary w-full text-sm flex items-center justify-center gap-2'>
                                    {saving?<span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'/>:null}
                                    Save Cycle
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Recent cycles */}
                    <div className='card'>
                        <h3 className='font-bold text-gray-900 mb-4'>Recent Cycles</h3>
                        {cycles.length === 0 ? (
                            <div className='text-center py-6'>
                                <div className='text-4xl mb-2'>🌸</div>
                                <p className='text-sm text-gray-500'>No cycles logged yet</p>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {cycles.slice(0,5).map((c,i)=>(
                                    <div key={i} className='flex items-center gap-3 p-3 rounded-xl bg-violet-50/50 hover:bg-violet-50 transition-colors'>
                                        <div className='w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center'><Droplets size={16} className='text-white'/></div>
                                        <div>
                                            <div className='text-sm font-semibold text-gray-800'>{new Date(c.start_date).toLocaleDateString('en',{month:'short',day:'numeric'})}</div>
                                            <div className='text-xs text-gray-500 capitalize'>{c.flow_intensity} flow • {c.mood}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
