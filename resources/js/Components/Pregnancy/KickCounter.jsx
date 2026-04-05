import React, { useState } from 'react';

export default function KickCounter() {
    const [kicks, setKicks] = useState(0);

    return (
        <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 text-center animate-in fade-in h-full flex flex-col justify-center">
            <h3 className="text-xl font-bold text-pink-900 mb-2">Compteur de Mouvements</h3>
            <p className="text-sm text-pink-800/70 mb-6">Suivez l'activité de votre bébé au quotidien.</p>
            
            <div className="flex flex-col items-center justify-center mb-6">
                <span className="text-6xl font-black text-pink-600 mb-4">{kicks}</span>
                <button 
                    onClick={() => setKicks(k + 1)}
                    className="w-24 h-24 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-lg"
                >
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
            </div>
            
            <button 
                onClick={() => setKicks(0)}
                className="text-pink-600 font-semibold text-sm hover:underline"
            >
                Réinitialiser la session
            </button>
        </div>
    );
}
