import React from 'react';
import { Calendar, Droplets, Smile } from 'lucide-react';

const ICONS = {
    rose: { Icon: Calendar, bg: 'bg-brand-soft', color: 'text-brand-primary' },
    red: { Icon: Droplets, bg: 'bg-brand-soft', color: 'text-brand-primary' },
    emerald: { Icon: Smile, bg: 'bg-brand-soft', color: 'text-brand-primary' },
};

export default function DashboardStats({ stats }) {
    const defaultStats = [
        { label: 'Jour du cycle actuel', value: stats?.cycleDay || '14', unit: 'ème jour', color: 'rose' },
        { label: 'Prochaines règles', value: stats?.nextPeriodDays || '12', unit: 'jours', color: 'red' },
        { label: 'Humeur dominante', value: stats?.mood || 'Calme', unit: '', color: 'emerald' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {defaultStats.map((stat, i) => {
                const { Icon, bg, color } = ICONS[stat.color] || ICONS.rose;
                return (
                    <div key={i} className="glass-card p-6 flex items-center">
                        <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mr-4`}>
                            <Icon size={26} className={color} aria-hidden />
                        </div>
                        <div>
                            <p className="text-brand-muted text-sm font-semibold mb-1">{stat.label}</p>
                            <p className="text-2xl font-extrabold text-brand-ink">
                                {stat.value}{' '}
                                {stat.unit && <span className="text-sm font-medium text-brand-muted">{stat.unit}</span>}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
