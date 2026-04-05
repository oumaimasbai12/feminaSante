import React from 'react';

export default function AIDisclaimer() {
    return (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm mb-4 text-xs font-medium">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            <div>
                Cet assistant est basé sur l'Intelligence Artificielle. Ses réponses sont générées à titre purement éducatif et informatif. Elles ne constituent ni un avis médical ni un diagnostic.
            </div>
        </div>
    );
}
