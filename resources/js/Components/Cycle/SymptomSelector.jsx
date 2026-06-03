import React from 'react';

export default function SymptomSelector() {
 const symptoms = ['Crampes', 'Maux de tête', 'Acné', 'Seins douloureux', 'Fatigue', 'Ballonnements'];

 return (
 <div className="glass-panel p-6 h-full">
 <h3 className="text-lg font-bold text-brand-ink mb-6">Symptômes Fréquents</h3>
 <div className="flex flex-wrap gap-2">
 {symptoms.map((s, i) => (
 <button key={i} className="px-4 py-2 rounded-full border border-brand-border text-sm font-medium text-brand-muted hover:border-brand-primary hover:bg-brand-soft hover:text-brand-primary transition">
 + {s}
 </button>
 ))}
 </div>
 <p className="text-sm text-brand-muted mt-6 pt-4 border-t border-brand-border">Cochez les symptômes que vous ressentez pour améliorer vos prédictions.</p>
 </div>
 );
}
