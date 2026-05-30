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
        <div className='flex h-screen overflow-hidden relative' style={{ background: 'linear-gradient(135deg,#FDF7F8 0%,#F1E6F0 50%,#EEECE0 100%)' }}>
            {/* Ambient Animated Background Ornaments */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none z-0'>
                <div className='absolute -top-40 -left-40 w-96 h-96 rounded-full bg-pink-400/20 blur-3xl animate-blob'></div>
                <div className='absolute top-1/4 -right-20 w-[30rem] h-[30rem] rounded-full bg-rose-300/20 blur-3xl animate-blob animation-delay-2000'></div>
                <div className='absolute -bottom-40 left-1/4 w-[30rem] h-[30rem] rounded-full bg-rose-400/20 blur-3xl animate-blob animation-delay-4000'></div>
            </div>

            {open && <div className='fixed inset-0 z-40 bg-black/40 lg:hidden' onClick={() => setOpen(false)} />}
            <aside className={(open ? 'translate-x-0' : '-translate-x-full') + ' lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 ease-in-out flex-shrink-0'} style={{ background: 'linear-gradient(170deg,#DB779B 0%,#D9A1D4 40%,#86437E 100%)' }}>
                <div className='flex items-center justify-between px-5 py-5 border-b border-white/10'>
                    <Logo size='sm' light />
                    <button onClick={() => setOpen(false)} className='lg:hidden text-white/60 hover:text-white'><X size={18} /></button>
                </div>
                <nav className='flex-1 px-3 py-4 overflow-y-auto sidebar-nav space-y-0.5'>
                    {nav.map(it => {
                        const I = it.icon;
                        const a = url === it.href || url.startsWith(it.href + '/');
                        return (
                            <Link key={it.href} href={it.href}
                                className={'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ' +
                                    (a ? 'bg-white/20 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white')}>
                                <I size={18} /><span>{it.label}</span>
                                {a && <ChevronRight size={13} className='ml-auto' />}
                            </Link>
                        );
                    })}

                    {/* Admin section — only visible to admins */}
                    {user.is_admin && (
                        <>
                            <div className='px-4 pt-4 pb-1'>
                                <p className='text-xs font-bold text-white/30 uppercase tracking-widest'>Admin</p>
                            </div>
                            {adminNav.map(it => {
                                const I = it.icon;
                                const a = url === it.href || url.startsWith(it.href + '/');
                                return (
                                    <Link key={it.href} href={it.href}
                                        className={'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ' +
                                            (a ? 'bg-white/20 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white')}>
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
                            <div className='px-4 pt-4 pb-1'>
                                <p className='text-xs font-bold text-white/30 uppercase tracking-widest'>Praticien</p>
                            </div>
                            {gynecologistNav.map(it => {
                                const I = it.icon;
                                const a = url === it.href || url.startsWith(it.href + '/');
                                return (
                                    <Link key={it.href} href={it.href}
                                        className={'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ' +
                                            (a ? 'bg-white/20 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white')}>
                                        <I size={18} /><span>{it.label}</span>
                                        {a && <ChevronRight size={13} className='ml-auto' />}
                                    </Link>
                                );
                            })}
                        </>
                    )}
                </nav>
                <div className='px-3 pb-4 border-t border-white/10 pt-3 space-y-0.5'>
                    <Link href='/profile' className='flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/65 hover:bg-white/10 hover:text-white transition-all'>
                        <div className='w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white'>{ini(user.name || user.nom)}</div>
                        <div className='flex-1 min-w-0'><p className='text-xs font-semibold text-white truncate'>{user.name || user.nom}</p><p className='text-xs text-white/40 truncate'>{user.email}</p></div>
                    </Link>
                    <button onClick={logout} className='flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-white/65 hover:bg-red-500/20 hover:text-red-200 transition-all'><LogOut size={17} /><span className='text-sm'>Déconnexion</span></button>
                </div>
            </aside>
            <div className='flex-1 flex flex-col min-w-0 overflow-hidden relative z-10'>
                <header className='flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-xl border-b border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-shrink-0 relative z-[999]'>
                    <div className='flex items-center gap-3'>
                        <button onClick={() => setOpen(true)} className='lg:hidden p-2 rounded-lg text-gray-500 hover:bg-pink-50 transition-colors'><Menu size={20} /></button>
                        {title && <h1 className='text-lg font-bold bg-gradient-to-r from-pink-600 to-olive-500 bg-clip-text text-transparent'>{title}</h1>}
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='relative notif-dropdown'>
                            <button onClick={() => setNotifOpen(!notifOpen)} className='relative p-2 rounded-xl hover:bg-pink-50 transition-colors'>
                                <Bell size={19} className='text-gray-500' />
                                {unread > 0 && (
                                    <span className='absolute top-1 right-1 w-4 h-4 bg-pink-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center'>
                                        {unread > 9 ? '9+' : unread}
                                    </span>
                                )}
                            </button>

                            {notifOpen && (
                                <div className='absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-pink-100 z-[999] overflow-hidden'>
                                    {/* Header */}
                                    <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
                                        <h3 className='font-bold text-gray-900 text-sm'>Notifications {unread > 0 && <span className='ml-1 px-1.5 py-0.5 bg-pink-100 text-pink-600 rounded-full text-xs'>{unread}</span>}</h3>
                                        {unread > 0 && (
                                            <button onClick={markAllRead} className='text-xs text-pink-600 hover:text-pink-800 font-semibold'>
                                                Tout lire
                                            </button>
                                        )}
                                    </div>

                                    {/* List */}
                                    <div className='max-h-80 overflow-y-auto divide-y divide-gray-50'>
                                        {notifications.length === 0 && (
                                            <div className='text-center py-8 text-gray-400 text-sm'>
                                                <Bell size={28} className='mx-auto mb-2 text-gray-200' />
                                                Aucune notification
                                            </div>
                                        )}
                                        {notifications.map(n => (
                                            <div key={n.id} onClick={() => markAsRead(n)}
                                                className={'flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ' + (!n.read_at ? 'bg-pink-50/50' : '')}>
                                                <div className={'w-2 h-2 rounded-full mt-2 flex-shrink-0 ' + (!n.read_at ? 'bg-pink-500' : 'bg-gray-200')} />
                                                <div className='flex-1 min-w-0'>
                                                    <p className={'text-sm font-semibold truncate ' + (!n.read_at ? 'text-gray-900' : 'text-gray-500')}>{n.title}</p>
                                                    <p className='text-xs text-gray-400 mt-0.5 line-clamp-2'>{n.message}</p>
                                                    <p className='text-xs text-gray-300 mt-1'>{new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <button onClick={(e) => deleteNotif(n.id, e)} className='text-gray-300 hover:text-red-400 transition flex-shrink-0 mt-1'>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    {notifications.length > 0 && (
                                        <div className='px-4 py-2 border-t border-gray-100 text-center'>
                                            <span className='text-xs text-gray-400'>{notifications.length} notification{notifications.length > 1 ? 's' : ''} au total</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold' style={{ background: 'linear-gradient(135deg,#DB779B,#D9A1D4)' }}>{ini(user.name || user.nom)}</div>
                    </div>
                </header>
                <main className='flex-1 overflow-y-auto p-6'>{children}</main>
            </div>
        </div>
    );
}
