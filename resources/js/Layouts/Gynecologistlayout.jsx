import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Calendar, Menu, X, LogOut, ChevronRight, Stethoscope } from 'lucide-react';

const gynoNav = [
    { label: 'Tableau de bord', href: '/gynecologist/dashboard', icon: LayoutDashboard },
    { label: 'Rendez-vous', href: '/gynecologist/appointments', icon: Calendar },
];

export default function GynecologistLayout({ children, title }) {
    const [open, setOpen] = useState(false);
    const { url } = usePage();

    let user = { name: 'Gynécologue', email: '' };
    try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch (e) { /* silent */ }

    // Injecte le Bearer token dans axios dès le montage du layout
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token && window.axios) {
            window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const logout = async () => {
        try { await window.axios.post('/api/v1/logout'); } catch (e) { /* silent */ }
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const ini = (n) => (n || 'G').charAt(0).toUpperCase();
    const displayName = user.name || user.nom || 'Gynécologue';

    return (
        <div className="flex h-screen overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg,#f0fdf4 0%,#f0f9ff 50%,#fdf2f8 100%)' }}>

            {/* Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal-400/15 blur-3xl animate-pulse" />
                <div className="absolute top-1/4 -right-20 w-[30rem] h-[30rem] rounded-full bg-emerald-300/15 blur-3xl animate-pulse [animation-delay:2s]" />
                <div className="absolute -bottom-40 left-1/4 w-[30rem] h-[30rem] rounded-full bg-cyan-400/15 blur-3xl animate-pulse [animation-delay:4s]" />
            </div>

            {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

            {/* Sidebar */}
            <aside className={(open ? 'translate-x-0' : '-translate-x-full') +
                ' lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 ease-in-out flex-shrink-0'}
                style={{ background: 'linear-gradient(170deg,#0d9488 0%,#14b8a6 40%,#2dd4bf 100%)' }}>

                <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Stethoscope size={24} className="text-white" />
                        <span className="text-lg font-bold text-white">Espace Praticien</span>
                    </div>
                    <button onClick={() => setOpen(false)} className="lg:hidden text-white/60 hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
                    {gynoNav.map(({ href, label, icon: Icon }) => {
                        const active = url === href || url.startsWith(href + '/');
                        return (
                            <Link key={href} href={href}
                                className={'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ' +
                                    (active ? 'bg-white/20 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white')}>
                                <Icon size={18} />
                                <span>{label}</span>
                                {active && <ChevronRight size={13} className="ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-0.5">
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/80">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                            {ini(displayName)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                            <p className="text-xs text-white/40 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-white/65 hover:bg-red-500/20 hover:text-red-200 transition-all">
                        <LogOut size={17} />
                        <span className="text-sm">Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <header className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-xl border-b border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-teal-50 transition-colors">
                            <Menu size={20} />
                        </button>
                        {title && (
                            <h1 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                                {title}
                            </h1>
                        )}
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: 'linear-gradient(135deg,#0d9488,#2dd4bf)' }}>
                        {ini(displayName)}
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}