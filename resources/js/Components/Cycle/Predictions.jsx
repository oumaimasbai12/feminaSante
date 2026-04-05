import React from 'react';

export default function Predictions() {
    return (
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-6 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden group h-full">
            <div className="absolute -right-10 -top-10 opacity-30 group-hover:scale-110 transition-transform duration-700">
                <svg className="w-48 h-48 text-rose-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
            </div>
            
            <div className="relative z-10">
                <h3 className="text-xl font-bold text-rose-900 mb-6">Prédictions</h3>
                
                <div className="space-y-6">
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40">
                        <p className="text-rose-800 font-semibold mb-1">Prochaines Règles</p>
                        <p className="text-3xl font-black text-rose-600">Dans 12 jours</p>
                        <p className="text-sm text-rose-900/60 mt-1">Prévues pour le 16 Avril</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40">
                        <p className="text-indigo-800 font-semibold mb-1">Fenêtre de Fertilité</p>
                        <p className="text-xl font-bold text-indigo-600">En cours</p>
                        <p className="text-sm text-indigo-900/60 mt-1">Forte probabilité aujourd'hui</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
