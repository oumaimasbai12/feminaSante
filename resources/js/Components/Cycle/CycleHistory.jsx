import React from 'react';
import { Link } from '@inertiajs/react';

export default function CycleHistory() {
    const pastCycles = [
        { id: 1, start: '10 Mars 2026', end: '14 Mars 2026', length: 28, symptoms: ['Crampes', 'Fatigue'] },
        { id: 2, start: '10 Février 2026', end: '15 Février 2026', length: 27, symptoms: ['Maux de tête'] },
        { id: 3, start: '14 Janvier 2026', end: '19 Janvier 2026', length: 29, symptoms: [] },
    ];

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Historique Récent</h3>
                <Link href="/cycle/history" className="text-rose-600 font-medium text-sm hover:text-rose-800">Voir tout &rarr;</Link>
            </div>
            <div className="space-y-4">
                {pastCycles.map(cycle => (
                    <div key={cycle.id} className="p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition">
                        <div>
                            <p className="font-bold text-gray-800">{cycle.start} - {cycle.end}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {cycle.symptoms.length > 0 ? cycle.symptoms.join(', ') : "Aucun symptôme noté"}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="block text-xl font-black text-rose-600">{cycle.length}</span>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">jours</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
