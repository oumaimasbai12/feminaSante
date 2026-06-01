import React, { useState, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import MenopauseDashboard from '../../Components/Menopause/MenopauseDashboard';
import SymptomLogger from '../../Components/Menopause/SymptomLogger';
import TreatmentManager from '../../Components/Menopause/TreatmentManager';

export default function MenopauseIndex() {
    const [data, setData] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const loadData = async () => {
        try {
            const { default: axios } = await import('axios');
            const response = await axios.get('/api/v1/menopauses');
            if (response.data && response.data.length > 0) {
                // Fetch symptom logs to include them
                const logsResponse = await axios.get(`/api/v1/menopauses/${response.data[0].id}/symptom-logs`);
                setData({
                    menopause: {
                        ...response.data[0],
                        symptom_logs: logsResponse.data || []
                    }
                });
            }
        } catch (err) {
            console.error('Failed to load data', err);
        }
    };

    useEffect(() => {
        loadData();
    }, [refreshKey]);

    return (
        <AppLayout title='Ménopause'>
            <div className='space-y-6'>
                <div>
                    <h1 className='text-2xl font-extrabold text-slate-900'>Accompagnement Ménopause</h1>
                    <p className='text-slate-500 mt-1'>Tous les outils pour un suivi personnalisé et serein.</p>
                </div>

                <div className='bg-amber-50 border border-amber-200 rounded-2xl p-4'>
                    <p className='text-sm text-amber-800'>
                        <span className="font-bold">⚠️ Information médicale :</span> Ces outils sont fournis à titre éducatif uniquement et ne remplacent pas l'avis d'un professionnel de santé.
                    </p>
                </div>

                <MenopauseDashboard data={data} />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <SymptomLogger onSave={() => setRefreshKey(prev => prev + 1)} />
                    <TreatmentManager />
                </div>
            </div>
        </AppLayout>
    );
}
