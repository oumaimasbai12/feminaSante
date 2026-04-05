import React from 'react';

export default function AppointmentConfirmation() {
    return (
        <div className="bg-green-50 p-8 rounded-3xl border-2 border-green-200 text-center max-w-md mx-auto my-8 shadow-sm">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Rendez-vous Confirmé !</h2>
            <p className="text-green-800/80 mb-6 font-medium">Un email de confirmation vous a été envoyé. N'oubliez pas d'apporter votre carte vitale.</p>
            <button className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition">
                Retour à l'accueil
            </button>
        </div>
    );
}
