import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Hand, MessageCircle } from 'lucide-react';
import DashboardStats from '@/Components/Dashboard/DashboardStats';
import QuickActions from '@/Components/Dashboard/QuickActions';
import ProgressChart from '@/Components/Dashboard/ProgressChart';
import HealthTips from '@/Components/Dashboard/HealthTips';

export default function Dashboard({ auth }) {
    return (
        <AppLayout title="Tableau de bord">
            <Head title="Tableau de bord - Femina Santé" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <div className="mb-4">
                        <h1 className="text-3xl font-extrabold text-brand-ink tracking-tight flex items-center gap-2 flex-wrap">
                            Bonjour, {auth?.user?.nom || auth?.user?.name || 'Inconnue'}
                            <Hand size={28} className="text-brand-primary" aria-hidden />
                        </h1>
                        <p className="mt-2 text-brand-muted text-lg">Voici un aperçu de votre santé aujourd'hui.</p>
                    </div>

                    <DashboardStats />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <ProgressChart />
                        </div>
                        <div className="space-y-8">
                            <HealthTips />
                            <div className="glass-card p-6 bg-brand-primary text-white text-center relative overflow-hidden">
                                <MessageCircle className="absolute top-0 right-0 w-24 h-24 text-white/10 -mr-4 -mt-4" aria-hidden />
                                <h4 className="text-xl font-bold mb-2 relative z-10">Besoin d'aide ?</h4>
                                <p className="text-white/80 mb-6 text-sm relative z-10">Posez vos questions à notre assistant intelligent éducatif.</p>
                                <Link href="/chat" className="btn-secondary relative z-10 bg-white text-brand-primary border-white/30 hover:bg-brand-soft">
                                    Démarrer le chat
                                </Link>
                            </div>
                        </div>
                    </div>

                    <QuickActions />
                </div>
            </div>
        </AppLayout>
    );
}
