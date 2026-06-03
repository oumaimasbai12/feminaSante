import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import DiseaseLibrary from '@/Components/Diseases/DiseaseLibrary';
import MedicalDisclaimer from '@/Components/Diseases/MedicalDisclaimer';
import { Head, Link } from '@inertiajs/react';

export default function Library() {
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
 <AppLayout title="Catalogue médical">
 <Head title="Catalogue Médical" />

 <div className="py-8">
 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
 <div className="mb-4">
 <Link href="/diseases" className="text-brand-primary hover:text-brand-ink flex items-center font-medium glass-panel w-max px-4 py-2 rounded-xl border border-brand-border transition-colors">
 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
 Retour à l'accueil médical
 </Link>
 </div>

 <MedicalDisclaimer />
 
 {loading ? (
 <div className="text-center py-32 glass-panel border border-brand-border">
 <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-primary mx-auto"></div>
 <p className="mt-4 text-brand-muted font-medium">Chargement du catalogue...</p>
 </div>
 ) : (
 <DiseaseLibrary diseases={diseases} />
 )}
 </div>
 </div>
 </AppLayout>
 );
}
