import React from 'react';

const ICON_BG = {
    rose: 'bg-rose-50',
    red: 'bg-red-50',
    emerald: 'bg-emerald-50',
    indigo: 'bg-indigo-50',
    amber: 'bg-amber-50',
};

export default function DashboardStats({ stats }) {
    const defaultStats = [
        { label: 'Jour du Cycle Actuel', value: stats?.cycleDay || '14', unit: 'ème jour', icon: '📅', color: 'rose' },
        { label: 'Prochaines Règles', value: stats?.nextPeriodDays || '12', unit: 'jours', icon: '🩸', color: 'red' },
        { label: 'Humeur Dominante', value: stats?.mood || 'Calme', unit: '', icon: '🌱', color: 'emerald' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {defaultStats.map((stat, i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center hover:-translate-y-1 transition-transform"
                >
                    <div
                        className={`w-14 h-14 rounded-2xl ${ICON_BG[stat.color] || ICON_BG.rose} flex items-center justify-center text-2xl mr-4 shadow-inner`}
                    >
                        <span role="img" aria-label={stat.label}>
                            {stat.icon}
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-semibold mb-1">{stat.label}</p>
                        <p className="text-2xl font-extrabold text-gray-900">
                            {stat.value}{' '}
                            {stat.unit && <span className="text-sm font-medium text-gray-500">{stat.unit}</span>}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
