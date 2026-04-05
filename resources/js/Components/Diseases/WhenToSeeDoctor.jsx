import React from 'react';

export default function WhenToSeeDoctor({ content }) {
    if (!content) return null;

    return (
        <section className="mb-10 p-6 bg-red-50/50 rounded-2xl border border-red-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10">
                <svg className="w-24 h-24 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2 relative z-10">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Quand Consulter un Médecin ?
            </h2>
            <p className="text-red-900/80 leading-relaxed font-medium relative z-10">{content}</p>
        </section>
    );
}
