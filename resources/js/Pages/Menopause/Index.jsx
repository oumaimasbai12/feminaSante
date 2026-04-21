import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import MenopauseDashboard from '../../Components/Menopause/MenopauseDashboard';
import SymptomLogger from '../../Components/Menopause/SymptomLogger';
import TreatmentManager from '../../Components/Menopause/TreatmentManager';

export default function MenopauseIndex() {
    return (
        <AppLayout title='Ménopause'>
            <div className='space-y-6'>
                <div>
                    <h1 className='text-2xl font-extrabold text-gray-900'>Accompagnement Ménopause</h1>
                    <p className='text-gray-500 mt-1'>Tous les outils pour un suivi personnalisé et serein.</p>
                </div>

                <div className='card bg-amber-50 border border-amber-200'>
                    <p className='text-sm text-amber-800'>
                        ⚠️ <strong>Information médicale :</strong> Ces outils sont fournis à titre éducatif uniquement et ne remplacent pas l'avis d'un professionnel de santé.
                    </p>
                </div>

                <MenopauseDashboard />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <SymptomLogger />
                    <TreatmentManager />
                </div>
            </div>
        </AppLayout>
    );
}