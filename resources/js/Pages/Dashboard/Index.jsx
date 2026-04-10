import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Heart, Droplets, TrendingUp, Calendar, MessageCircle, Stethoscope, Baby, BookOpen, ArrowRight, Activity, Moon } from 'lucide-react';

const phases = {
    period: { label: 'Phase menstruelle', emoji: '🌸' },
    follicular: { label: 'Phase folliculaire', emoji: '🎱' },
    ovulation: { label: 'Phase d’ovulation', emoji: '✨' },
    luteal: { label: 'Phase lutéale', emoji: '🌙' }
};

const quickActions = [
    { label: 'Mes règles', href: '/cycles', icon: Droplets, color: 'from-violet-500 to-purple-600' },
    { label: 'Assistant IA', href: '/chat', icon: MessageCircle, color: 'from-indigo-500 to-violet-600' },
    { label: 'Trouver un médecin', href: '/gynecologists', icon: Stethoscope, color: 'from-amber-500 to-orange-500' },
    { label: 'Articles', href: '/articles', icon: BookOpen, color: 'from-teal-500 to-cyan-600' },
    { label: 'Grossesse', href: '/pregnancies', icon: Baby, color: 'from-pink-500 to-rose-500' },
    { label: 'Rendez-vous', href: '/appointments', icon: Calendar, color: 'from-emerald-500 to-green-600' },
];

export default function Dashboard() {
    const [cycles, setCycles] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    let user = { name: 'Utilisatrice' };
    try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch(e) {}

    useEffect(() => {
        const fetch = async () => {
            try {
                const [c, p, a] = await Promise.all([
                    window.axios.get('/api/v1/cycles').catch(()=>({data:[]})),
                    window.axios.get('/api/v1/predictions').catch(()=>({data:[]})),
                    window.axios.get('/api/v1/articles').catch(()=>({data:{data:[]}})),
                ]);
                setCycles(Array.isArray(c.data)?c.data:c.data.data||[]);
                setPredictions(Array.isArray(p.data)?p.data:p.data.data||[]);
                setArticles(Array.isArray(a.data)?a.data:a.data.data||[]);
            } catch(e) {}
            setLoading(false);
        };
        fetch();
    }, []);

    const lastCycle = cycles[0];
    const currentDay = lastCycle ? Math.floor((new Date()-new Date(lastCycle.start_date))/(1000*60*60*24))+1 : 14;
    const cycleLen = 28;
    const phase = currentDay<=5?'period':currentDay<=13?'follicular':currentDay<=16?'ovulation':'luteal';
    const P = phases[phase];
    const nextPeriod = predictions.find(p=>p.type==='period');
    const nextOvulation = predictions.find(p=>p.type==='ovulation');
    const daysLeft = Math.max(0, cycleLen - currentDay);

    const stats = [
        { label: 'Jour du cycle', value: 'Jour '+currentDay, sub: 'sur '+cycleLen, icon: Heart, grad: 'from-violet-500 to-purple-600' },
        { label: 'Prochaines règles', value: nextPeriod?new Date(nextPeriod.predicted_date).toLocaleDateString('fr',{month:'short',day:'numeric'}):daysLeft+' jours', sub: nextPeriod?'prévu':'restants', icon: Calendar, grad: 'from-indigo-500 to-violet-600' },
        { label: 'Cycle moyen', value: cycleLen+' jours', sub: cycles.length+' cycles suivis', icon: Activity, grad: 'from-amber-500 to-orange-500' },
        { label: 'Ovulation', value: nextOvulation?new Date(nextOvulation.predicted_date).toLocaleDateString('fr',{month:'short',day:'numeric'}):'Jour 14', sub: 'date prévue', icon: Moon, grad: 'from-teal-500 to-cyan-600' },
    ];

    return (
        <AppLayout title='Tableau de bord'>
            <div className='mb-6 rounded-2xl p-6 text-white relative overflow-hidden' style={{background:'linear-gradient(135deg,#1e1b4b,#3730a3,#4f46e5)'}}>
                <div className='absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full' style={{background:'radial-gradient(circle,white,transparent)',transform:'translate(30%,-30%)'}}></div>
                <div className='relative z-10'>
                    <div className='flex items-center gap-3 mb-3'>
                        <span className='text-3xl'>{P.emoji}</span>
                        <div>
                            <h2 className='text-xl font-bold'>Bonjour, {(user.name||'').split(' ')[0]||'là'} ! 👋</h2>
                            <p className='text-violet-200 text-sm'>{P.label} • Jour {currentDay} de votre cycle</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='flex-1 bg-white/20 rounded-full h-2'><div className='bg-white rounded-full h-2 transition-all' style={{width:(currentDay/cycleLen*100)+'%'}}></div></div>
                        <span className='text-sm text-violet-200 font-medium'>{Math.round(currentDay/cycleLen*100)}%</span>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                {stats.map(s => { const I = s.icon; return (
                    <div key={s.label} className='card card-hover'>
                        <div className={'w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br '+s.grad}><I size={18} className='text-white'/></div>
                        <div className='text-2xl font-extrabold text-gray-900'>{s.value}</div>
                        <div className='text-xs text-gray-500 mt-0.5'>{s.sub}</div>
                        <div className='text-sm font-medium text-gray-700 mt-1'>{s.label}</div>
                    </div>
                ); })}
            </div>

            <div className='mb-6'>
                <h3 className='text-base font-bold text-gray-800 mb-3'>Actions rapides</h3>
                <div className='grid grid-cols-3 lg:grid-cols-6 gap-3'>
                    {quickActions.map(a => { const I = a.icon; return (
                        <Link key={a.href} href={a.href} className='card card-hover text-center p-4 flex flex-col items-center gap-2 group'>
                            <div className={'w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br '+a.color}><I size={22} className='text-white'/></div>
                            <span className='text-xs font-semibold text-gray-700 group-hover:text-violet-700 transition-colors text-center'>{a.label}</span>
                        </Link>
                    ); })}
                </div>
            </div>

            {articles.length > 0 && (
                <div>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-base font-bold text-gray-800'>Articles récents</h3>
                        <Link href='/articles' className='text-sm text-violet-700 font-semibold hover:text-violet-800 flex items-center gap-1'>Voir tout <ArrowRight size={14}/></Link>
                    </div>
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {articles.slice(0,3).map(a => (
                            <Link key={a.id} href={'/articles/'+a.id} className='card card-hover group'>
                                <div className='w-full h-2 rounded-full bg-gradient-to-r from-violet-500 to-amber-500 mb-4'></div>
                                <span className='text-xs font-semibold text-violet-700 uppercase tracking-wider'>{a.category||'Sante'}</span>
                                <h4 className='font-bold text-gray-900 mt-1 mb-2 group-hover:text-violet-700 transition-colors line-clamp-2'>{a.title}</h4>
                                <p className='text-sm text-gray-500 line-clamp-2'>{a.excerpt}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {articles.length===0 && !loading && (
                <div className='card text-center py-10'>
                    <div className='text-5xl mb-4'>🌸</div>
                    <h3 className='text-lg font-bold text-gray-800 mb-2'>Bienvenue sur FeminaSante !</h3>
                    <p className='text-gray-500 mb-6'>Commencez par enregistrer votre cycle ou explorer les articles de sante.</p>
                    <div className='flex justify-center gap-3'>
                        <Link href='/cycles' className='btn-primary text-sm'>Mon cycle</Link>
                        <Link href='/articles' className='border border-violet-200 text-violet-700 font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-violet-50 transition-all'>Lire les articles</Link>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
