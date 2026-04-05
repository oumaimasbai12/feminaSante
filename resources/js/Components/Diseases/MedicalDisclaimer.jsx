import React from 'react';

export default function MedicalDisclaimer() {
    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4 shadow-sm" role="alert">
            <p className="font-bold flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                Avertissement Médical Important
            </p>
            <p className="text-sm mt-2">Ces informations sont fournies à titre purement éducatif et pédagogique. Elles ne constituent ni un diagnostic médical, ni une ordonnance, et ne remplacent en aucun cas l'avis d'un professionnel de santé diplômé d'État. Ne vous fiez pas à ces données pour l'autodiagnostic ou l'automédication. En cas d'urgence, de gêne intense, contactez les services d'urgence ou rendez-vous aux urgences gynécologiques les plus proches.</p>
        </div>
    );
}
