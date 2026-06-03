import React from 'react';
import { Search } from 'lucide-react';

export default function SymptomExplorer() {
    return (
        <div className="glass-card p-8 text-center bg-brand-soft/30">
            <Search size={40} className="mx-auto mb-4 text-brand-primary" />
            <h3 className="text-2xl font-bold text-brand-ink mb-3 tracking-tight">Explorez par symptôme</h3>
            <p className="text-brand-muted mb-6 text-lg max-w-md mx-auto">
                Un symptôme vous inquiète ? Parcourez notre base de connaissances pour en comprendre les causes possibles.
            </p>
            <a href="#symptom-checker" className="btn-primary inline-flex items-center gap-2">
                Démarrer l'exploration
            </a>
        </div>
    );
}
