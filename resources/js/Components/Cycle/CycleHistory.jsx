import React from 'react';
import { Link } from '@inertiajs/react';

export default function CycleHistory() {
 const pastCycles = [
 { id: 1, start: '10 Mars 2026', end: '14 Mars 2026', length: 28, symptoms: ['Crampes', 'Fatigue'] },
 { id: 2, start: '10 Février 2026', end: '15 Février 2026', length: 27, symptoms: ['Maux de tête'] },
 { id: 3, start: '14 Janvier 2026', end: '19 Janvier 2026', length: 29, symptoms: [] },
 ];

 return (
 <div className="glass-panel p-6">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-lg font-bold text-brand-ink">Historique Récent</h3>
 <Link href="/cycle/history" className="text-brand-primary font-medium text-sm hover:text-brand-primary">Voir tout &rarr;</Link>
 </div>
 <div className="space-y-4">
 {pastCycles.map(cycle => (
 <div key={cycle.id} className="p-4 rounded-xl border border-brand-border flex items-center justify-between hover:bg-brand-soft/60 transition">
 <div>
 <p className="font-bold text-brand-ink">{cycle.start} - {cycle.end}</p>
 <p className="text-sm text-brand-muted mt-1">
 {cycle.symptoms.length > 0 ? cycle.symptoms.join(', ') :"Aucun symptôme noté"}
 </p>
 </div>
 <div className="text-right">
 <span className="block text-xl font-black text-brand-primary">{cycle.length}</span>
 <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">jours</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}
