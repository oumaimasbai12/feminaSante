import React from 'react';

export default function SuggestedQuestions({ onSelect }) {
    const questions = [
        "Quels sont les symptômes fréquents de l'endométriose ?",
        "Comment calculer ma période d'ovulation ?",
        "Que faire en cas de règles très douloureuses ?"
    ];

    return (
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
            {questions.map((q, i) => (
                <button 
                    key={i}
                    onClick={() => onSelect && onSelect(q)}
                    className="whitespace-nowrap px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100 hover:bg-indigo-100 transition"
                >
                    {q}
                </button>
            ))}
        </div>
    );
}
