import React, { useState } from 'react';
import DiseaseCard from './DiseaseCard';

export default function DiseaseLibrary({ diseases = [] }) {
    const [search, setSearch] = useState('');

    const filteredDiseases = diseases.filter(d => 
        d.nom.toLowerCase().includes(search.toLowerCase()) || 
        d.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="disease-library">
            <div className="mb-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Rechercher une affection (ex: Endométriose, SOPK)..."
                        className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-lg transition-shadow"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <p className="text-sm text-gray-500 mt-2 px-2">Trouvez des informations médicales fiables validées par des professionnels.</p>
            </div>
            
            {filteredDiseases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDiseases.map(disease => (
                        <DiseaseCard
                            key={disease.id}
                            disease={disease}
                            onClick={(d) => {
                                window.location.href = `/diseases/${d.slug}`;
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
                    <p className="text-gray-500">Aucune information trouvée pour "{search}". Essayez de modifier vos termes de recherche.</p>
                </div>
            )}
        </div>
    );
}
