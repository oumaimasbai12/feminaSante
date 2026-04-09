import React, { useState, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { User, Mail, Save, Lock, Camera, CheckCircle } from 'lucide-react';

export default function Profile() {
    const [user, setUser] = useState({ name:'', email:'', phone:'', date_of_birth:'', blood_type:'', bio:'' });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [tab, setTab] = useState('profile');
    const [passForm, setPassForm] = useState({ current_password:'', password:'', password_confirmation:'' });
    const [passError, setPassError] = useState('');

    useEffect(()=>{
        try { const u = JSON.parse(localStorage.getItem('user')||'{}'); setUser(prev=>({...prev,...u})); } catch(e) {}
        window.axios.get('/api/v1/profile').then(r=>{
            const u = r.data.user||r.data;
            setUser(prev=>({...prev,...u}));
            localStorage.setItem('user', JSON.stringify({...JSON.parse(localStorage.getItem('user')||'{}'),...u}));
        }).catch(()=>{});
    },[]);

    const save = async () => {
        setSaving(true);
        try {
            const r = await window.axios.put('/api/v1/profile', user);
            const updated = r.data.user||r.data;
            setUser(prev=>({...prev,...updated}));
            localStorage.setItem('user', JSON.stringify({...JSON.parse(localStorage.getItem('user')||'{}'),...updated}));
            setSaved(true); setTimeout(()=>setSaved(false), 3000);
        } catch(e) { alert(e.response?.data?.message||'Error saving'); }
        setSaving(false);
    };

    const ini = (n) => (n||'U').charAt(0).toUpperCase();
    const tabs = [{v:'profile',l:'Informations'},{v:'security',l:'Sécurité'},{v:'health',l:'Préf. santé'}];

    const fields = [
        {k:'name',l:'Nom complet',t:'text',icon:User,ph:'Your name'},
        {k:'email',l:'Adresse e-mail',t:'email',icon:Mail,ph:'your@email.com'},
        {k:'phone',l:'Téléphone',t:'tel',icon:User,ph:'+1 234 567 8900'},
        {k:'date_of_birth',l:'Date de naissance',t:'date',icon:User,ph:''},
    ];

    const bloodTypes = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

    return (
        <AppLayout title='Mon profil'>
            <div className='max-w-2xl mx-auto space-y-6'>
                {/* Profile header card */}
                <div className='card text-center relative overflow-hidden'>
                    <div className='absolute top-0 left-0 right-0 h-24' style={{background:'linear-gradient(135deg,#1e1b4b,#4f46e5)'}}></div>
                    <div className='relative pt-12 pb-2'>
                        <div className='relative inline-block'>
                            <div className='w-24 h-24 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-bold mx-auto' style={{background:'linear-gradient(135deg,#7C3AED,#D97706)'}}>{ini(user.name)}</div>
                            <button className='absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-violet-100 hover:bg-violet-50 transition-colors'><Camera size={13} className='text-violet-700'/></button>
                        </div>
                        <h2 className='text-xl font-bold text-gray-900 mt-3'>{user.name||'Votre nom'}</h2>
                        <p className='text-gray-500 text-sm'>{user.email}</p>
                        {saved && <div className='inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold'><CheckCircle size={16}/>Profil sauvegardé !</div>}
                    </div>
                </div>

                {/* Tabs */}
                <div className='flex bg-white rounded-2xl p-1.5 shadow-sm border border-pink-50'>
                    {tabs.map(t=>(
                        <button key={t.v} onClick={()=>setTab(t.v)} className={'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all '+(tab===t.v?'text-white shadow-sm':'text-gray-500 hover:text-violet-700')} style={tab===t.v?{background:'linear-gradient(135deg,#7C3AED,#D97706)'}:{}}>{t.l}</button>
                    ))}
                </div>

                {/* Profile tab */}
                {tab==='profile' && (
                    <div className='card space-y-4'>
                        {fields.map(f=>{
                            const I=f.icon;
                            return (
                                <div key={f.k}>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>{f.l}</label>
                                    <div className='relative'>
                                        <I size={17} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'/>
                                        <input type={f.t} value={user[f.k]||''} onChange={e=>setUser({...user,[f.k]:e.target.value})} placeholder={f.ph} className='input-field pl-11'/>
                                    </div>
                                </div>
                            );
                        })}
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Groupe sanguin</label>
                            <div className='grid grid-cols-4 gap-2'>
                                {bloodTypes.map(b=>(
                                    <button key={b} onClick={()=>setUser({...user,blood_type:b})} className={'py-2 rounded-xl text-sm font-bold border-2 transition-all '+(user.blood_type===b?'border-pink-500 bg-violet-50 text-pink-700':'border-gray-100 text-gray-500 hover:border-violet-200')}>{b}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Bio</label>
                            <textarea value={user.bio||''} onChange={e=>setUser({...user,bio:e.target.value})} rows={3} placeholder='Parlez-nous de vous...' className='input-field resize-none'/>
                        </div>
                        <button onClick={save} disabled={saving} className='btn-primary w-full flex items-center justify-center gap-2'>
                            {saving?<span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'/>:<Save size={17}/>}
                            {saving?'Enregistrement...':'Enregistrer'}
                        </button>
                    </div>
                )}

                {tab==='security' && (
                    <div className='card space-y-4'>
                        <h3 className='font-bold text-gray-800 mb-1'>Changer le mot de passe</h3>
                        {passError && <div className='p-3 rounded-xl bg-red-50 text-red-600 text-sm'>{passError}</div>}
                        {[{k:'current_password',l:'Mot de passe actuel'},{k:'password',l:'Nouveau mot de passe'},{k:'password_confirmation',l:'Confirmer le nouveau mot de passe'}].map(f=>(
                            <div key={f.k}>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>{f.l}</label>
                                <div className='relative'><Lock size={17} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'/><input type='password' value={passForm[f.k]} onChange={e=>setPassForm({...passForm,[f.k]:e.target.value})} className='input-field pl-11'/></div>
                            </div>
                        ))}
                        <button className='btn-primary w-full flex items-center justify-center gap-2'><Lock size={17}/>Mettre à jour</button>
                    </div>
                )}

                {tab==='health' && (
                    <div className='card'>
                        <h3 className='font-bold text-gray-800 mb-4'>Préférences de santé</h3>
                        <div className='space-y-4'>
                            {[{l:'Rappels de cycle',d:'Recevez une notification avant vos prochaines règles'},{l:'Alertes d’ovulation',d:'Connaissez votre fenêtre fertile'},{l:'Rappels de médication',d:'Ne manquez jamais vos médicaments'},{l:'Résumé hebdomadaire',d:'Recevez un digest santé hebdomadaire'},{l:'Conseils IA',d:'Recommandations de santé personnalisées'}].map(p=>(
                                <div key={p.l} className='flex items-center justify-between p-4 rounded-xl bg-violet-50/50 hover:bg-violet-50 transition-colors'>
                                    <div>
                                        <div className='font-semibold text-gray-800 text-sm'>{p.l}</div>
                                        <div className='text-xs text-gray-500'>{p.d}</div>
                                    </div>
                                    <button className='w-12 h-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 relative flex-shrink-0'>
                                        <div className='w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm transition-all'></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
