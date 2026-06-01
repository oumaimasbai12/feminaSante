import React, { useState, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Calendar, Clock, User, MapPin, Video, Phone, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const STATUS = { pending:{l:'En attente',c:'bg-amber-100 text-amber-700',icon:AlertCircle}, confirmed:{l:'Confirmé',c:'bg-green-100 text-green-700',icon:CheckCircle}, cancelled:{l:'Annulé',c:'bg-red-100 text-red-700',icon:XCircle} };

export default function Appointments() {
    const [appts, setAppts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('upcoming');
    const [showForm, setShowForm] = useState(false);
    const [docs, setDocs] = useState([]);
    const [form, setForm] = useState({ gynecologist_id:'', appointment_date:'', appointment_time:'', consultation_type:'in_person', reason:'', notes:'' });

    useEffect(()=>{
        Promise.all([
            window.axios.get('/api/v1/appointments').catch(()=>({data:[]})),
            window.axios.get('/api/v1/gynecologists').catch(()=>({data:[]})),
        ]).then(([a,d])=>{
            setAppts(Array.isArray(a.data)?a.data:(a.data.data||[]));
            setDocs(Array.isArray(d.data)?d.data:(d.data.data||[]));
        }).finally(()=>setLoading(false));
    },[]);

    const now = new Date();
    const upcoming = appts.filter(a=>new Date(a.start_time)>=now);
    const past = appts.filter(a=>new Date(a.start_time)<now);
    const list = tab==='upcoming'?upcoming:past;

    const book = async () => {
        try {
            const start = new Date(`${form.appointment_date}T${form.appointment_time}`);
            const end = new Date(start.getTime() + 30 * 60 * 1000);
            const payload = {
                gynecologist_id: form.gynecologist_id,
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                consultation_type: form.consultation_type,
                reason: form.reason,
                notes: form.notes,
            };
            const r = await window.axios.post('/api/v1/appointments', payload);
            const appointment = r.data?.appointment || r.data;
            setAppts([appointment, ...appts]);
            setShowForm(false);
        } catch(e) { alert(e.response?.data?.message||'Booking failed'); }
    };

    return (
        <AppLayout title='Appointments'>
            <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 gap-1'>
                        {['upcoming','passés'].map(t=>(
                            <button key={t} onClick={()=>setTab(t)} className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${tab===t?'bg-slate-900 text-white':'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>{t}</button>
                        ))}
                    </div>
                    <button onClick={()=>setShowForm(!showForm)} className='flex items-center gap-2 text-sm px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm'>
                        <Plus size={18}/>Prendre rendez-vous
                    </button>
                </div>

                {showForm && (
                    <div className='bg-white rounded-2xl border border-slate-200 shadow-sm p-6'>
                        <h3 className='font-bold text-slate-900 mb-5 text-lg'>Nouveau rendez-vous</h3>
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-semibold text-slate-700 mb-2'>Gynécologue</label>
                                <select value={form.gynecologist_id} onChange={e=>setForm({ ...form, gynecologist_id:e.target.value })} className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all'>
                                    <option value=''>Choisir un médecin...</option>
                                    {docs.map(d=><option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-semibold text-slate-700 mb-2'>Type de consultation</label>
                                <select value={form.consultation_type} onChange={e=>setForm({ ...form, consultation_type:e.target.value })} className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all'>
                                    <option value='in_person'>En cabinet</option><option value='online'>En ligne</option>
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-semibold text-slate-700 mb-2'>Date</label>
                                <input type='date' value={form.appointment_date} onChange={e=>setForm({ ...form, appointment_date:e.target.value })} className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all'/>
                            </div>
                            <div>
                                <label className='block text-sm font-semibold text-slate-700 mb-2'>Heure</label>
                                <input type='time' value={form.appointment_time} onChange={e=>setForm({ ...form, appointment_time:e.target.value })} className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all'/>
                            </div>
                            <div className='md:col-span-2'>
                                <label className='block text-sm font-semibold text-slate-700 mb-2'>Motif de la consultation</label>
                                <input type='text' value={form.reason} onChange={e=>setForm({ ...form, reason:e.target.value })} placeholder='ex: Consultation annuelle, suivi...' className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all'/>
                            </div>
                            <div className='md:col-span-2'>
                                <label className='block text-sm font-semibold text-slate-700 mb-2'>Notes supplémentaires</label>
                                <textarea value={form.notes} onChange={e=>setForm({ ...form, notes:e.target.value })} rows={3} className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all resize-none'/>
                            </div>
                        </div>
                        <div className='flex gap-3 mt-6'>
                            <button onClick={book} className='flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm'>
                                Confirmer le rendez-vous
                            </button>
                            <button onClick={()=>setShowForm(false)} className='flex-1 px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all'>
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {loading && <div className='flex justify-center py-16'><div className='w-10 h-10 border-4 border-rose-400 border-t-transparent rounded-full animate-spin'></div></div>}

                {!loading && list.length === 0 && (
                    <div className='text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm'>
                        <Calendar size={48} className='text-slate-200 mx-auto mb-4'/>
                        <h3 className='text-lg font-bold text-slate-700 mb-2'>Pas de rendez-vous {tab}</h3>
                        <p className='text-slate-500 text-sm mb-6'>{tab==='upcoming'?'Prenez votre premier rendez-vous avec un gynécologue.':'Vos rendez-vous passés apparaîtront ici.'}</p>
                        {tab==='upcoming'&&<button onClick={()=>setShowForm(true)} className='flex items-center gap-2 mx-auto px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm'>
                            <Plus size={18}/>Prendre rendez-vous
                        </button>}
                    </div>
                )}

                <div className='space-y-4'>
                    {list.map(a=>{
                        const s = STATUS[a.status]||STATUS.pending;
                        const SI = s.icon;
                        const doc = docs.find(d=>d.id===a.gynecologist_id);
                        return (
                            <div key={a.id} className='bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4 hover:shadow transition-shadow'>
                                <div className='flex items-center gap-4 flex-1'>
                                    <div className='w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 bg-gradient-to-r from-rose-500 to-rose-600'>
                                        {doc?(doc.first_name||'D').charAt(0)+(doc.last_name||'R').charAt(0):<User size={22} className='text-white'/>}
                                    </div>
                                    <div>
                                        <h4 className='font-bold text-slate-900'>{doc?'Dr. '+doc.first_name+' '+doc.last_name:'Médecin'}</h4>
                                        <div className='flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500'>
                                            <span className='flex items-center gap-1'><Calendar size={16}/>{new Date(a.start_time).toLocaleDateString('fr-FR', {month:'short',day:'numeric',year:'numeric'})}</span>
                                            <span className='flex items-center gap-1'><Clock size={16}/>{new Date(a.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className='flex items-center gap-1'>{a.consultation_type==='online'?<Video size={16}/>:<MapPin size={16}/>}<span className='capitalize'>{a.consultation_type==='online'?'En ligne':'En cabinet'}</span></span>
                                        </div>
                                        {a.reason&&<p className='text-sm text-slate-500 mt-1'>{a.reason}</p>}
                                    </div>
                                </div>
                                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 ${s.c}`}><SI size={16}/>{s.l}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
