import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import DiseaseDetail from '@/Components/Diseases/DiseaseDetail';
import { Head, Link } from '@inertiajs/react';

export default function Show({ diseaseSlug }) {
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
 <AppLayout title="Détails de l'affection">
 <Head title={disease ? disease.nom : 'Détails'} />

 <div className="py-8">
 <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
 <div className="mb-4">
 <Link href="/diseases/library" className="text-brand-primary hover:text-brand-ink flex items-center font-medium transition-colors glass-panel w-max px-4 py-2 rounded-xl border border-brand-border">
 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
 Retour au catalogue
 </Link>
 </div>
 
 {loading ? (
 <div className="text-center py-32 glass-panel border border-brand-border">
 <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-primary mx-auto"></div>
 <p className="mt-4 text-brand-muted font-medium">Récupération des informations médicales...</p>
 </div>
 ) : disease ? (
 <DiseaseDetail disease={disease} />
 ) : (
 <div className="text-center py-20 text-brand-muted glass-panel border border-brand-border">
 <svg className="mx-auto h-16 w-16 text-brand-muted/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <span className="block text-lg">Affection introuvable dans la base de données éducative.</span>
 </div>
 )}
 </div>
 </div>
 </AppLayout>
 );
}
