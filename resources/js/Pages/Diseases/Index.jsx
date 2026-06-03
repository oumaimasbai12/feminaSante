import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import DiseaseCategories from '@/Components/Diseases/DiseaseCategories';
import SymptomExplorer from '@/Components/Diseases/SymptomExplorer';
import MedicalDisclaimer from '@/Components/Diseases/MedicalDisclaimer';
import { Head, Link } from '@inertiajs/react';

export default function Index() {
 const [categories, setCategories] = useState([]);
 const [loadingCategories, setLoadingCategories] = useState(true);

 useEffect(() => {
 axios
 .get('/api/v1/diseases/categories')
 .then((res) => setCategories(res.data.data))
 .catch((err) => console.error('Error loading categories', err))
 .finally(() => setLoadingCategories(false));
 }, []);

 return (
 <AppLayout title="Centre de Ressources Médicales">
 <Head title="Maladies & Affections" />

 <div className="py-8">
 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-10">
 <MedicalDisclaimer />

 <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="flex justify-between items-end mb-6">
 <div>
 <h2 className="text-3xl font-extrabold text-brand-ink">Catégories d'affections</h2>
 <p className="text-brand-muted mt-2 text-lg">Parcourez nos fiches explicatives validées par des professionnels.</p>
 </div>
 <Link href="/diseases/library" className="hidden md:inline-flex text-brand-primary font-semibold hover:text-brand-ink items-center">
 Voir le catalogue complet <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
 </Link>
 </div>
 {loadingCategories ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 {[1, 2, 3, 4].map((i) => (
 <div
 key={i}
 className="h-40 rounded-2xl bg-brand-soft border border-brand-border animate-pulse"
 />
 ))}
 </div>
 ) : categories.length > 0 ? (
 <DiseaseCategories categories={categories} />
 ) : (
 <p className="text-brand-muted text-center py-8 glass-panel border border-brand-border">
 Impossible de charger les catégories pour le moment. Réessayez plus tard.
 </p>
 )}
 <div className="mt-4 text-center md:hidden">
 <Link href="/diseases/library" className="inline-flex text-brand-primary font-semibold hover:text-brand-ink items-center">
 Voir le catalogue complet <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
 </Link>
 </div>
 </section>

 <section className="glass-card p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
 <div>
 <h2 className="text-3xl font-extrabold text-brand-ink mb-4 tracking-tight">Outil de Vérification</h2>
 <p className="text-brand-muted mb-8 text-lg leading-relaxed">
 Un symptôme vous inquiète ? Utilisez notre outil de correspondances interactif pour découvrir quelles affections sont liées à vos inconforts (Outil à visée strictement éducative).
 </p>
 <Link href="/diseases/symptom-checker" className="btn-primary inline-block px-8 py-4">
 Tester vos symptômes maintenant
 </Link>
 </div>
 <div>
 <SymptomExplorer />
 </div>
 </section>
 </div>
 </div>
 </AppLayout>
 );
}
