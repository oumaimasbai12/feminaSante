import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Components/Layouts/AuthenticatedLayout';
import DiseaseLibrary from '@/Components/Diseases/DiseaseLibrary';
import MedicalDisclaimer from '@/Components/Diseases/MedicalDisclaimer';
import { Head, Link } from '@inertiajs/react';

export default function Library({ auth }) {
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/v1/diseases/catalog?per_page=100')
            .then(res => {
                setDiseases(res.data.data.data); // data.data because paginated
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading diseases", err);
                setLoading(false);
            });
    }, []);

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Catalogue des Affections</h2>}
        >
            <Head title="Catalogue Médical" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="mb-4">
                        <Link href="/diseases" className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium bg-white w-max px-4 py-2 rounded-lg shadow-sm border border-indigo-50 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Retour à l'accueil médical
                        </Link>
                    </div>

                    <MedicalDisclaimer />
                    
                    {loading ? (
                        <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-50">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500 font-medium">Chargement du catalogue...</p>
                        </div>
                    ) : (
                        <DiseaseLibrary diseases={diseases} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
