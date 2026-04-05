import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Heart, Droplets, TrendingUp, Calendar, MessageCircle, Stethoscope, Baby, BookOpen, ArrowRight, Activity, Smile, Moon } from 'lucide-react';

const phases = { period: { label: 'Menstrual Phase', color: '#F43F5E', bg: 'from-rose-400 to-pink-500', emoji: '🌸' }, follicular: { label: 'Follicular Phase', color: '#EC4899', bg: 'from-pink-400 to-fuchsia-500', emoji: '🎱' }, ovulation: { label: 'Ovulation Phase', color: '#A855F7', bg: 'from-fuchsia-400 to-purple-500', emoji: '✨' }, luteal: { label: 'Luteal Phase', color: '#6366F1', bg: 'from-purple-400 to-indigo-500', emoji: '🌙' } };

const quickActions = [
    { label: 'Log Period', href: '/cycles', icon: Droplets, color: 'from-rose-400 to-pink-500' },
    { label: 'AI Chat', href: '/chat', icon: MessageCircle, color: 'from-pink-400 to-fuchsia-500' },
    { label: 'Find Doctor', href: '/gynecologists', icon: Stethoscope, color: 'from-purple-400 to-indigo-500' },
    { label: 'Articles', href: '/articles', icon: BookOpen, color: 'from-indigo-400 to-blue-500' },
    { label: 'Pregnancy', href: '/pregnancies', icon: Baby, color: 'from-blue-400 to-cyan-500' },
    { label: 'Appointments', href: '/appointments', icon: Calendar, color: 'from-teal-400 to-green-500' },
];

export default function Dashboard() {
    const [cycles, setCycles] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    let user = { name: 'User' };
    try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch(e) {}

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [c, p, a] = await Promise.all([
                    window.axios.get('/api/v1/cycles').catch(()=>({data:[]})),
                    window.axios.get('/api/v1/predictions').catch(()=>({data:[]})),
                    window.axios.get('/api/v1/articles').catch(()=>({data:{data:[]}})),
                ]);
                setCycles(Array.isArray(c.data) ? c.data : c.data.data || []);
                setPredictions(Array.isArray(p.data) ? p.data : p.data.data || []);
                setArticles(Array.isArray(a.data) ? a.data : a.data.data || []);
            } catch(e) {}
            setLoading(false);
        };
        fetchData();
    }, []);

    const lastCycle = cycles[0];
    const currentDay = lastCycle ? Math.floor((new Date()-new Date(lastCycle.start_date))/(1000*60*60*24))+1 : 14;
    const cycleLen = 28;
    const daysLeft = Math.max(0, cycleLen - currentDay);
    const phase = currentDay <= 5 ? 'period' : currentDay <= 13 ? 'follicular' : currentDay <= 16 ? 'ovulation' : 'luteal';
    const P = phases[phase];

    const nextPeriod = predictions.find(p=>p.type==='period');
    const nextOvulation = predictions.find(p=>p.type==='ovulation');

    const stats = [
        { label: 'Cycle Day', value: 'Day ' + currentDay, sub: 'of ' + cycleLen, icon: Heart, grad: 'from-rose-400 to-pink-500' },
        { label: 'Next Period', value: nextPeriod ? new Date(nextPeriod.predicted_date).toLocaleDateString('en',{month:'short',day:'numeric'}) : daysLeft + ' days', sub: nextPeriod ? 'predicted' : 'remaining', icon: Calendar, grad: 'from-pink-400 to-fuchsia-500' },
        { label: 'Avg Cycle', value: cycleLen + ' days', sub: cycles.length + ' cycles tracked', icon: Activity, grad: 'from-fuchsia-400 to-purple-500' },
        { label: 'Ovulation', value: nextOvulation ? new Date(nextOvulation.predicted_date).toLocaleDateString('en',{month:'short',day:'numeric'}) : 'Day 14', sub: 'predicted date', icon: Moon, grad: 'from-purple-400 to-indigo-500' },
    ];

    return (
        <AppLayout title='Dashboard'>
            {/* Welcome */}
            <div className='mb-6 rounded-2xl p-6 text-white relative overflow-hidden' style={{background:'linear-gradient(135deg,#be185d,#9d174d,#6b21a8)'}}>
                <div className='absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full' style={{background:'radial-gradient(circle,white,transparent)',transform:'translate(30%,-30%)'}}></div>
                <div className='relative z-10'>
                    <div className='flex items-center gap-3 mb-3'>
                        <span className='text-3xl'>{P.emoji}</span>
                        <div>
                            <h2 className='text-xl font-bold'>Good morning, {(user.name||'').split(' ')[0] || 'there'}! 👋</h2>
                            <p className='text-pink-200 text-sm'>{P.label} • Day {currentDay} of your cycle</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='flex-1 bg-white/20 rounded-full h-2'>
                            <div className='bg-white rounded-full h-2 transition-all' style={{width:(currentDay/cycleLen*100)+'%'}}></div>
                        </div>
                        <span className='text-sm text-pink-200 font-medium'>{Math.round(currentDay/cycleLen*100)}%</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                {stats.map(s => {
                    const I = s.icon;
                    return (
                        <div key={s.label} className='card card-hover'>
                            <div className={'w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ' + s.grad}>
                                <I size={18} className='text-white'/>
                            </div>
                            <div className='text-2xl font-extrabold text-gray-900'>{s.value}</div>
                            <div className='text-xs text-gray-500 mt-0.5'>{s.sub}</div>
                            <div className='text-sm font-medium text-gray-700 mt-1'>{s.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Quick actions */}
            <div className='mb-6'>
                <h3 className='text-base font-bold text-gray-800 mb-3'>Quick Actions</h3>
                <div className='grid grid-cols-3 lg:grid-cols-6 gap-3'>
                    {quickActions.map(a => {
                        const I = a.icon;
                        return (
                            <Link key={a.href} href={a.href} className='card card-hover text-center p-4 flex flex-col items-center gap-2 group'>
                                <div className={'w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ' + a.color}>
                                    <I size={22} className='text-white'/>
                                </div>
                                <span className='text-xs font-semibold text-gray-700 group-hover:text-pink-600 transition-colors text-center'>{a.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent articles */}
            {articles.length > 0 && (
                <div>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-base font-bold text-gray-800'>Recent Articles</h3>
                        <Link href='/articles' className='text-sm text-pink-600 font-semibold hover:text-pink-700 flex items-center gap-1'>View all <ArrowRight size={14}/></Link>
                    </div>
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {articles.slice(0,3).map(a => (
                            <Link key={a.id} href={'/articles/'+a.id} className='card card-hover group'>
                                <div className='w-full h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 mb-4'></div>
                                <span className='text-xs font-semibold text-pink-600 uppercase tracking-wider'>{a.category || 'Health'}</span>
                                <h4 className='font-bold text-gray-900 mt-1 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2'>{a.title}</h4>
                                <p className='text-sm text-gray-500 line-clamp-2'>{a.excerpt}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {articles.length === 0 && !loading && (
                <div className='card text-center py-10'>
                    <div className='text-5xl mb-4'>🌸</div>
                    <h3 className='text-lg font-bold text-gray-800 mb-2'>Welcome to FeminaSanté!</h3>
                    <p className='text-gray-500 mb-6'>Start by logging your cycle or exploring health articles.</p>
                    <div className='flex justify-center gap-3'>
                        <Link href='/cycles' className='btn-primary text-sm'>Log Cycle</Link>
                        <Link href='/articles' className='border border-pink-200 text-pink-600 font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-pink-50 transition-all'>Read Articles</Link>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
