import React, { useState } from 'react';

export default function ContractionTimer() {
 const [isTiming, setIsTiming] = useState(false);

 return (
 <div className="glass-panel p-6 h-full flex flex-col justify-center items-center text-center">
 <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
 </div>
 <h3 className="text-xl font-bold text-brand-ink mb-2">Chrono Contractions</h3>
 <p className="text-sm text-brand-muted mb-6">Mesurez la durée et la fréquence de vos contractions.</p>
 
 <button 
 onClick={() => setIsTiming(!isTiming)}
 className={`w-full py-4 rounded-xl font-bold text-white transition ${isTiming ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-brand-primary hover:bg-brand-dark'}`}
 >
 {isTiming ? 'Arrêter le chrono' : 'Démarrer le chrono'}
 </button>
 <a href="/pregnancy/tools" className="mt-4 text-sm font-semibold text-brand-primary hover:underline">Ouvrir l'outil complet &rarr;</a>
 </div>
 );
}
