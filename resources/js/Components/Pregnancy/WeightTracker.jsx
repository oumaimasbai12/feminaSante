import React from 'react';

export default function WeightTracker() {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Suivi du Poids</h3>
                <button className="text-indigo-600 font-medium text-sm hover:underline">+ Ajouter</button>
            </div>
            <div className="h-40 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center mb-4">
                <span className="text-gray-400 font-medium">Graphique d'évolution (Chart.js ou Recharts)</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Poids initial: <strong className="text-gray-900">60 kg</strong></span>
                <span className="text-gray-500">Actuel: <strong className="text-gray-900">66.5 kg</strong></span>
            </div>
        </div>
    );
}
