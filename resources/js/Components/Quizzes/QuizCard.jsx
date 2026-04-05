import React from 'react';

const ICON_THEME = {
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    purple: 'bg-purple-100 text-purple-600',
    rose: 'bg-rose-100 text-rose-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
};

export default function QuizCard({ title, questionsCount, difficulty, color = 'blue' }) {
    const iconClass = ICON_THEME[color] || ICON_THEME.blue;

    return (
        <div className="bg-white p-6 justify-between flex flex-col rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div>
                <div className={`w-12 h-12 ${iconClass} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
                    🎯
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <div className="flex gap-3 text-sm text-gray-500 font-medium">
                    <span>{questionsCount} Questions</span>
                    <span>•</span>
                    <span className="capitalize text-gray-700">{difficulty}</span>
                </div>
            </div>
            <button
                type="button"
                className="mt-6 w-full py-3 bg-gray-50 text-gray-900 rounded-xl font-bold hover:bg-gray-100 border border-gray-200"
            >
                Démarrer
            </button>
        </div>
    );
}
