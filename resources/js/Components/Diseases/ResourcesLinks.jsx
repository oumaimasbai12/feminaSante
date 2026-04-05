import React from 'react';

export default function ResourcesLinks({ resources }) {
    if (!resources || resources.length === 0) return null;

    return (
        <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                Organismes et Ressources Utiles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, i) => (
                    <a key={i} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-start p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-3 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700">{resource.nom}</h4>
                            {resource.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{resource.description}</p>}
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
