import React from 'react';
import MedicalDisclaimer from './MedicalDisclaimer';
import PreventionTips from './PreventionTips';
import WhenToSeeDoctor from './WhenToSeeDoctor';
import ResourcesLinks from './ResourcesLinks';
import FAQSection from './FAQSection';

export default function DiseaseDetail({ disease }) {
    if (!disease) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <MedicalDisclaimer />
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-gray-100">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{disease.nom}</h1>
                                {disease.scientific_nom && (
                                    <p className="text-xl text-indigo-800 italic mb-4 opacity-90">{disease.scientific_nom}</p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {disease.category && (
                                        <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800 shadow-sm">
                                            {disease.category.nom}
                                        </span>
                                    )}
                                    {disease.is_chronic && (
                                        <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-800 shadow-sm flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-red-600 mr-2"></span> Affection Chronique
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-8">
                    <div className="prose prose-lg prose-indigo max-w-none text-gray-700">
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Qu'est-ce que c'est ?
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg">{disease.description}</p>
                        </section>
                        
                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            <section className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                                <h2 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    Causes & Origines
                                </h2>
                                <p className="text-orange-900/80 leading-relaxed">{disease.causes}</p>
                            </section>

                            {disease.common_symptoms && disease.common_symptoms.length > 0 && (
                                <section className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
                                    <h2 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                        Symptômes Fréquents
                                    </h2>
                                    <ul className="list-disc pl-5 space-y-2 text-rose-900/80">
                                        {disease.common_symptoms.map((symp, i) => <li key={i}>{symp}</li>)}
                                    </ul>
                                </section>
                            )}
                        </div>
                        
                        {disease.treatment_overview && (
                            <section className="mb-10 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                    Approches Thérapeutiques
                                </h2>
                                <p className="text-emerald-900/80 leading-relaxed">{disease.treatment_overview}</p>
                            </section>
                        )}
                        
                        <PreventionTips tips={disease.prevention_tips} />
                        <WhenToSeeDoctor content={disease.when_to_see_doctor} />
                        <FAQSection faqs={disease.faqs} />
                        <ResourcesLinks resources={disease.resources} />
                    </div>
                </div>
            </div>
        </div>
    );
}
