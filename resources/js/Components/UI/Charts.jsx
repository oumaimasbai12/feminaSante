import React from 'react';
import { chartColors, palette } from '@/theme/tokens';

export function BarChart({ data = [], height = 148, className = '' }) {
    if (!data.length) {
        return <p className="text-sm text-brand-muted text-center py-8">Aucune donnée</p>;
    }

    const max = Math.max(...data.map(d => d.value), 1);

    return (
        <div className={`flex items-end justify-between gap-2 ${className}`} style={{ height }} role="img" aria-label="Graphique en barres">
            {data.map((d, i) => {
                const pct = Math.max((d.value / max) * 100, d.value > 0 ? 8 : 2);
                return (
                    <div key={d.label} className="flex-1 flex flex-col items-center justify-end gap-2 min-w-0 h-full">
                        <span className="text-[10px] font-semibold text-brand-ink tabular-nums">{d.value > 0 ? d.value : ''}</span>
                        <div
                            className="w-full max-w-[40px] rounded-lg transition-all duration-300"
                            style={{
                                height: `${pct}%`,
                                minHeight: d.value > 0 ? 6 : 2,
                                background: d.color || chartColors[i % chartColors.length],
                                opacity: d.value > 0 ? 0.92 : 0.25,
                            }}
                        />
                        <span className="text-[10px] text-brand-muted truncate w-full text-center capitalize">{d.label}</span>
                    </div>
                );
            })}
        </div>
    );
}

const defaultSegmentColors = {
    'En attente': '#D97706',
    'Confirmés': '#059669',
    'Terminés': palette.primary,
    'Terminé': palette.primary,
    'Annulés': '#DC2626',
    'Refusés': '#DC2626',
};

export function DonutChart({ segments = [], size = 120, stroke = 14 }) {
    const active = segments.filter(s => s.value > 0);
    const total = segments.reduce((s, x) => s + x.value, 0);

    if (total === 0) {
        return (
            <div className="flex items-center gap-4 py-4">
                <div
                    className="rounded-full border-[14px] border-brand-border flex items-center justify-center text-brand-muted text-sm font-semibold"
                    style={{ width: size, height: size }}
                >
                    0
                </div>
                <p className="text-sm text-brand-muted">Aucun rendez-vous enregistré.</p>
            </div>
        );
    }

    const r = (size - stroke) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    const ringTotal = active.reduce((s, x) => s + x.value, 0) || 1;

    return (
        <div className="flex items-center gap-5 flex-wrap">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(44,44,44,0.06)" strokeWidth={stroke} />
                {active.map((seg, i) => {
                    const len = (seg.value / ringTotal) * circ;
                    const dash = `${len} ${circ - len}`;
                    const color = seg.color || defaultSegmentColors[seg.label] || chartColors[i % chartColors.length];
                    const el = (
                        <circle
                            key={seg.label}
                            cx={cx}
                            cy={cy}
                            r={r}
                            fill="none"
                            stroke={color}
                            strokeWidth={stroke}
                            strokeDasharray={dash}
                            strokeDashoffset={-offset}
                            transform={`rotate(-90 ${cx} ${cy})`}
                            className="transition-all duration-300"
                        />
                    );
                    offset += len;
                    return el;
                })}
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="700" fill={palette.ink}>
                    {total}
                </text>
            </svg>
            <div className="space-y-2 min-w-0 flex-1">
                {segments.map((seg, i) => (
                    <div key={seg.label} className="flex items-center gap-2 text-xs">
                        <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: seg.color || defaultSegmentColors[seg.label] || chartColors[i % chartColors.length] }}
                        />
                        <span className="text-brand-muted truncate">{seg.label}</span>
                        <span className="font-semibold text-brand-ink ml-auto tabular-nums">{seg.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function LineChart({ data = [], height = 100, className = '' }) {
    if (data.length < 2) {
        return <p className="text-sm text-brand-muted text-center py-6">Pas assez de données</p>;
    }
    const max = Math.max(...data.map(d => d.value), 1);
    const w = 280;
    const pad = 8;
    const points = data.map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = height - pad - (d.value / max) * (height - pad * 2);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${w} ${height}`} className={`w-full h-auto ${className}`}>
            <polyline
                fill="none"
                stroke={palette.primary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
            {data.map((d, i) => {
                const x = pad + (i / (data.length - 1)) * (w - pad * 2);
                const y = height - pad - (d.value / max) * (height - pad * 2);
                return <circle key={d.label} cx={x} cy={y} r={3.5} fill={palette.primaryDark} />;
            })}
        </svg>
    );
}
