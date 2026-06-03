import React from 'react';

export default function WeightTracker() {
 return (
 <div className="glass-panel p-6">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-lg font-bold text-brand-ink">Suivi du Poids</h3>
 <button className="text-brand-primary font-medium text-sm hover:underline">+ Ajouter</button>
 </div>
 <div className="h-40 bg-brand-soft/60 rounded-xl border border-dashed border-brand-border flex items-center justify-center mb-4">
 <span className="text-brand-muted font-medium">Graphique d'évolution (Chart.js ou Recharts)</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-brand-muted">Poids initial: <strong className="text-brand-ink">60 kg</strong></span>
 <span className="text-brand-muted">Actuel: <strong className="text-brand-ink">66.5 kg</strong></span>
 </div>
 </div>
 );
}
