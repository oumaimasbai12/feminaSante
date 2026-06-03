import React from 'react';

export default function QuizResults({ score = 8, total = 10 }) {
    const p = Math.round((score / total) * 100);
    return (
        <div className="glass-card max-w-lg mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-brand-ink mb-2">Quiz terminé !</h2>
            <p className="text-brand-muted mb-8">Bravo pour votre participation.</p>

            <div className={`w-32 h-32 mx-auto rounded-full flex flex-col items-center justify-center border-4 mb-6 ${p >= 70 ? 'border-green-400 text-green-600' : 'border-amber-400 text-amber-600'}`}>
                <span className="text-4xl font-black">{score}</span>
                <span className="text-sm font-bold uppercase tracking-wider">/ {total}</span>
            </div>

            <p className="text-lg font-medium text-brand-ink mb-8">
                {p >= 70 ? 'Superbe score, vous maîtrisez le sujet !' : 'Encore quelques points à revoir — consultez les explications.'}
            </p>

            <button type="button" className="w-full btn-primary">
                Voir les explications
            </button>
        </div>
    );
}
