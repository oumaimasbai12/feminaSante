import React from 'react';

export default function ArticleCategories({ categories = ['Cycle Menstruel', 'Maternité', 'Nutrition', 'Psychologie'] }) {
    return (
        <div className="bg-gray-50 p-6 rounded-3xl mb-8">
            <h3 className="font-bold text-gray-900 tracking-wider uppercase text-sm mb-4">Filtrer par Sujet</h3>
            <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-sm">Tous</button>
                {categories.map((c, i) => (
                    <button key={i} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition">
                        {c}
                    </button>
                ))}
            </div>
        </div>
    );
}
