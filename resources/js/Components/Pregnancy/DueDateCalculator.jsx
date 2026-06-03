import React, { useState } from 'react';

export default function DueDateCalculator() {
 const [ddr, setDdr] = useState('');
 const [dpa, setDpa] = useState('');

 const calculateDPA = () => {
 if (!ddr) return;
 const date = new Date(ddr);
 // Regle de Naegele simple: DDR + 7 jours + 9 mois (ou - 3 mois)
 date.setDate(date.getDate() + 14 + 280 - 14); // simplification (280 jours)
 setDpa(date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
 };

 return (
 <div className="glass-panel p-8 border border-brand-border">
 <h3 className="text-xl font-bold text-brand-ink mb-6 flex items-center gap-2">
 <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
 Calculatrice de Terme
 </h3>
 
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-brand-muted mb-1">Date des dernières règles (DDR)</label>
 <input 
 type="date" 
 value={ddr}
 onChange={(e) => setDdr(e.target.value)}
 className="w-full rounded-xl border-brand-border focus:border-brand-primary focus:ring-brand-primary/400"
 />
 </div>
 <button 
 onClick={calculateDPA}
 className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-dark transition"
 >
 Calculer la DPA
 </button>

 {dpa && (
 <div className="mt-6 p-4 bg-brand-soft/60 rounded-xl border border-brand-border text-center animate-in fade-in zoom-in duration-300">
 <p className="text-sm font-semibold text-brand-muted mb-1">Date Prévue d'Accouchement :</p>
 <p className="text-lg font-bold text-brand-ink capitalize">{dpa}</p>
 </div>
 )}
 </div>
 </div>
 );
}
