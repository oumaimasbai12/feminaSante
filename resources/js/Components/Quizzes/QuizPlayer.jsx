import React, { useState } from 'react';

export default function QuizPlayer({ title }) {
    const [current, setCurrent] = useState(1);
    const total = 10;

    return (
        <div className="glass-card p-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6 text-sm font-bold text-brand-muted">
                <span>{title}</span>
                <span className="bg-brand-soft px-3 py-1 rounded-full text-brand-primary">{current} / {total}</span>
            </div>

            <div className="w-full bg-brand-soft rounded-full h-2.5 mb-8">
                <div className="bg-brand-primary h-2.5 rounded-full transition-all" style={{ width: `${(current / total) * 100}%` }} />
            </div>

            <h2 className="text-2xl font-bold text-brand-ink mb-8 leading-relaxed">
                Est-il vrai que la pilule contraceptive rend stérile à long terme ?
            </h2>

            <div className="space-y-4">
                <button type="button" className="w-full p-4 text-left border-2 border-brand-border rounded-2xl hover:border-brand-primary/40 font-medium text-lg transition-colors">Vrai</button>
                <button type="button" className="w-full p-4 text-left border-2 border-brand-border rounded-2xl hover:border-brand-primary/40 font-medium text-lg transition-colors">Faux</button>
            </div>
        </div>
    );
}
