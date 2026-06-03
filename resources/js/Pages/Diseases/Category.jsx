import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import DiseaseLibrary from '@/Components/Diseases/DiseaseLibrary';
import MedicalDisclaimer from '@/Components/Diseases/MedicalDisclaimer';
import { Head, Link } from '@inertiajs/react';

const CATEGORY_HERO_STYLES = {
 blue: {
 panel: 'mb-8 p-8 md:p-10 bg-brand-soft/60 rounded-3xl border border-brand-border',
 iconBox: 'w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-brand-soft text-brand-primary ',
 title: 'text-4xl font-extrabold text-brand-ink mb-4',
 desc: 'text-xl text-brand-muted leading-relaxed max-w-3xl',
 },
 green: {
 panel: 'mb-8 p-8 md:p-10 bg-green-50 rounded-3xl border border-green-100',
 iconBox: 'w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-green-200 text-green-700 ',
 title: 'text-4xl font-extrabold text-green-900 mb-4',
 desc: 'text-xl text-green-800/80 leading-relaxed max-w-3xl',
 },
 red: {
 panel: 'mb-8 p-8 md:p-10 bg-red-50 rounded-3xl border border-red-100',
 iconBox: 'w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-red-200 text-red-700 ',
 title: 'text-4xl font-extrabold text-red-900 mb-4',
 desc: 'text-xl text-red-800/80 leading-relaxed max-w-3xl',
 },
 purple: {
 panel: 'mb-8 p-8 md:p-10 bg-brand-soft/60 rounded-3xl border border-brand-border',
 iconBox: 'w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-brand-soft text-brand-primary ',
 title: 'text-4xl font-extrabold text-brand-ink mb-4',
 desc: 'text-xl text-brand-muted leading-relaxed max-w-3xl',
 },
 orange: {
 panel: 'mb-8 p-8 md:p-10 bg-orange-50 rounded-3xl border border-orange-100',
 iconBox: 'w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-orange-200 text-orange-700 ',
 title: 'text-4xl font-extrabold text-orange-900 mb-4',
 desc: 'text-xl text-orange-800/80 leading-relaxed max-w-3xl',
 },
 pink: {
 panel: 'mb-8 p-8 md:p-10 bg-brand-soft rounded-3xl border border-brand-border',
 iconBox: 'w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-brand-soft text-brand-ink ',
 title: 'text-4xl font-extrabold text-brand-ink mb-4',
 desc: 'text-xl text-brand-muted leading-relaxed max-w-3xl',
 },
 indigo: {
 panel: 'mb-8 p-8 md:p-10 bg-brand-soft/60 rounded-3xl border border-brand-border',
 iconBox: 'w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-brand-soft text-brand-primary ',
 title: 'text-4xl font-extrabold text-brand-ink mb-4',
 desc: 'text-xl text-brand-muted leading-relaxed max-w-3xl',
 },
};

function heroStylesFor(color) {
 const key = color && CATEGORY_HERO_STYLES[color] ? color : 'indigo';
 return CATEGORY_HERO_STYLES[key];
}

export default function Category({ categorySlug }) {
 const slug = categorySlug || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '');
 
 const [category, setCategory] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (!slug) return;
 axios.get(`/api/v1/diseases/categories/${slug}`)
 .then(res => {
 setCategory(res.data.data);
 setLoading(false);
 })
 .catch(err => {
 console.error("Error loading category", err);
 setLoading(false);
 });
 }, [slug]);

 return (
 <AppLayout title="Catégorie">
 <Head title={category ? category.nom : 'Catégorie'} />

 <div className="py-8">
 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
 <div className="mb-4">
 <Link href="/diseases" className="text-brand-primary hover:text-brand-ink flex items-center font-medium glass-panel w-max px-4 py-2 rounded-xl border border-brand-border transition-colors">
 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
 Retour aux catégories
 </Link>
 </div>

 <MedicalDisclaimer />
 
 {loading ? (
 <div className="text-center py-32 glass-panel border border-brand-border">
 <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-primary mx-auto"></div>
 <p className="mt-4 text-brand-muted font-medium">Chargement de la catégorie...</p>
 </div>
 ) : category ? (
 <div>
 {(() => {
 const hs = heroStylesFor(category.color);
 return (
 <div className={hs.panel}>
 <div className={hs.iconBox}>
 {category.icon ? (
 <span className="text-3xl" role="img">
 {category.icon}
 </span>
 ) : (
 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth="2"
 d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
 />
 </svg>
 )}
 </div>
 <h1 className={hs.title}>{category.nom}</h1>
 <p className={hs.desc}>{category.description}</p>
 </div>
 );
 })()}
 <h3 className="text-2xl font-bold text-brand-ink mb-8 pl-2">Affections ({category.diseases?.length || 0})</h3>
 <DiseaseLibrary diseases={category.diseases || []} />
 </div>
 ) : (
 <div className="text-center py-20 text-brand-muted glass-panel">Catégorie introuvable.</div>
 )}
 </div>
 </div>
 </AppLayout>
 );
}
