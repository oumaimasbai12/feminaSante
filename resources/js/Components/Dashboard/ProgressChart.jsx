import React from 'react';

export default function ProgressChart() {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-2">Aperçu du Cycle</h3>
            <div className="flex-grow flex items-center justify-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <div className="text-center p-6">
                    <svg className="w-16 h-16 text-indigo-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">Les données de chart apparaîtront ici quand vous aurez saisi un cycle complet.</p>
                </div>
            </div>
        </div>
    );
}
