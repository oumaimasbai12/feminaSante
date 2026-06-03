import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import StatTile from '@/Components/UI/StatTile';
import GlassCard from '@/Components/UI/GlassCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import { BarChart, DonutChart } from '@/Components/UI/Charts';
import { Head, Link } from '@inertiajs/react';
import {
    Users, Calendar, Stethoscope, Baby, Moon, Droplets, Clock, ArrowRight, UserPlus,
} from 'lucide-react';

const APPOINTMENT_CHART_COLORS = {
    'En attente': '#D97706',
    'Confirmés': '#059669',
    'Terminés': '#853953',
    'Refusés': '#DC2626',
};

function StatSkeleton() {
    return (
        <div className="glass-card h-[118px] animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-brand-bg mb-3" />
            <div className="h-7 w-12 bg-brand-bg rounded mb-2" />
            <div className="h-3 w-20 bg-brand-bg rounded" />
        </div>
    );
}

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.axios.get('/api/v1/admin/dashboard')
            .then(r => setData(r.data?.data || r.data))
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, []);

    const stats = data?.stats || {};
    const charts = data?.charts || {};
    const appointmentSegments = (charts.appointments_by_status || []).map(s => ({
        ...s,
        color: APPOINTMENT_CHART_COLORS[s.label] || undefined,
    }));

    return (
        <AdminLayout title="Vue d'ensemble">
            <Head title="Admin - FeminaSante" />

            <p className="text-brand-muted text-sm mb-6">
                Supervisez les inscriptions, rendez-vous et praticiens depuis un seul endroit.
            </p>

            <div className="space-y-6">
                {loading ? (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
                        </div>
                        <div className="grid lg:grid-cols-2 gap-6">
                            <GlassCard className="h-52 animate-pulse" />
                            <GlassCard className="h-52 animate-pulse" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatTile label="Patientes" value={stats.total_patients} icon={Users} href="/admin/users" />
                            <StatTile label="Praticiens actifs" value={stats.active_gynecologists} icon={Stethoscope} href="/admin/gynecologists" />
                            <StatTile label="RDV en attente" value={stats.pending_appointments} icon={Clock} href="/admin/appointments?status=pending" />
                            <StatTile label="RDV aujourd'hui" value={stats.today_appointments} icon={Calendar} href="/admin/appointments" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            <GlassCard>
                                <h4 className="text-sm font-bold text-brand-ink mb-1">Inscriptions — 7 derniers jours</h4>
                                <p className="text-xs text-brand-muted mb-4">Nouvelles patientes par jour</p>
                                <BarChart data={charts.registrations_last_7_days || []} />
                            </GlassCard>
                            <GlassCard>
                                <h4 className="text-sm font-bold text-brand-ink mb-1">Rendez-vous par statut</h4>
                                <p className="text-xs text-brand-muted mb-4">Répartition sur la plateforme</p>
                                <DonutChart segments={appointmentSegments} />
                            </GlassCard>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-brand-ink mb-3">Activité plateforme</h4>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatTile label="Cycles" value={stats.total_cycles_logged} icon={Droplets} />
                                <StatTile label="Grossesses" value={stats.total_pregnancies} icon={Baby} />
                                <StatTile label="Ménopause" value={stats.total_menopauses} icon={Moon} />
                                <StatTile label="Total RDV" value={stats.total_appointments} icon={Calendar} href="/admin/appointments" />
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="table-shell">
                                <div className="table-toolbar py-4 !flex-row !items-center justify-between">
                                    <h4 className="font-bold text-brand-ink text-sm flex items-center gap-2">
                                        <UserPlus size={16} className="text-brand-primary" /> Inscriptions récentes
                                    </h4>
                                    <Link href="/admin/users" className="text-xs font-semibold text-brand-primary flex items-center gap-1 hover:opacity-80 transition-opacity">
                                        Voir tout <ArrowRight size={14} />
                                    </Link>
                                </div>
                                <div className="divide-y divide-brand-border">
                                    {(data?.recent_users || []).length === 0 ? (
                                        <p className="table-empty">Aucune inscription récente.</p>
                                    ) : data.recent_users.map(u => (
                                        <Link key={u.id} href={`/admin/users/${u.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-brand-bg/60 transition-colors">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-brand-ink text-sm truncate">{u.nom}</p>
                                                <p className="text-xs text-brand-muted truncate">{u.email}</p>
                                            </div>
                                            <span className="status-badge badge-inactive shrink-0">Patiente</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="table-shell">
                                <div className="table-toolbar py-4 !flex-row !items-center justify-between">
                                    <h4 className="font-bold text-brand-ink text-sm flex items-center gap-2">
                                        <Calendar size={16} className="text-brand-primary" /> Rendez-vous récents
                                    </h4>
                                    <Link href="/admin/appointments" className="text-xs font-semibold text-brand-primary flex items-center gap-1 hover:opacity-80 transition-opacity">
                                        Voir tout <ArrowRight size={14} />
                                    </Link>
                                </div>
                                <div className="divide-y divide-brand-border">
                                    {(data?.recent_appointments || []).length === 0 ? (
                                        <p className="table-empty">Aucun rendez-vous.</p>
                                    ) : data.recent_appointments.map(a => (
                                        <div key={a.id} className="flex items-center justify-between gap-3 px-5 py-4">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-brand-ink text-sm truncate">{a.patient_name}</p>
                                                <p className="text-xs text-brand-muted truncate">{a.doctor_name}</p>
                                            </div>
                                            <StatusBadge status={a.status} className="shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
