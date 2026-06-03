import React, { useState } from 'react';

export default function KickCounter() {
 const [kicks, setKicks] = useState(0);

 return (
 <div className="bg-brand-soft p-6 rounded-3xl border border-brand-border text-center animate-in fade-in h-full flex flex-col justify-center">
 <h3 className="text-xl font-bold text-brand-ink mb-2">Compteur de Mouvements</h3>
 <p className="text-sm text-brand-muted mb-6">Suivez l'activité de votre bébé au quotidien.</p>
 
 <div className="flex flex-col items-center justify-center mb-6">
 <span className="text-6xl font-black text-brand-primary mb-4">{kicks}</span>
 <button 
 onClick={() => setKicks(k + 1)}
 className="w-24 h-24 bg-brand-soft0 hover:bg-brand-primary text-white rounded-full flex items-center justify-center transition-transform active:scale-95"
 >
 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
 </button>
 </div>
 
 <button 
 onClick={() => setKicks(0)}
 className="text-brand-primary font-semibold text-sm hover:underline"
 >
 Réinitialiser la session
 </button>
 </div>
 );
}
