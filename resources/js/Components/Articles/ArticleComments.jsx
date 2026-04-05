import React, { useState } from 'react';

export default function ArticleComments() {
    const [comment, setComment] = useState("");

    return (
        <div className="max-w-4xl mx-auto mt-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Commentaires (2)</h3>
            
            <div className="flex gap-4 mb-10">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-indigo-700">VO</div>
                <div className="flex-grow">
                    <textarea 
                        className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 mb-2 resize-none" 
                        rows="3" 
                        placeholder="Partagez votre avis ou votre expérience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end">
                        <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">Publier</button>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="border-b border-gray-100 pb-6 flex gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-gray-900">Sophie</span>
                            <span className="text-xs text-gray-500">Il y a 2h</span>
                        </div>
                        <p className="text-gray-700">Article très intéressant, merci pour ces conseils !</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
