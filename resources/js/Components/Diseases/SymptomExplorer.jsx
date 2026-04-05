import React from 'react';

export default function SymptomExplorer() {
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl border border-blue-100 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <svg className="w-48 h-48 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd"></path></svg>
            </div>
            
            <div className="relative z-10">
                <h3 className="text-2xl font-bold text-indigo-900 mb-3 tracking-tight">Explorez par Symptôme</h3>
                <p className="text-indigo-800/80 mb-6 text-lg max-w-md mx-auto">Êtes-vous gênée par un symptôme précis ? Naviguez dans notre base de connaissances pour en comprendre les causes.</p>
                <a href="#symptom-checker" className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all">
                    Démarrer l'exploration
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </a>
            </div>
        </div>
    );
}
