import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Logo from '../Logo';
import { Menu, X, Bell, LogOut, ChevronRight, User } from 'lucide-react';
import { getStoredUser, refreshUser, logout as authLogout, ensureAuthToken } from '@/utils/auth';
import { getNotificationUrl, getNotificationActionLabel } from '@/utils/notifications';
import PageContent from '@/Components/UI/PageContent';

export default function AppShell({
    children,
    title,
    roleLabel,
    navItems = [],
    navSections = [],
    showNotifications = false,
    showProfileLink = true,
    maxWidth = 'max-w-7xl',
    onMount,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const [user, setUser] = useState(() => getStoredUser());
    const { url } = usePage();
    const mainRef = useRef(null);

    useEffect(() => {
        mainRef.current?.scrollTo({ top: 0, left: 0 });
    }, [url]);

    useEffect(() => {
        onMount?.().then(u => { if (u) setUser(u); });
        refreshUser().then(u => { if (u) setUser(u); });
    }, []);

    useEffect(() => {
        if (!showNotifications || !ensureAuthToken()) return;
        window.axios.get('/api/v1/notifications')
            .then(r => {
                const data = Array.isArray(r.data) ? r.data : [];
                setNotifications(data);
                setUnread(data.filter(n => !n.read_at).length);
            }).catch(() => {});
    }, [showNotifications]);

    useEffect(() => {
        const handler = (e) => {
            if (notifOpen && !e.target.closest('.sidebar-notifications')) setNotifOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [notifOpen]);

    const markAsRead = async (notif) => {
        if (notif.read_at) return;
        await window.axios.put(`/api/v1/notifications/${notif.id}`, { mark_as_read: true }).catch(() => {});
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read_at: new Date().toISOString() } : n));
        setUnread(prev => Math.max(0, prev - 1));
    };

    const openNotification = async (notif) => {
        await markAsRead(notif);
        setNotifOpen(false);
        closeSidebar();
        const target = getNotificationUrl(notif);
        if (target) {
            router.visit(target, { preserveState: false, preserveScroll: false });
        }
    };

    const markAllRead = async () => {
        const unreadList = notifications.filter(n => !n.read_at);
        await Promise.all(unreadList.map(n =>
            window.axios.put(`/api/v1/notifications/${n.id}`, { mark_as_read: true }).catch(() => {})
        ));
        setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
        setUnread(0);
    };

    const displayName = user?.name || user?.nom || 'Utilisatrice';
    const initial = (displayName || 'U').charAt(0).toUpperCase();
    const closeSidebar = () => setSidebarOpen(false);

    const renderNavLink = (item) => {
        const Icon = item.icon;
        const active = item.match ? item.match(url) : (url === item.href || url.startsWith(item.href + '/'));
        const disabled = item.disabled;

        if (disabled) {
            return (
                <div key={item.href} title={item.disabledTitle} className="nav-link opacity-40 cursor-not-allowed" aria-disabled="true">
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-brand-soft">{item.badge}</span>}
                </div>
            );
        }

        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`nav-link ${active ? 'nav-link-active' : ''}`}
            >
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
                {active && (
                    <ChevronRight
                        size={13}
                        className="opacity-50"
                        style={{ transition: 'transform var(--fs-page-transition) var(--fs-page-easing)' }}
                    />
                )}
            </Link>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-brand-bg">
            <div
                className={`fixed inset-0 z-40 bg-brand-ink/20 backdrop-blur-sm lg:hidden sidebar-overlay ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeSidebar}
                aria-hidden={!sidebarOpen}
            />

            {!sidebarOpen && (
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl glass-panel border border-brand-border text-brand-muted hover:text-brand-ink transition-colors"
                    aria-label="Ouvrir le menu"
                >
                    <Menu size={20} />
                </button>
            )}

            <aside
                className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col w-64 glass-panel border-r border-brand-border sidebar-drawer lg:translate-x-0 flex-shrink-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between px-5 py-5 border-b border-brand-border">
                    <Link href={navItems[0]?.href || '/'} onClick={closeSidebar}>
                        <Logo size="sm" />
                    </Link>
                    <button type="button" onClick={closeSidebar} className="lg:hidden text-brand-muted hover:text-brand-ink transition-colors">
                        <X size={18} />
                    </button>
                </div>
                {roleLabel && (
                    <p className="px-5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-brand-muted">{roleLabel}</p>
                )}

                <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
                    {navItems.map(renderNavLink)}
                    {navSections.map(section => (
                        <div key={section.title} className="pt-4 mt-2 border-t border-brand-border">
                            <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">{section.title}</p>
                            {section.items.map(renderNavLink)}
                        </div>
                    ))}
                </nav>

                {showNotifications && (
                    <div className="px-3 pb-2 border-t border-brand-border pt-3 sidebar-notifications flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => setNotifOpen(o => !o)}
                            className={`nav-link w-full border border-transparent ${notifOpen ? 'nav-link-active border-brand-primary/30' : 'hover:border-brand-primary/25'}`}
                        >
                            <Bell size={18} />
                            <span className="flex-1 text-left">Notifications</span>
                            {unread > 0 && (
                                <span className="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center border border-brand-primary/35 bg-brand-bg text-brand-primary tabular-nums">
                                    {unread > 9 ? '9+' : unread}
                                </span>
                            )}
                            <ChevronRight
                                size={13}
                                className={`opacity-50 transition-transform ease-in-out ${notifOpen ? 'rotate-90' : ''}`}
                                style={{ transitionDuration: 'var(--fs-page-transition)' }}
                            />
                        </button>

                        <div
                            className={`sidebar-collapse ${notifOpen ? 'sidebar-collapse--open mt-2' : 'sidebar-collapse--closed mt-0'}`}
                            aria-hidden={!notifOpen}
                        >
                            <div className="overflow-hidden min-h-0">
                                <div className="rounded-xl border border-brand-border bg-white/50 backdrop-blur-sm overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-2.5 border-b border-brand-border">
                                    <span className="text-xs font-semibold text-brand-ink">
                                        {unread > 0 ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'À jour'}
                                    </span>
                                    {unread > 0 && (
                                        <button
                                            type="button"
                                            onClick={markAllRead}
                                            className="text-[11px] text-brand-primary font-semibold hover:opacity-80 transition-opacity"
                                        >
                                            Tout lire
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-52 overflow-y-auto">
                                    {notifications.length === 0 && (
                                        <div className="text-center py-8 text-brand-muted text-xs">
                                            <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center mx-auto mb-2 text-brand-primary">
                                                <Bell size={18} />
                                            </div>
                                            Aucune notification
                                        </div>
                                    )}
                                    {notifications.map((n) => (
                                        <button
                                            key={n.id}
                                            type="button"
                                            onClick={() => openNotification(n)}
                                            className={`w-full flex items-start gap-2.5 px-3 py-2.5 text-left transition-all duration-200 border border-transparent hover:border-brand-primary/30 hover:bg-white/60 ${
                                                !n.read_at ? 'bg-brand-bg/50' : ''
                                            }`}
                                        >
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${!n.read_at ? 'bg-brand-primary' : 'bg-brand-border'}`}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-xs font-semibold truncate ${!n.read_at ? 'text-brand-ink' : 'text-brand-muted'}`}
                                                >
                                                    {n.title}
                                                </p>
                                                <p className="text-[11px] text-brand-muted mt-0.5 line-clamp-2">
                                                    {n.message}
                                                </p>
                                                {getNotificationUrl(n) && (
                                                    <span className="text-[10px] font-bold text-brand-primary">
                                                        {getNotificationActionLabel(n)} →
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-3 border-t border-brand-border space-y-1 flex-shrink-0">
                    {user?.email && (
                        showProfileLink ? (
                            <Link
                                href="/profile"
                                onClick={closeSidebar}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border group ${
                                    url === '/profile' || url.startsWith('/profile/')
                                        ? 'border-brand-primary/35 bg-brand-bg/80'
                                        : 'border-transparent hover:border-brand-primary/35 hover:bg-white/50'
                                }`}
                                style={{
                                    transition:
                                        'border-color var(--fs-page-transition) var(--fs-page-easing), background var(--fs-page-transition) var(--fs-page-easing)',
                                }}
                            >
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 bg-brand-bg border border-brand-border text-brand-primary group-hover:border-brand-primary/30 transition-colors">
                                    {initial}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-brand-ink truncate">{displayName}</p>
                                    <p className="text-xs text-brand-muted truncate">{user.email}</p>
                                </div>
                                <User size={14} className="text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 bg-brand-bg border border-brand-border text-brand-primary">
                                    {initial}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-brand-ink truncate">{displayName}</p>
                                    <p className="text-xs text-brand-muted truncate">{user.email}</p>
                                </div>
                            </div>
                        )
                    )}
                    <button
                        type="button"
                        onClick={() => authLogout()}
                        className="nav-link w-full border border-transparent hover:border-brand-primary/25"
                    >
                        <LogOut size={17} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            <main
                ref={mainRef}
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-w-0 pt-16 lg:pt-8 [scrollbar-gutter:stable]"
            >
                <div className={`${maxWidth} mx-auto`}>
                    {title && <h1 className="page-title mb-6">{title}</h1>}
                    <PageContent>{children}</PageContent>
                </div>
            </main>
        </div>
    );
}
