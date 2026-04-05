import React from 'react';

export default function WeekByWeek({ currentWeek = 24 }) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Mon Bébé (S {currentWeek})</h3>
            
            <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center text-6xl shadow-inner mb-4">
                    🌽
                </div>
                <p className="text-gray-500 font-medium">Bébé a la taille d'un <span className="font-bold text-gray-800">Épi de maïs</span></p>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-purple-900">Développement</h4>
                    <p className="text-sm text-gray-600 mt-1">À 24 semaines, les poumons de bébé continuent leur maturation et il réagit de plus en plus aux sons extérieurs. Ses empreintes digitales sont formées.</p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-bold text-purple-900">Pour vous</h4>
                    <p className="text-sm text-gray-600 mt-1">Votre utérus dépasse maintenant votre nombril. Vous pourriez ressentir des brûlures d'estomac plus fréquentes.</p>
                </div>
            </div>
            
            <div className="mt-8">
                <button className="w-full py-3 border border-purple-200 text-purple-700 bg-purple-50 rounded-xl font-semibold hover:bg-purple-100 transition">
                    Lire le détail de la semaine
                </button>
            </div>
        </div>
    );
}
