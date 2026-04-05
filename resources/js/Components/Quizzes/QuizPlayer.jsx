import React, { useState } from 'react';

export default function QuizPlayer({ title }) {
    const [current, setCurrent] = useState(1);
    const total = 10;

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6 text-sm font-bold text-gray-500">
                <span>{title}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-indigo-600">{current} / {total}</span>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-8">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(current/total)*100}%` }}></div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
                Est-il vrai que la pilule contraceptive rend stérile à long terme ?
            </h2>

            <div className="space-y-4">
                <button className="w-full p-4 text-left border-2 border-gray-100 rounded-2xl hover:border-indigo-300 font-medium text-lg transition">Vrai</button>
                <button className="w-full p-4 text-left border-2 border-gray-100 rounded-2xl hover:border-indigo-300 font-medium text-lg transition">Faux</button>
            </div>
        </div>
    );
}
