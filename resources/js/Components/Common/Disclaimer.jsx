import React from 'react';

export default function Disclaimer({ message, className = '' }) {
    return (
        <div className={`bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm ${className}`}>
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm font-medium leading-relaxed">
                <span className="font-bold mr-1">Rappel important:</span>
                {message || "Cette section est fournie à titre purement informatif ou éducatif et ne remplace en aucun cas une consultation médicale avec un professionnel de santé certifié."}
            </div>
        </div>
    );
}
