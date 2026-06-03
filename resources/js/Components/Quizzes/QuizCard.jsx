import React from 'react';
import { Target } from 'lucide-react';

const ICON_THEME = {
    blue: 'bg-brand-soft text-brand-primary',
    indigo: 'bg-brand-soft text-brand-primary',
    purple: 'bg-brand-soft text-brand-primary',
    rose: 'bg-brand-soft text-brand-primary',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-brand-primary',
};

export default function QuizCard({ title, questionsCount, difficulty, color = 'blue' }) {
    const iconClass = ICON_THEME[color] || ICON_THEME.blue;

    return (
        <div className="glass-card flex flex-col h-full">
            <div>
                <div className={`w-12 h-12 ${iconClass} rounded-2xl flex items-center justify-center mb-4`}>
                    <Target size={24} />
                </div>
                <h3 className="text-xl font-bold text-brand-ink mb-2">{title}</h3>
                <div className="flex gap-3 text-sm text-brand-muted font-medium">
                    <span>{questionsCount} questions</span>
                    <span>•</span>
                    <span className="capitalize">{difficulty}</span>
                </div>
            </div>
            <button type="button" className="mt-6 w-full btn-secondary">
                Démarrer
            </button>
        </div>
    );
}
