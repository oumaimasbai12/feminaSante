import React from 'react';
import { Shield } from 'lucide-react';

export default function PreventionTips({ tips }) {
    if (!tips || tips.length === 0) return null;

    const renderTip = (tip, index) => {
        if (typeof tip === 'string') {
            return <li key={index} className="text-brand-muted leading-relaxed">{tip}</li>;
        }
        return (
            <li key={index} className="mb-3">
                <strong className="text-brand-ink block mb-1">{tip.title}</strong>
                <span className="text-brand-muted">{tip.description}</span>
            </li>
        );
    };

    return (
        <section className="mb-10 p-6 bg-brand-soft rounded-2xl border border-brand-border">
            <h2 className="text-xl font-bold text-brand-ink mb-4 flex items-center gap-2">
                <Shield size={20} className="text-brand-primary" />
                Conseils de prévention
            </h2>
            <ul className="list-disc pl-5 space-y-2">
                {Array.isArray(tips) ? tips.map(renderTip) : <li className="text-brand-muted">{tips}</li>}
            </ul>
        </section>
    );
}
