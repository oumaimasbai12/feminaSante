import React from 'react';

export default function MyAppointments({ appointments = [] }) {
    return (
        <div className="space-y-4">
            {appointments.length === 0 ? (
                <div className="glass-card text-center text-brand-muted">
                    Aucun rendez-vous planifié.
                </div>
            ) : (
                appointments.map((app, i) => (
                    <div key={i} className="glass-card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-soft text-brand-primary rounded-xl flex items-center justify-center font-bold flex-col leading-none">
                                <span className="text-lg">{app.day}</span>
                                <span className="text-xs uppercase">{app.month}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-brand-ink">Dr. {app.doctorName}</h4>
                                <p className="text-sm text-brand-muted">{app.specialty} • {app.time}</p>
                            </div>
                        </div>
                        <button type="button" className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors">
                            Annuler
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
