import React from 'react';
import AuthenticatedLayout from '@/Components/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import WeightTracker from '@/Components/Pregnancy/WeightTracker';
import PregnancySymptoms from '@/Components/Pregnancy/PregnancySymptoms';
import CheckupPlanner from '@/Components/Pregnancy/CheckupPlanner';

export default function Tools({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Boîte à Outils Grossesse</h2>}
        >
            <Head title="Outils Maternité - Femina Santé" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <div className="mb-4">
                        <Link href="/pregnancy" className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium bg-white w-max px-4 py-2 rounded-lg shadow-sm border border-indigo-50 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Retour au tableau de bord maternité
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <WeightTracker />
                            <PregnancySymptoms />
                        </div>
                        <div>
                            <CheckupPlanner />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
