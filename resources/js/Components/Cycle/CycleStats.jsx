import React from 'react';

export default function CycleStats() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="block text-sm text-gray-500 font-medium mb-1">Durée Moyenne</span>
                <span className="text-2xl font-black text-gray-900">28 <span className="text-sm font-medium">jours</span></span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="block text-sm text-gray-500 font-medium mb-1">Variation</span>
                <span className="text-2xl font-black text-gray-900">±2 <span className="text-sm font-medium">jours</span></span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="block text-sm text-gray-500 font-medium mb-1">Jours de Règles</span>
                <span className="text-2xl font-black text-gray-900">5 <span className="text-sm font-medium">jours</span></span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="block text-sm text-gray-500 font-medium mb-1">Phase Luthéale</span>
                <span className="text-2xl font-black text-gray-900">14 <span className="text-sm font-medium">jours</span></span>
            </div>
        </div>
    );
}
