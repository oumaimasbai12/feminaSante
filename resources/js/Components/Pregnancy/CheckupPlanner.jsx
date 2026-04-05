import React from 'react';

export default function CheckupPlanner() {
    const checkups = [
        { title: "1ère Échographie (T1)", period: "11 - 13 SA", status: "completed", date: "10 Janvier 2026" },
        { title: "Consultation 4ème mois", period: "16 - 19 SA", status: "completed", date: "10 Février 2026" },
        { title: "2ème Échographie (T2)", period: "20 - 24 SA", status: "upcoming", date: "15 Avril 2026" },
        { title: "Consultation 6ème mois", period: "24 - 28 SA", status: "pending", date: "Non programmé" }
    ];

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Agenda Médical</h3>
                <button className="text-indigo-600 font-medium text-sm hover:underline">+ Nouveau rdv</button>
            </div>
            
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-4">
                {checkups.map((checkup, i) => (
                    <div key={i} className="relative pl-6">
                        <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white ${checkup.status === 'completed' ? 'bg-green-500' : checkup.status === 'upcoming' ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        <div>
                            <h4 className={`font-bold ${checkup.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{checkup.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{checkup.period} • {checkup.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
