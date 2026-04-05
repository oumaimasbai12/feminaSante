import React from 'react';

export default function QuizExplanations() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explications Détaillées</h2>
            
            <div className="bg-white p-6 rounded-2xl border-2 border-green-200">
                <p className="font-bold text-gray-800 mb-2">1. Est-il vrai que la pilule contraceptive rend stérile à long terme ?</p>
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded">Faux</span>
                    <span className="text-sm text-gray-500 font-medium">Votre réponse : Faux (Correct)</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                    La pilule contraceptive ne rend pas stérile. Une fois arrêtée, les cycles naturels et l'ovulation reprennent. Chez certaines femmes, cela peut prendre quelques mois, mais cela ne cause pas d'infertilité définitive.
                </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border-2 border-red-200">
                <p className="font-bold text-gray-800 mb-2">2. Les règles douloureuses (dysménorrhée) sont toujours normales.</p>
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded">Faux</span>
                    <span className="text-sm text-gray-500 font-medium">Votre réponse : Vrai (Incorrect)</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                    Des douleurs intenses qui empêchent les activités quotidiennes ou qui ne sont pas soulagées par des antalgiques simples ne sont pas normales. Elles peuvent être le signe d'une endométriose et nécessitent un avis médical.
                </p>
            </div>
        </div>
    );
}
