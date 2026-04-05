import React from 'react';

export default function PregnancyDashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
                <div>
                    <p className="text-indigo-100 font-medium mb-1">Semaine Actuelle</p>
                    <p className="text-4xl font-extrabold">24<span className="text-xl font-medium"> SA</span></p>
                    <p className="text-sm mt-2 opacity-80">2ème Trimestre</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                    👶
                </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 font-medium mb-1">Prochain Examen</p>
                    <p className="text-2xl font-bold text-gray-900">Écho T3</p>
                    <p className="text-sm text-indigo-600 font-semibold mt-1">Le 15 Mai 2026</p>
                </div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 font-medium mb-1">Prise de Poids</p>
                    <p className="text-2xl font-bold text-gray-900">+ 6.5 <span className="text-lg">kg</span></p>
                    <p className="text-sm text-green-600 font-semibold mt-1">Évolution normale</p>
                </div>
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl">
                    ⚖️
                </div>
            </div>
        </div>
    );
}
