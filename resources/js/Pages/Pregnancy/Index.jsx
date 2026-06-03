import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import PregnancyDashboard from '@/Components/Pregnancy/PregnancyDashboard';
import DueDateCalculator from '@/Components/Pregnancy/DueDateCalculator';
import WeekByWeek from '@/Components/Pregnancy/WeekByWeek';
import KickCounter from '@/Components/Pregnancy/KickCounter';
import ContractionTimer from '@/Components/Pregnancy/ContractionTimer';
import MedicalDisclaimer from '@/Components/Diseases/MedicalDisclaimer';

export default function Index() {
 return (
 <AppLayout title="Grossesse">
 <Head title="Suivi Grossesse - Femina Santé" />

 <div className="py-8">
 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
 
 <div className="mb-8">
 <h1 className="text-3xl font-extrabold text-brand-ink tracking-tight">Bonjour future maman !</h1>
 <p className="text-brand-muted mt-2 text-lg">Retrouvez ici tous les outils pour un suivi de grossesse serein.</p>
 </div>

 <MedicalDisclaimer />

 <PregnancyDashboard />

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-1 border-brand-border overflow-hidden h-full">
 <WeekByWeek currentWeek={24} />
 </div>
 
 <div className="grid grid-cols-1 gap-8 h-full">
 <DueDateCalculator />
 <KickCounter />
 </div>
 
 <div className="grid grid-cols-1 gap-8 h-full">
 <ContractionTimer />
            <div className="glass-card bg-brand-soft/40 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-brand-ink mb-2">Suivi maternité</h3>
                <p className="text-brand-muted mb-4 text-sm">Consultez tous nos outils détaillés (courbes de poids, planner d'examens médicaux).</p>
                <Link href="/pregnancy/tools" className="mt-auto btn-primary text-center">
                    Ouvrir la boîte à outils
                </Link>
            </div>
 </div>
 </div>
 </div>
 </div>
 </AppLayout>
 );
}
