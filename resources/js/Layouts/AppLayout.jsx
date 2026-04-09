import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Logo from '../Components/Logo';
import { Home, Heart, Baby, BookOpen, MessageCircle, Stethoscope, Calendar, Menu, X, Bell, LogOut, ChevronRight, Brain } from 'lucide-react';

const nav = [
    { label: 'Tableau de bord', href: '/dashboard', icon: Home },
    { label: 'Suivi du cycle', href: '/cycles', icon: Heart },
    { label: 'Grossesse', href: '/pregnancies', icon: Baby },
    { label: 'Articles', href: '/articles', icon: BookOpen },
    { label: 'Quiz', href: '/quizzes', icon: Brain },
    { label: 'Assistant IA', href: '/chat', icon: MessageCircle },
    { label: 'Gynécologues', href: '/gynecologists', icon: Stethoscope },
    { label: 'Rendez-vous', href: '/appointments', icon: Calendar },
];

export default function AppLayout({ children, title }) {
    const [open, setOpen] = useState(false);
    const { url } = usePage();
    let user = { name: 'Utilisatrice', email: '' };
    try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch(e) {}
    const logout = () => { localStorage.clear(); window.location.href = '/'; };
    const ini = (n) => (n || 'U').charAt(0).toUpperCase();

    return (
        <div className='flex h-screen overflow-hidden' style={{background:'linear-gradient(135deg,#f5f3ff 0%,#fdfbff 50%,#fff8ed 100%)'}}>
            {open && <div className='fixed inset-0 z-40 bg-black/40 lg:hidden' onClick={() => setOpen(false)} />}
            <aside className={(open ? 'translate-x-0' : '-translate-x-full') + ' lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 ease-in-out flex-shrink-0'} style={{background:'linear-gradient(170deg,#1e1b4b 0%,#3730a3 40%,#4f46e5 100%)'}}>
                <div className='flex items-center justify-between px-5 py-5 border-b border-white/10'>
                    <Logo size='sm' light />
                    <button onClick={() => setOpen(false)} className='lg:hidden text-white/60 hover:text-white'><X size={18}/></button>
                </div>
                <nav className='flex-1 px-3 py-4 overflow-y-auto sidebar-nav space-y-0.5'>
                    {nav.map(it => {
                        const I = it.icon; const a = url===it.href||url.startsWith(it.href+'/');
                        return (<Link key={it.href} href={it.href} className={('flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ')+(a?'bg-white/20 text-white':'text-white/65 hover:bg-white/10 hover:text-white')}><I size={18}/><span>{it.label}</span>{a&&<ChevronRight size={13} className='ml-auto'/>}</Link>);
                    })}
                </nav>
                <div className='px-3 pb-4 border-t border-white/10 pt-3 space-y-0.5'>
                    <Link href='/profile' className='flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/65 hover:bg-white/10 hover:text-white transition-all'>
                        <div className='w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white'>{ini(user.name)}</div>
                        <div className='flex-1 min-w-0'><p className='text-xs font-semibold text-white truncate'>{user.name}</p><p className='text-xs text-white/40 truncate'>{user.email}</p></div>
                    </Link>
                    <button onClick={logout} className='flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-white/65 hover:bg-red-500/20 hover:text-red-200 transition-all'><LogOut size={17}/><span className='text-sm'>Déconnexion</span></button>
                </div>
            </aside>
            <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
                <header className='flex items-center justify-between px-6 py-3.5 bg-white/80 backdrop-blur-md border-b border-violet-100/60 shadow-sm flex-shrink-0'>
                    <div className='flex items-center gap-3'>
                        <button onClick={() => setOpen(true)} className='lg:hidden p-2 rounded-lg text-gray-500 hover:bg-violet-50'><Menu size={20}/></button>
                        {title && <h1 className='text-lg font-semibold text-gray-800'>{title}</h1>}
                    </div>
                    <div className='flex items-center gap-2'>
                        <button className='relative p-2 rounded-xl hover:bg-violet-50 transition-colors'><Bell size={19} className='text-gray-500'/><span className='absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full'/></button>
                        <div className='w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold' style={{background:'linear-gradient(135deg,#7C3AED,#D97706)'}}>{ini(user.name)}</div>
                    </div>
                </header>
                <main className='flex-1 overflow-y-auto p-6'>{children}</main>
            </div>
        </div>
    );
}
