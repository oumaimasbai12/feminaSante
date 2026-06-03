import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import SymptomChecker from '@/Components/Diseases/SymptomChecker';
import { Head, Link } from '@inertiajs/react';

export default function SymptomCheckerPage() {
 return (
 <AppLayout title="Vérification des symptômes">
 <Head title="Vérificateur de symptômes" />

 <div className="py-8">
 <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
 <div className="mb-4">
 <Link
 href="/diseases"
 className="text-brand-primary hover:text-brand-ink flex items-center font-medium transition-colors glass-panel w-max px-4 py-2 rounded-xl border border-brand-border"
 >
 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
 </svg>
 Retour au centre de ressources
 </Link>
 </div>

 <SymptomChecker />
 </div>
 </div>
 </AppLayout>
 );
}
