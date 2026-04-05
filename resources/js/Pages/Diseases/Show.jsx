import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Components/Layouts/AuthenticatedLayout';
import DiseaseDetail from '@/Components/Diseases/DiseaseDetail';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, diseaseSlug }) {
    const slug = diseaseSlug || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '');
    const [disease, setDisease] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        axios.get(`/api/v1/diseases/catalog/${slug}`)
            .then(res => {
                setDisease(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading disease details", err);
                setLoading(false);
            });
    }, [slug]);

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Détails de l'affection</h2>}
        >
            <Head title={disease ? disease.nom : 'Détails'} />

            <div className="py-8">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="mb-4">
                        <Link href="/diseases/library" className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium transition-colors bg-white w-max px-4 py-2 rounded-lg shadow-sm border border-indigo-50">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Retour au catalogue
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-50">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500 font-medium">Récupération des informations médicales...</p>
                        </div>
                    ) : disease ? (
                        <DiseaseDetail disease={disease} />
                    ) : (
                        <div className="text-center py-20 text-gray-500 bg-white rounded-3xl shadow-sm border border-gray-50">
                            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="block text-lg">Affection introuvable dans la base de données éducative.</span>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
