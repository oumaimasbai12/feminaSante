import React from 'react';

export default function QuizResults({ score = 8, total = 10 }) {
    const p = Math.round((score / total) * 100);
    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Quiz Terminé !</h2>
            <p className="text-gray-500 mb-8">Bravo pour votre participation.</p>
            
            <div className={`w-32 h-32 mx-auto rounded-full flex flex-col items-center justify-center border-4 mb-6 ${p >= 70 ? 'border-green-400 text-green-600' : 'border-orange-400 text-orange-600'}`}>
                <span className="text-4xl font-black">{score}</span>
                <span className="text-sm font-bold uppercase tracking-wider">/ {total}</span>
            </div>

            <p className="text-lg font-medium text-gray-800 mb-8">
                {p >= 70 ? 'Superbe score, vous maîtrisez le sujet !' : 'Encore quelques petites choses à revoir, passez voir les explications.'}
            </p>

            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-sm transition">
                Voir les explications
            </button>
        </div>
    );
}
