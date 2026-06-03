import React from 'react';
import { Calendar, Clock, Loader2, AlertCircle } from 'lucide-react';

export default function DoctorAvailability({
    days = [],
    loading = false,
    error = '',
    compact = false,
    selectedDate = '',
    onSelectDate,
}) {
    if (loading) {
        return (
            <div className="flex items-center justify-center gap-2 py-6 text-brand-muted text-sm">
                <Loader2 size={18} className="animate-spin" /> Chargement des disponibilités...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
            </div>
        );
    }

    if (!days.length) {
        return (
            <div className="p-4 rounded-xl bg-brand-soft border border-brand-border text-sm text-brand-muted text-center">
                Aucune disponibilité publiée pour les 30 prochains jours.
            </div>
        );
    }

    if (compact) {
        return (
            <div className="flex flex-wrap gap-2">
                {days.slice(0, 5).map(day => (
                    <span
                        key={day.date}
                        className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-100"
                    >
                        <Calendar size={12} />
                        {day.label}
                        <span className="text-emerald-600">({day.slots_count})</span>
                    </span>
                ))}
                {days.length > 5 && (
                    <span className="text-xs text-brand-muted self-center">+{days.length - 5} jours</span>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {onSelectDate ? (
                <div className="grid sm:grid-cols-2 gap-2">
                    {days.map(day => (
                        <button
                            key={day.date}
                            type="button"
                            onClick={() => onSelectDate(day.date)}
                            className={`text-left p-3 rounded-xl border-2 transition-all ${
                                selectedDate === day.date
                                    ? 'border-brand-primary bg-brand-soft'
                                    : 'border-brand-border hover:border-brand-primary/40 bg-brand-bg'
                            }`}
                        >
                            <p className="text-sm font-semibold text-brand-ink capitalize flex items-center gap-1.5">
                                <Calendar size={14} className="text-brand-primary" />
                                {day.label}
                            </p>
                            <p className="text-xs text-brand-muted mt-1 flex items-center gap-1">
                                <Clock size={12} />
                                {day.windows?.map(w => `${w.start}–${w.end}`).join(', ')}
                            </p>
                            <p className="text-xs text-emerald-700 font-medium mt-1">
                                {day.slots_count} créneau{day.slots_count > 1 ? 'x' : ''} libre{day.slots_count > 1 ? 's' : ''}
                            </p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="divide-y divide-brand-border rounded-xl border border-brand-border overflow-hidden">
                    {days.map(day => (
                        <div key={day.date} className="px-4 py-3 bg-brand-bg flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <p className="text-sm font-semibold text-brand-ink capitalize min-w-[140px] flex items-center gap-1.5">
                                <Calendar size={14} className="text-brand-primary" />
                                {day.label}
                            </p>
                            <p className="text-sm text-brand-muted flex items-center gap-1 flex-1">
                                <Clock size={13} className="shrink-0" />
                                {day.windows?.map(w => `${w.start}–${w.end}`).join(' · ')}
                            </p>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                                {day.slots_count} créneau{day.slots_count > 1 ? 'x' : ''}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
