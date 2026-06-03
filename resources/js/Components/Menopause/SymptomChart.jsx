import React from 'react';

/**
 * Lightweight CSS bar chart — mirrors PregnancyDashboard weight chart pattern.
 * Props: data [{ label, value }], maxValue, color, title, unit
 */
export default function SymptomChart({ title, data = [], maxValue = 10, color = 'primary', unit = '' }) {
    if (!data.length) {
        return (
            <div className="glass-card p-6 text-center text-brand-muted text-sm">
                Pas encore de données pour ce graphique.
            </div>
        );
    }

    const colorMap = {
        primary: 'bg-brand-primary',
        dark: 'bg-brand-dark',
        amber: 'bg-amber-500',
        orange: 'bg-orange-500',
        // legacy aliases
        rose: 'bg-brand-primary',
        indigo: 'bg-brand-dark',
    };

    const barColor = colorMap[color] || colorMap.primary;
    const barAreaPx = 88;

    return (
        <div className="glass-card p-5">
            <h4 className="text-sm font-bold text-brand-ink mb-4">{title}</h4>
            <div className="flex items-end gap-1 h-32">
                {data.map((entry, i) => {
                    const value = entry.value ?? 0;
                    const barPx = value > 0
                        ? Math.max(6, Math.round((value / maxValue) * barAreaPx))
                        : 0;
                    const label = entry.label
                        ? entry.label.slice(5)
                        : entry.date
                            ? new Date(`${entry.date}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                            : `#${i + 1}`;

                    return (
                        <div key={entry.date || entry.label || i} className="flex-1 flex flex-col items-center justify-end h-full min-w-0 gap-1">
                            <span className="text-[10px] text-brand-muted font-medium truncate w-full text-center">
                                {value}{unit}
                            </span>
                            <div
                                className={`w-full ${barColor} rounded-t-md transition-all`}
                                style={{ height: barPx }}
                                title={`${label}: ${value}${unit}`}
                            />
                            <span className="text-[9px] text-brand-muted/70 truncate w-full text-center">{label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Horizontal frequency bars for symptom occurrence counts.
 */
export function SymptomFrequencyChart({ data = [] }) {
    if (!data.length) return null;

    const total = data.reduce((sum, item) => sum + item.count, 0);

    if (total === 0) {
        return (
            <div className="glass-card p-5">
                <h4 className="text-sm font-bold text-brand-ink mb-2">Fréquence des symptômes (30 jours)</h4>
                <p className="text-sm text-brand-muted">
                    Cochez les symptômes du jour dans le journal pour voir leur fréquence ici.
                </p>
            </div>
        );
    }

    const max = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="glass-card p-5">
            <h4 className="text-sm font-bold text-brand-ink mb-4">Fréquence des symptômes (30 jours)</h4>
            <div className="space-y-3">
                {data.map(item => (
                    <div key={item.slug}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-brand-ink font-medium">{item.label}</span>
                            <span className="text-brand-muted">{item.count} jour{item.count > 1 ? 's' : ''}</span>
                        </div>
                        <div className="bg-brand-bg rounded-full h-2">
                            <div
                                className="bg-brand-primary rounded-full h-2 transition-all"
                                style={{ width: `${(item.count / max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
