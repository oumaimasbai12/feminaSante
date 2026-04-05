import React from 'react';
import AuthenticatedLayout from '@/Components/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DashboardStats from '@/Components/Dashboard/DashboardStats';
import QuickActions from '@/Components/Dashboard/QuickActions';
import ProgressChart from '@/Components/Dashboard/ProgressChart';
import HealthTips from '@/Components/Dashboard/HealthTips';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Tableau de bord</h2>}
        >
            <Head title="Tableau de bord - Femina Santé" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Welcome MSG */}
                    <div className="mb-4">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bonjour, {auth?.user?.nom || auth?.user?.name || 'Inconnue'} 👋</h1>
                        <p className="mt-2 text-gray-600 text-lg">Voici un aperçu de votre santé aujourd'hui.</p>
                    </div>

                    <DashboardStats />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <ProgressChart />
                        </div>
                        <div className="space-y-8">
                            <HealthTips />
                            <div className="bg-indigo-600 rounded-3xl p-6 text-white text-center shadow-md relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-20 group-hover:scale-110 transition-transform">
                                    <svg className="w-32 h-32 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd"></path></svg>
                                </div>
                                <h4 className="text-xl font-bold mb-2 relative z-10">Besoin d'aide ?</h4>
                                <p className="text-indigo-100 mb-6 text-sm relative z-10">Posez vos questions à notre assistant intelligent éducatif.</p>
                                <a href="/chat" className="inline-block px-6 py-2 bg-white text-indigo-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition relative z-10">
                                    Démarrer le chat
                                </a>
                            </div>
                        </div>
                    </div>

                    <QuickActions />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
