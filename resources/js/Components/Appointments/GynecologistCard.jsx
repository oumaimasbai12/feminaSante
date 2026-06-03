import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

export default function GynecologistCard({ name, specialty, address, nextAvailable }) {
    return (
        <div className="glass-card flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-brand-soft rounded-full flex-shrink-0 flex items-center justify-center text-brand-primary font-bold text-xl">
                    {name?.charAt(0) || 'D'}
                </div>
                <div>
                    <h3 className="font-bold text-brand-ink text-lg">Dr. {name}</h3>
                    <p className="text-brand-primary font-medium text-sm">{specialty}</p>
                    <p className="text-brand-muted text-sm mt-1 flex items-start gap-1">
                        <MapPin size={14} className="mt-0.5 flex-shrink-0" /> {address}
                    </p>
                </div>
            </div>
            {nextAvailable && (
                <div className="mt-auto pt-4 border-t border-brand-border">
                    <p className="text-xs text-brand-muted font-bold uppercase tracking-wider mb-2">Prochaine dispo</p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-md border border-green-100">
                        <Calendar size={14} /> {nextAvailable}
                    </span>
                </div>
            )}
            <button type="button" className="w-full mt-4 btn-primary">
                Prendre RDV
            </button>
        </div>
    );
}
