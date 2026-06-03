import React, { useState } from 'react';

export default function AvailabilityCalendar() {
    const dates = ['Auj.', 'Demain', 'Mer. 15', 'Jeu. 16', 'Ven. 17'];
    const [selectedDate, setSelectedDate] = useState('Auj.');

    return (
        <div className="glass-card mt-6">
            <h3 className="font-bold text-brand-ink mb-4">Disponibilités</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                {dates.map(date => (
                    <button
                        key={date}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${selectedDate === date ? 'bg-brand-primary text-white' : 'bg-brand-soft/60 text-brand-muted border border-brand-border hover:bg-brand-soft'}`}
                    >
                        {date}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
                {['09:00', '10:30', '14:00', '16:15'].map(time => (
                    <button
                        key={time}
                        type="button"
                        className="py-2 border border-brand-border bg-brand-soft/60 text-brand-primary rounded-lg hover:bg-brand-soft hover:border-brand-primary/30 font-medium transition-colors"
                    >
                        {time}
                    </button>
                ))}
            </div>
        </div>
    );
}
