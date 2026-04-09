import React, { useState, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Baby, Plus, Heart, Weight, Activity, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const weeks = [{ w:4,m:'🌱',d:'Baby is the size of a poppy seed' },{ w:8,m:'�B',d:'Baby is the size of a raspberry' },{ w:12,m:'🍋',d:'Baby is the size of a lime' },{ w:16,m:'🥑',d:'Baby is the size of an avocado' },{ w:20,m:'🍌',d:'Baby is the size of a banana' },{ w:24,m:'🌽',d:'Baby is the size of an ear of corn' },{ w:28,m:'🍆',d:'Baby is the size of an eggplant' },{ w:32,m:'🌶',d:'Baby is the size of a squash' },{ w:36,m:'🍈',d:'Baby is the size of a honeydew' },{ w:40,m:'👶',d:'Baby is ready to meet you!' }];

export default function Pregnancies() {
    const [preg, setPreg] = useState([]);
    const [active, setActive] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ last_menstrual_period: '', due_date: '', pregnancy_type: 'single', notes: '' });
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        window.axios.get('/api/v1/pregnancies').then(r=>{
            const d = Array.isArray(r.data)?r.data:(r.data.data||[]);
            setPreg(d);
            if(d.length>0) setActive(d[0]);
        }).catch(()=>{}).finally(()=>setLoading(false));
    },[]);

    const currentWeek = active ? (active.current_week || Math.floor((new Date()-new Date(active.last_menstrual_period))/(1000*60*60*24*7))) : 0;
    const weekInfo = weeks.reduce((best,w)=>(w.w<=currentWeek?w:best), weeks[0]);
    const progress = Math.min(100, (currentWeek/40)*100);

    const save = async () => {
        try {
            const r = await window.axios.post('/api/v1/pregnancies', form);
            setPreg([r.data,...preg]);
            setActive(r.data);
            setShowForm(false);
        } catch(e) { alert(e.response?.data?.message||'Error'); }
    };

    const trimesters = [{n:'1er Trimestre',w:'1-12 weeks',done:currentWeek>=12},{n:'2ème Trimester',w:'13-26 weeks',done:currentWeek>=26},{n:'3ème Trimester',w:'27-40 weeks',done:currentWeek>=40}];

    return (
        <AppLayout title='Suivi de grossesse'>
            {loading && <div className='flex items-center justify-center h-64'><div className='w-10 h-10 border-4 border-violet-400 border-t-transparent rounded-full animate-spin'></div></div>}

            {!loading && !active && !showForm && (
                <div className='text-center py-20 card max-w-lg mx-auto'>
                    <div className='text-7xl mb-6'>👶</div>
                    <h2 className='text-2xl font-extrabold text-gray-900 mb-3'>Commencer le suivi de votre grossesse</h2>
                    <p className='text-gray-500 mb-8 leading-relaxed'>Track your baby's growth week by week, log checkups, monitor symptoms, and stay informed throughout your journey.</p>
                    <button onClick={()=>setShowForm(true)} className='btn-primary flex items-center gap-2 mx-auto'><Plus size={18}/> Commencer le suivi</button>
                </div>
            )}

            {!loading && showForm && (
                <div className='max-w-lg mx-auto card'>
                    <h3 className='text-xl font-bold text-gray-900 mb-6'>Nouvelle grossesse</h3>
                    <div className='space-y-4'>
                        <div><label className='block text-sm font-semibold text-gray-700 mb-2'>Date des dernières règles</label><input type='date' value={form.last_menstrual_period} onChange={e=>setForm({...form,last_menstrual_period:e.target.value})} className='input-field'/></div>
                        <div><label className='block text-sm font-semibold text-gray-700 mb-2'>Date d’accouchement prévue (optionnel)</label><input type='date' value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})} className='input-field'/></div>
                        <div><label className='block text-sm font-semibold text-gray-700 mb-2'>Type de grossesse</label>
                            <select value={form.pregnancy_type} onChange={e=>setForm({...form,pregnancy_type:e.target.value})} className='input-field'>
                                <option value='single'>Single</option><option value='twins'>Twins</option><option value='triplets'>Triplets</option>
                            </select>
                        </div>
                        <div><label className='block text-sm font-semibold text-gray-700 mb-2'>Notes</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3} className='input-field resize-none'/></div>
                        <div className='flex gap-3'>
                            <button onClick={save} className='btn-primary flex-1'>Start Tracking</button>
                            <button onClick={()=>setShowForm(false)} className='flex-1 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl px-4 py-3 hover:bg-gray-50 transition-all'>Annuler</button>
                        </div>
                    </div>
                </div>
            )}

            {!loading && active && (
                <div className='space-y-6'>
                    {/* Main tracker card */}
                    <div className='rounded-2xl p-6 text-white relative overflow-hidden' style={{background:'linear-gradient(135deg,#1e1b4b,#4f46e5)'}}>
                        <div className='absolute inset-0 opacity-10' style={{backgroundImage:'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)'}}></div>
                        <div className='relative z-10 grid md:grid-cols-2 gap-6 items-center'>
                            <div>
                                <div className='text-6xl mb-4 text-center'>{weekInfo.m}</div>
                                <h2 className='text-2xl font-extrabold text-center mb-1'>Week {currentWeek}</h2>
                                <p className='text-pink-200 text-center text-sm mb-6'>{weekInfo.d}</p>
                                <div className='bg-white/20 rounded-full h-3 mb-2'>
                                    <div className='bg-white rounded-full h-3 transition-all' style={{width:progress+'%'}}></div>
                                </div>
                                <div className='flex justify-between text-xs text-pink-200'><span>Week 1</span><span>{Math.round(progress)}% complete</span><span>Week 40</span></div>
                            </div>
                            <div className='grid grid-cols-2 gap-3'>
                                {[{l:'Semaines restantes',v:Math.max(0,40-currentWeek)},{l:'Date prévue',v:active.due_date?new Date(active.due_date).toLocaleDateString('en',{month:'short',day:'numeric'}):'À définir'},{l:'Trimester',v:currentWeek<=12?'1st':currentWeek<=26?'2nd':'3rd'},{l:'Type',v:active.pregnancy_type||'Simple'}].map(s=>(
                                    <div key={s.l} className='bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center'>
                                        <div className='text-lg font-bold'>{s.v}</div>
                                        <div className='text-xs text-pink-200'>{s.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trimester progress */}
                    <div className='card'>
                        <h3 className='font-bold text-gray-900 mb-4'>Trimester Progress</h3>
                        <div className='grid md:grid-cols-3 gap-4'>
                            {trimesters.map((t,i)=>(
                                <div key={t.n} className={'p-4 rounded-2xl border-2 transition-all '+(i===0&&currentWeek<=12?'border-violet-400 bg-violet-50':i===1&&currentWeek>12&&currentWeek<=26?'border-purple-400 bg-purple-50':i===2&&currentWeek>26?'border-indigo-400 bg-indigo-50':'border-gray-100 bg-gray-50')}>
                                    <div className='flex items-center gap-2 mb-2'>
                                        {t.done?<CheckCircle size={18} className='text-green-500'/>:<div className={'w-5 h-5 rounded-full border-2 '+(i===0&&currentWeek<=12?'border-violet-400':i===1?'border-purple-400':'border-indigo-400')}></div>}
                                        <span className='font-bold text-gray-800 text-sm'>{t.n}</span>
                                    </div>
                                    <p className='text-xs text-gray-500'>{t.w}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={()=>setShowForm(true)} className='btn-primary flex items-center gap-2'><Plus size={18}/> Ajouter une grossesse</button>
                </div>
            )}
        </AppLayout>
    );
}
