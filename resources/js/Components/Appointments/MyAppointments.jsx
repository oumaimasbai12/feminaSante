import React from 'react';

export default function MyAppointments({ appointments = [] }) {
    return (
        <div className="space-y-4">
            {appointments.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center text-gray-500 shadow-sm">
                    Aucun rendez-vous planifié.
                </div>
            ) : (
                appointments.map((app, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold flex-col leading-none">
                                <span className="text-lg">{app.day}</span>
                                <span className="text-xs uppercase">{app.month}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Dr. {app.doctorName}</h4>
                                <p className="text-sm text-gray-500">{app.specialty} • {app.time}</p>
                            </div>
                        </div>
                        <button className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition">
                            Annuler
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
