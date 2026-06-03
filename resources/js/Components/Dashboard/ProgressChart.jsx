import React from 'react';
import { LineChart } from 'lucide-react';

export default function ProgressChart() {
    return (
        <div className="glass-card h-full flex flex-col">
            <h3 className="text-lg font-bold text-brand-ink mb-6 border-b border-brand-border pb-2">Aperçu du cycle</h3>
            <div className="flex-grow flex items-center justify-center rounded-2xl border border-dashed border-brand-primary/30 bg-brand-soft/60">
                <div className="text-center p-6">
                    <LineChart size={64} className="text-brand-primary mx-auto mb-4" aria-hidden />
                    <p className="text-brand-muted font-medium">Les données du graphique apparaîtront ici lorsque vous aurez saisi un cycle complet.</p>
                </div>
            </div>
        </div>
    );
}
