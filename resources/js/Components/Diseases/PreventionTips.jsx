import React from 'react';

export default function PreventionTips({ tips }) {
    if (!tips || tips.length === 0) return null;

    // Handle both array of strings and array of objects
    const renderTip = (tip, index) => {
        if (typeof tip === 'string') {
            return <li key={index} className="text-teal-900/80 leading-relaxed">{tip}</li>;
        }
        return (
            <li key={index} className="mb-3">
                <strong className="text-teal-900 block mb-1">{tip.title}</strong>
                <span className="text-teal-900/80">{tip.description}</span>
            </li>
        );
    };

    return (
        <section className="mb-10 p-6 bg-teal-50/50 rounded-2xl border border-teal-100">
            <h2 className="text-xl font-bold text-teal-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                Conseils de Prévention
            </h2>
            <ul className="list-disc pl-5 space-y-2">
                {Array.isArray(tips) ? tips.map(renderTip) : <li className="text-teal-900/80">{tips}</li>}
            </ul>
        </section>
    );
}
