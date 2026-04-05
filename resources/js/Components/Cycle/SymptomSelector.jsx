import React from 'react';

export default function SymptomSelector() {
    const symptoms = ['Crampes', 'Maux de tête', 'Acné', 'Seins douloureux', 'Fatigue', 'Ballonnements'];

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Symptômes Fréquents</h3>
            <div className="flex flex-wrap gap-2">
                {symptoms.map((s, i) => (
                    <button key={i} className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700 transition">
                        + {s}
                    </button>
                ))}
            </div>
            <p className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-50">Cochez les symptômes que vous ressentez pour améliorer vos prédictions.</p>
        </div>
    );
}
