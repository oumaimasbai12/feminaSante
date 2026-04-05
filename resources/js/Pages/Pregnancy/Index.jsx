import React from 'react';
import AuthenticatedLayout from '@/Components/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PregnancyDashboard from '@/Components/Pregnancy/PregnancyDashboard';
import DueDateCalculator from '@/Components/Pregnancy/DueDateCalculator';
import WeekByWeek from '@/Components/Pregnancy/WeekByWeek';
import KickCounter from '@/Components/Pregnancy/KickCounter';
import ContractionTimer from '@/Components/Pregnancy/ContractionTimer';
import MedicalDisclaimer from '@/Components/Diseases/MedicalDisclaimer';

export default function Index({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Maternité</h2>}
        >
            <Head title="Suivi Grossesse - Femina Santé" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bonjour future maman !</h1>
                        <p className="text-gray-600 mt-2 text-lg">Retrouvez ici tous les outils pour un suivi de grossesse serein.</p>
                    </div>

                    <MedicalDisclaimer />

                    <PregnancyDashboard />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 border-gray-100 overflow-hidden h-full">
                            <WeekByWeek currentWeek={24} />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-8 h-full">
                            <DueDateCalculator />
                            <KickCounter />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-8 h-full">
                            <ContractionTimer />
                            <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex flex-col justify-center">
                                <h3 className="text-xl font-bold text-orange-900 mb-2">Suivi Maternité</h3>
                                <p className="text-orange-800/80 mb-4 text-sm font-medium">Consultez tous nos outils détaillés (courbes de poids, planner d'examens médicaux).</p>
                                <Link href="/pregnancy/tools" className="mt-auto inline-block py-3 px-4 bg-orange-600 text-white font-bold rounded-xl text-center hover:bg-orange-700">
                                    Ouvrir la boîte à outils
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
