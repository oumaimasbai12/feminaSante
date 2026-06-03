import React from 'react';

export default function CycleStats() {
 return (
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
 <div className="glass-panel p-4 text-center">
 <span className="block text-sm text-brand-muted font-medium mb-1">Durée Moyenne</span>
 <span className="text-2xl font-black text-brand-ink">28 <span className="text-sm font-medium">jours</span></span>
 </div>
 <div className="glass-panel p-4 text-center">
 <span className="block text-sm text-brand-muted font-medium mb-1">Variation</span>
 <span className="text-2xl font-black text-brand-ink">±2 <span className="text-sm font-medium">jours</span></span>
 </div>
 <div className="glass-panel p-4 text-center">
 <span className="block text-sm text-brand-muted font-medium mb-1">Jours de Règles</span>
 <span className="text-2xl font-black text-brand-ink">5 <span className="text-sm font-medium">jours</span></span>
 </div>
 <div className="glass-panel p-4 text-center">
 <span className="block text-sm text-brand-muted font-medium mb-1">Phase Luthéale</span>
 <span className="text-2xl font-black text-brand-ink">14 <span className="text-sm font-medium">jours</span></span>
 </div>
 </div>
 );
}
