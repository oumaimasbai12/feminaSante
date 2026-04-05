import React, { useState } from 'react';

export default function AvailabilityCalendar() {
    const dates = ["Auj.", "Demain", "Mer. 15", "Jeu. 16", "Ven. 17"];
    const [selectedDate, setSelectedDate] = useState("Auj.");

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mt-6">
            <h3 className="font-bold text-gray-900 mb-4">Disponibilités</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                {dates.map(date => (
                    <button 
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${selectedDate === date ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                    >
                        {date}
                    </button>
                ))}
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                <button className="py-2 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium">09:00</button>
                <button className="py-2 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium">10:30</button>
                <button className="py-2 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium">14:00</button>
                <button className="py-2 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium">16:15</button>
            </div>
        </div>
    );
}
