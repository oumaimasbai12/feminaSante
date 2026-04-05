import React from 'react';

export default function CycleCalendar({ events = [] }) {
    // Scaffold UI for the calendar
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Calendrier Menstruel</h3>
                <div className="flex gap-2">
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">&larr;</button>
                    <span className="py-2 px-4 font-semibold text-gray-700">Avril 2026</span>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">&rarr;</button>
                </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-semibold text-gray-500">
                <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {/* Mockup days */}
                {[...Array(30)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`aspect-square flex flex-col items-center justify-center rounded-xl p-1 cursor-pointer transition ${
                            i >= 12 && i <= 16 ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200' : 'hover:bg-gray-50 text-gray-700 border border-transparent hover:border-gray-200'
                        }`}
                    >
                        <span>{i + 1}</span>
                        {(i >= 12 && i <= 16) && <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1"></div>}
                        {i === 24 && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1"></div>}
                    </div>
                ))}
            </div>
            <div className="mt-6 flex gap-4 text-sm justify-center">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> Règles</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-400 rounded-full"></div> Ovulation (prévue)</div>
            </div>
        </div>
    );
}
