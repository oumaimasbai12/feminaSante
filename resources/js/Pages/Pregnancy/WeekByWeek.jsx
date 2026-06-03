import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import WeekByWeek from '@/Components/Pregnancy/WeekByWeek';

export default function WeekByWeekPage() {
 return (
 <AppLayout title="Semaine par semaine">
 <Head title="Développement Grossesse - Femina Santé" />

 <div className="py-8">
 <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-8">
 <div className="mb-4">
 <Link href="/pregnancy" className="text-brand-primary hover:text-brand-ink flex items-center font-medium glass-panel w-max px-4 py-2 rounded-xl border border-brand-border transition-colors">
 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
 Retour au suivi grossesse
 </Link>
 </div>

 <div className="glass-panel p-10">
 <WeekByWeek currentWeek={24} />
 
 <div className="mt-10 pt-10 border-t border-brand-border">
 <h3 className="text-2xl font-bold text-brand-ink mb-6">Navigation Rapide</h3>
 <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3 text-center">
 {[...Array(40)].map((_, i) => (
 <button 
 key={i} 
 className={`py-2 rounded-lg font-bold text-sm ${i+1 === 24 ? 'bg-brand-primary text-white ' : 'bg-brand-soft/60 text-brand-muted hover:bg-brand-soft'}`}
 >
 {i+1}
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 </AppLayout>
 );
}
