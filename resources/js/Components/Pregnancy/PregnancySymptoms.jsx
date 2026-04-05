import React from 'react';

export default function PregnancySymptoms() {
    const list = [
        { name: 'Nausées', level: 'Faible', date: 'Aujourd\'hui' },
        { name: 'Fatigue', level: 'Élevé', date: 'Hier' }
    ];

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Derniers Symptômes</h3>
                <button className="text-indigo-600 font-medium text-sm hover:underline">Saisir</button>
            </div>
            <div className="space-y-3">
                {list.map((s, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-gray-50 bg-gray-50">
                        <div>
                            <p className="font-semibold text-gray-800">{s.name}</p>
                            <p className="text-xs text-gray-500">{s.date}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${s.level === 'Élevé' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {s.level}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
