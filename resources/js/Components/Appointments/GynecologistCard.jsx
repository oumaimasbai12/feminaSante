import React from 'react';

export default function GynecologistCard({ name, specialty, address, nextAvailable }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex-shrink-0"></div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Dr. {name}</h3>
                    <p className="text-rose-600 font-medium text-sm">{specialty}</p>
                    <p className="text-gray-500 text-sm mt-1">{address}</p>
                </div>
            </div>
            {nextAvailable && (
                <div className="mt-auto pt-4 border-t border-gray-50">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Prochaine dispo</p>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-md border border-green-100">{nextAvailable}</span>
                    </div>
                </div>
            )}
            <button className="w-full mt-4 py-2 border border-rose-200 text-rose-700 bg-rose-50 rounded-xl font-bold hover:bg-rose-100 transition">
                Prendre RDV
            </button>
        </div>
    );
}
