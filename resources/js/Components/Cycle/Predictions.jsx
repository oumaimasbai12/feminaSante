import React from 'react';
import { Clock } from 'lucide-react';

export default function Predictions() {
    return (
        <div className="glass-card h-full">
            <h3 className="text-xl font-bold text-brand-ink mb-6 flex items-center gap-2">
                <Clock size={20} className="text-brand-primary" />
                Prédictions
            </h3>

            <div className="space-y-4">
                <div className="bg-brand-soft/50 p-4 rounded-2xl border border-brand-border">
                    <p className="text-brand-ink font-semibold mb-1">Prochaines règles</p>
                    <p className="text-3xl font-black text-brand-primary">Dans 12 jours</p>
                    <p className="text-sm text-brand-muted mt-1">Prévues pour le 16 avril</p>
                </div>

                <div className="bg-brand-soft/50 p-4 rounded-2xl border border-brand-border">
                    <p className="text-brand-muted font-semibold mb-1">Fenêtre de fertilité</p>
                    <p className="text-xl font-bold text-brand-primary">En cours</p>
                    <p className="text-sm text-brand-muted mt-1">Forte probabilité aujourd'hui</p>
                </div>
            </div>
        </div>
    );
}
