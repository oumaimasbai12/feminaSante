import React from 'react';

export default function GynecologistSearch() {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Trouver un Gynécologue</h2>
            <div className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1">
                    <input type="text" placeholder="Spécialité (ex: Obstétrique)" className="w-full rounded-xl border-gray-300 focus:ring-rose-500 focus:border-rose-500 bg-gray-50" />
                </div>
                <div className="flex-1">
                    <input type="text" placeholder="Ville ou Code Postal" className="w-full rounded-xl border-gray-300 focus:ring-rose-500 focus:border-rose-500 bg-gray-50" />
                </div>
                <button className="px-6 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition">
                    Rechercher
                </button>
            </div>
        </div>
    );
}
