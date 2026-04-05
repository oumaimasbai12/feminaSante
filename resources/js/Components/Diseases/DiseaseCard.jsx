import React from 'react';

export default function DiseaseCard({ disease, onClick }) {
    return (
        <div 
            onClick={() => onClick(disease)}
            className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 flex flex-col h-full hover:-translate-y-1"
        >
            <div className="flex flex-col mb-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{disease.nom}</h3>
                </div>
                {disease.category && (
                    <span className="self-start px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {disease.category.nom}
                    </span>
                )}
            </div>
            
            <p className="text-sm text-gray-600 flex-grow mb-6 line-clamp-3 leading-relaxed">
                {disease.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto border-t pt-4">
                <span className="text-indigo-600 text-sm font-semibold group flex items-center gap-1 hover:text-indigo-800 transition-colors">
                    En savoir plus 
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                {disease.is_chronic && (
                    <span className="text-xs text-red-500 font-medium">Chronique</span>
                )}
            </div>
        </div>
    );
}
