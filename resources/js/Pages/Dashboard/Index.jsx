import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Heart, Droplets, Calendar, MessageCircle, Stethoscope, Baby, BookOpen, ArrowRight, Activity, Moon, AlertCircle } from 'lucide-react';

const phases = {
    period: { label: 'Phase menstruelle', emoji: '🌸' },
    follicular: { label: 'Phase folliculaire', emoji: '🎱' },
    ovulation: { label: 'Phase d\'ovulation', emoji: '✨' },
    luteal: { label: 'Phase lutéale', emoji: '🌙' }
};

const quickActions = [
    { label: 'Mes règles', href: '/cycles', icon: Droplets },
    { label: 'Assistant IA', href: '/chat', icon: MessageCircle },
    { label: 'Trouver un médecin', href: '/gynecologists', icon: Stethoscope },
    { label: 'Articles', href: '/articles', icon: BookOpen },
    { label: 'Grossesse', href: '/pregnancies', icon: Baby },
    { label: 'Rendez-vous', href: '/appointments', icon: Calendar },
];

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    let user = { name: 'Utilisatrice' };
    try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch (e) { }

    useEffect(() => {
        const fetch = async () => {
            try {
                const [d, a] = await Promise.all([
                    window.axios.get('/api/v1/dashboard').catch(() => ({ data: {} })),
                    window.axios.get('/api/v1/articles').catch(() => ({ data: { data: [] } })),
                ]);
                setDashboardData(d.data);
                setArticles(Array.isArray(a.data) ? a.data : a.data.data || []);
            } catch (e) { }
            setLoading(false);
        };
        fetch();
    }, []);

    const cycles = dashboardData?.health_overview?.latest_cycle ? [dashboardData.health_overview.latest_cycle] : [];
    const predictions = dashboardData?.health_overview?.predictions || [];
    const daysUntilNextPeriod = dashboardData?.health_overview?.days_until_next_period;
    const currentCycleDay = dashboardData?.health_overview?.current_cycle_day || 1;
    const cycleLen = predictions.find(p => p.type === 'period')?.cycle_length_avg || 28;
    const phase = currentCycleDay <= 5 ? 'period' : currentCycleDay <= 13 ? 'follicular' : currentCycleDay <= 16 ? 'ovulation' : 'luteal';
    const P = phases[phase];
    const nextPeriod = predictions.find(p => p.type === 'period');
    const nextOvulation = predictions.find(p => p.type === 'ovulation');
    const isPeriodSoon = daysUntilNextPeriod !== null && daysUntilNextPeriod <= 3 && daysUntilNextPeriod >= 0;

    const stats = [
        { label: 'Jour du cycle', value: 'Jour ' + currentCycleDay, sub: 'sur ' + cycleLen, icon: Heart },
        { label: 'Prochaines règles', value: nextPeriod ? new Date(nextPeriod.predicted_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }) : (daysUntilNextPeriod !== null ? daysUntilNextPeriod + ' jours' : '-'), sub: nextPeriod ? 'prévu' : 'restants', icon: Calendar },
        { label: 'Cycle moyen', value: cycleLen + ' jours', sub: (dashboardData?.stats?.cycles_count || 0) + ' cycles suivis', icon: Activity },
        { label: 'Ovulation', value: nextOvulation ? new Date(nextOvulation.predicted_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }) : 'Jour 14', sub: 'date prévue', icon: Moon },
    ];

    return (
        <AppLayout title='Tableau de bord'>
            {isPeriodSoon && (
                <div className='mb-8 bg-amber-50 rounded-2xl p-6 border border-amber-200 flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0'>
                        <AlertCircle size={22} className='text-white' />
                    </div>
                    <div>
                        <h3 className='text-base font-semibold text-amber-900'>Vos règles arrivent bientôt !</h3>
                        <p className='text-sm text-amber-700 mt-1'>
                            {daysUntilNextPeriod === 0 
                                ? 'Elles devraient arriver aujourd\'hui'
                                : `Elles devraient arriver dans ${daysUntilNextPeriod} jour${daysUntilNextPeriod > 1 ? 's' : ''}`
                            }
                        </p>
                    </div>
                </div>
            )}

            <div className='mb-8 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden'>
                <div className='relative flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
                    <div className='flex items-center gap-4'>
                        <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-2xl'>
                            {P.emoji}
                        </div>
                        <div>
                            <h2 className='text-xl font-semibold text-slate-900'>{P.label}</h2>
                            <p className='text-slate-500 text-sm'>Jour {currentCycleDay} de votre cycle</p>
                        </div>
                    </div>
                    <div className='flex-1 md:max-w-md'>
                        <div className='flex items-center gap-3 mb-3'>
                            <span className='text-sm font-semibold text-slate-600'>Progression</span>
                            <span className='text-sm font-semibold text-rose-600'>{Math.min(Math.round(currentCycleDay / cycleLen * 100), 100)}%</span>
                        </div>
                        <div className='w-full bg-slate-100 rounded-full h-2.5'>
                            <div className='bg-gradient-to-r from-rose-500 to-rose-600 h-2.5 rounded-full transition-all duration-500' style={{ width: `${Math.min((currentCycleDay / cycleLen) * 100, 100)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
                {stats.map(s => {
                    const I = s.icon; 
                    return (
                        <div key={s.label} className='bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow transition-shadow'>
                            <div className='w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center mb-4'>
                                <I size={22} className='text-rose-600' />
                            </div>
                            <div className='text-2xl font-bold text-slate-900 mb-1'>{s.value}</div>
                            <div className='text-sm text-slate-500 mb-2'>{s.sub}</div>
                            <div className='text-sm font-medium text-slate-700'>{s.label}</div>
                        </div>
                    );
                })}
            </div>

            <div className='mb-8'>
                <h3 className='text-lg font-semibold text-slate-900 mb-5'>Actions rapides</h3>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
                    {quickActions.map(a => {
                        const I = a.icon; 
                        return (
                            <Link key={a.href} href={a.href} className='bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow transition-all hover:-translate-y-0.5 text-center flex flex-col items-center gap-3 group'>
                                <div className='w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors'>
                                    <I size={24} className='text-rose-600 group-hover:text-rose-700' />
                                </div>
                                <span className='text-sm font-medium text-slate-700'>{a.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {articles.length > 0 && (
                <div className='mb-8'>
                    <div className='flex items-center justify-between mb-5'>
                        <h3 className='text-lg font-semibold text-slate-900'>Articles récents</h3>
                        <Link href='/articles' className='text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors'>
                            Voir tout <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {articles.slice(0, 3).map(a => (
                            <Link key={a.id} href={'/articles/' + a.id} className='bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow transition-all group'>
                                <span className='text-xs font-semibold text-rose-600 uppercase tracking-wider'>
                                    {a.category?.nom || a.category?.name || 'Santé'}
                                </span>
                                <h4 className='font-semibold text-slate-900 mt-3 mb-2 group-hover:text-rose-700 transition-colors line-clamp-2'>
                                    {a.title}
                                </h4>
                                <p className='text-sm text-slate-500 line-clamp-3'>{a.excerpt}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {articles.length === 0 && !loading && (
                <div className='bg-white rounded-2xl p-10 border border-slate-200 shadow-sm text-center'>
                    <div className='text-5xl mb-3'>🌸</div>
                    <h3 className='text-xl font-semibold text-slate-900 mb-3'>Bienvenue sur Femina Santé !</h3>
                    <p className='text-slate-500 mb-7 max-w-md mx-auto'>
                        Commencez par enregistrer votre cycle ou explorer les articles de santé.
                    </p>
                    <div className='flex flex-col sm:flex-row justify-center gap-3'>
                        <Link 
                            href='/cycles' 
                            className='inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm'
                        >
                            Mon cycle
                        </Link>
                        <Link 
                            href='/articles' 
                            className='inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all'
                        >
                            Lire les articles
                        </Link>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
