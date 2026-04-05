import React from 'react';

export default function ArticleCard({ title, category, author, date, coverImage }) {
    return (
        <a href="#" className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition group flex flex-col h-full">
            <div className="h-48 bg-gray-200 relative overflow-hidden flex-shrink-0">
                {coverImage ? (
                    <img src={coverImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 border-b border-indigo-50"></div>
                )}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm">
                    {category}
                </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-indigo-600 transition line-clamp-2">
                    {title}
                </h3>
                <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-500 border-t border-gray-50">
                    <span className="font-medium">{author}</span>
                    <span>{date}</span>
                </div>
            </div>
        </a>
    );
}
