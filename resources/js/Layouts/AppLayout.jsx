import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Logo from '../Components/Logo';
import { Home, Heart, Baby, BookOpen, MessageCircle, Stethoscope, Calendar, Menu, X, Bell, LogOut, ChevronRight, Brain, Moon } from 'lucide-react';

const nav = [
    { label: 'Tableau de bord', href: '/dashboard', icon: Home },
    { label: 'Suivi du cycle', href: '/cycles', icon: Heart },
    { label: 'Grossesse', href: '/pregnancies', icon: Baby },
    { label: 'Ménopause', href: '/menopause', icon: Moon },
    { label: 'Articles', href: '/articles', icon: BookOpen },
    { label: 'Quiz', href: '/quizzes', icon: Brain },
    { label: 'Assistant IA', href: '/chat', icon: MessageCircle },
    { label: 'Gynécologues', href: '/gynecologists', icon: Stethoscope },
    { label: 'Rendez-vous', href: '/appointments', icon: Calendar },
];

const adminNav = [
    { label: 'Dashboard Admin', href: '/admin/dashboard', icon: Home },
    { label: 'Gynécologues', href: '/admin/gynecologists', icon: Stethoscope },
];

const gynecologistNav = [
    { label: 'Espace Gynécologue', href: '/gynecologist/dashboard', icon: Stethoscope },
];
export default function AppLayout({ children, title }) {
    const [open, setOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        window.axios.get('/api/v1/notifications')
            .then(r => {
                const data = Array.isArray(r.data) ? r.data : [];
                setNotifications(data);
                setUnread(data.filter(n => !n.read_at).length);
            }).catch(() => { });
    }, []);
    useEffect(() => {
        const handler = (e) => {
            if (notifOpen && !e.target.closest('.notif-dropdown')) setNotifOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [notifOpen]);

    const markAsRead = async (notif) => {
        if (notif.read_at) return;
        await window.axios.put(`/api/v1/notifications/${notif.id}`, { mark_as_read: true }).catch(() => { });
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read_at: new Date().toISOString() } : n));
        setUnread(prev => Math.max(0, prev - 1));
    };

    const markAllRead = async () => {
        const unreadList = notifications.filter(n => !n.read_at);
        await Promise.all(unreadList.map(n =>
            window.axios.put(`/api/v1/notifications/${n.id}`, { mark_as_read: true }).catch(() => { })
        ));
        setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
        setUnread(0);
    };

    const deleteNotif = async (id, e) => {
        e.stopPropagation();
        await window.axios.delete(`/api/v1/notifications/${id}`).catch(() => { });
        setNotifications(prev => prev.filter(n => n.id !== id));
        setUnread(prev => {
            const wasUnread = notifications.find(n => n.id === id && !n.read_at);
            return wasUnread ? Math.max(0, prev - 1) : prev;
        });
    };
    const { url } = usePage();
    let user = { name: 'Utilisatrice', email: '' };
    try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch (e) { }
    const logout = async () => {
        try {
            await window.axios.post('/api/v1/logout');
        } catch (e) { }
        if (window.setAuthToken) {
            window.setAuthToken(null);
        }
        localStorage.removeItem('user');
        window.location.href = '/';
    };
    const ini = (n) => (n || 'U').charAt(0).toUpperCase();

    return (
        <div className='flex h-screen overflow-hidden relative bg-slate-50'>
            {open && <div className='fixed inset-0 z-40 bg-black/40 lg:hidden' onClick={() => setOpen(false)} />}
            <aside className={(open ? 'translate-x-0' : '-translate-x-full') + ' lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 ease-in-out flex-shrink-0 bg-white border-r border-slate-200'}>
                <div className='flex items-center justify-between px-6 py-6 border-b border-slate-100'>
                    <Logo size='sm' />
                    <button onClick={() => setOpen(false)} className='lg:hidden text-slate-500 hover:text-slate-700'><X size={18} /></button>
                </div>
                <nav className='flex-1 px-4 py-5 overflow-y-auto sidebar-nav space-y-1'>
                    {nav.map(it => {
                        const I = it.icon;
                        const a = url === it.href || url.startsWith(it.href + '/');
                        return (
                            <Link key={it.href} href={it.href}
                                className={'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ' +
                                    (a ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}>
                                <I size={18} /><span>{it.label}</span>
                                {a && <ChevronRight size={13} className='ml-auto' />}
                            </Link>
                        );
                    })}

                    {/* Admin section — only visible to admins */}
                    {user.is_admin && (
                        <>
                            <div className='px-4 pt-5 pb-2'>
                                <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Admin</p>
                            </div>
                            {adminNav.map(it => {
                                const I = it.icon;
                                const a = url === it.href || url.startsWith(it.href + '/');
                                return (
                                    <Link key={it.href} href={it.href}
                                        className={'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ' +
                                            (a ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}>
                                        <I size={18} /><span>{it.label}</span>
                                        {a && <ChevronRight size={13} className='ml-auto' />}
                                    </Link>
                                );
                            })}
                        </>
                    )}

                    {/* Gynecologist section — only visible to gynecologists */}
                    {user.is_gynecologist && (
                        <>
                            <div className='px-4 pt-5 pb-2'>
                                <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Praticien</p>
                            </div>
                            {gynecologistNav.map(it => {
                                const I = it.icon;
                                const a = url === it.href || url.startsWith(it.href + '/');
                                return (
                                    <Link key={it.href} href={it.href}
                                        className={'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ' +
                                            (a ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}>
                                        <I size={18} /><span>{it.label}</span>
                                        {a && <ChevronRight size={13} className='ml-auto' />}
                                    </Link>
                                );
                            })}
                        </>
                    )}
                </nav>
                <div className='px-4 pb-5 border-t border-slate-100 pt-4 space-y-1'>
                    <Link href='/profile' className='flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all'>
                        <div className='w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-700'>{ini(user.name || user.nom)}</div>
                        <div className='flex-1 min-w-0'><p className='text-sm font-semibold text-slate-900 truncate'>{user.name || user.nom}</p><p className='text-xs text-slate-500 truncate'>{user.email}</p></div>
                    </Link>
                    <button onClick={logout} className='flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-rose-700 transition-all'><LogOut size={17} /><span className='text-sm'>Déconnexion</span></button>
                </div>
            </aside>
            <div className='flex-1 flex flex-col min-w-0 overflow-hidden relative z-10'>
                <header className='flex items-center justify-between px-8 py-5 bg-white border-b border-slate-100 flex-shrink-0 relative z-[999]'>
                    <div className='flex items-center gap-4'>
                        <button onClick={() => setOpen(true)} className='lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors'><Menu size={20} /></button>
                        {title && <h1 className='text-xl font-bold text-slate-900'>{title}</h1>}
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='relative notif-dropdown'>
                            <button onClick={() => setNotifOpen(!notifOpen)} className='relative p-2.5 rounded-xl hover:bg-slate-50 transition-colors'>
                                <Bell size={20} className='text-slate-500' />
                                {unread > 0 && (
                                    <span className='absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-rose-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center'>
                                        {unread > 9 ? '9+' : unread}
                                    </span>
                                )}
                            </button>

                            {notifOpen && (
                                <div className='absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-[999] overflow-hidden'>
                                    {/* Header */}
                                    <div className='flex items-center justify-between px-5 py-4 border-b border-slate-100'>
                                        <h3 className='font-semibold text-slate-900 text-sm'>Notifications {unread > 0 && <span className='ml-2 px-2 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold'>{unread}</span>}</h3>
                                        {unread > 0 && (
                                            <button onClick={markAllRead} className='text-xs text-rose-600 hover:text-rose-800 font-semibold'>
                                                Tout lire
                                            </button>
                                        )}
                                    </div>

                                    {/* List */}
                                    <div className='max-h-80 overflow-y-auto divide-y divide-slate-50'>
                                        {notifications.length === 0 && (
                                            <div className='text-center py-10 text-slate-400 text-sm'>
                                                <Bell size={28} className='mx-auto mb-3 text-slate-200' />
                                                Aucune notification
                                            </div>
                                        )}
                                        {notifications.map(n => (
                                            <div key={n.id} onClick={() => markAsRead(n)}
                                                className={'flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition ' + (!n.read_at ? 'bg-rose-50/40' : '')}>
                                                <div className={'w-2 h-2 rounded-full mt-2 flex-shrink-0 ' + (!n.read_at ? 'bg-rose-500' : 'bg-slate-200')} />
                                                <div className='flex-1 min-w-0'>
                                                    <p className={'text-sm font-semibold truncate ' + (!n.read_at ? 'text-slate-900' : 'text-slate-600')}>{n.title}</p>
                                                    <p className='text-xs text-slate-500 mt-1 line-clamp-2'>{n.message}</p>
                                                    <p className='text-xs text-slate-400 mt-1.5'>{new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <button onClick={(e) => deleteNotif(n.id, e)} className='text-slate-300 hover:text-rose-500 transition flex-shrink-0 mt-1'>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    {notifications.length > 0 && (
                                        <div className='px-5 py-3 border-t border-slate-100 text-center'>
                                            <span className='text-xs text-slate-400'>{notifications.length} notification{notifications.length > 1 ? 's' : ''} au total</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-rose-500'>{ini(user.name || user.nom)}</div>
                    </div>
                </header>
                <main className='flex-1 overflow-y-auto p-8'>{children}</main>
            </div>
        </div>
    );
}
