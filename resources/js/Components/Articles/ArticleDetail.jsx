import React from 'react';

export default function ArticleDetail({ title, content, author, date, readTime }) {
    return (
        <article className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">{title}</h1>
                <div className="flex items-center gap-4 text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full"></div>
                        <span className="text-gray-900 font-bold">{author}</span>
                    </div>
                    <span>•</span>
                    <span>{date}</span>
                    <span>•</span>
                    <span>Lecture : {readTime} min</span>
                </div>
            </div>
            
            <div className="w-full h-64 md:h-96 bg-gray-100 rounded-2xl mb-10 overflow-hidden">
                {/* Image placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-rose-50 border border-gray-200"></div>
            </div>

            <div className="prose prose-lg prose-indigo max-w-none text-gray-700 leading-relaxed">
                {content || <p>Ceci est un paragraphe d'exemple généré automatiquement. Le contenu de l'article sera injecté ici depuis la base de données. Il peut contenir des listes, des titres de section, et du texte formaté.</p>}
            </div>
        </article>
    );
}
