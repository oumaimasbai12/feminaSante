import React from 'react';
import QuizCard from './QuizCard';

export default function QuizList() {
    const list = [
        { title: "Mythes et Réalités : Contraception", questionsCount: 10, difficulty: "facile", color: "pink" },
        { title: "SOPK : Vrai ou Faux ?", questionsCount: 8, difficulty: "moyen", color: "indigo" },
        { title: "Suivi de fertilité", questionsCount: 12, difficulty: "difficile", color: "orange" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((q, i) => (
                <QuizCard key={i} {...q} />
            ))}
        </div>
    );
}
