import React from 'react';
import AuthenticatedLayout from '@/Components/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import MenopauseDashboard from '@/Components/Menopause/MenopauseDashboard';
import SymptomLogger from '@/Components/Menopause/SymptomLogger';
import TreatmentManager from '@/Components/Menopause/TreatmentManager';
import MedicalDisclaimer from '@/Components/Diseases/MedicalDisclaimer';

export default function Index({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Ménopause</h2>}
        >
            <Head title="Suivi Ménopause - Femina Santé" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Accompagnement Ménopause</h1>
                        <p className="text-gray-600 mt-2 text-lg">Retrouvez ici tous les outils pour un suivi personnalisé et serein de cette nouvelle étape.</p>
                    </div>

                    <MedicalDisclaimer />

                    <MenopauseDashboard />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="h-full">
                            <SymptomLogger />
                        </div>
                        
                        <div className="h-full">
                            <TreatmentManager />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
