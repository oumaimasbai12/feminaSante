import React, { useState } from 'react';
import AuthenticatedLayout from '@/Components/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CycleCalendar from '@/Components/Cycle/CycleCalendar';
import AddEntryModal from '@/Components/Cycle/AddEntryModal';
import SymptomSelector from '@/Components/Cycle/SymptomSelector';
import CycleHistory from '@/Components/Cycle/CycleHistory';
import CycleStats from '@/Components/Cycle/CycleStats';
import Predictions from '@/Components/Cycle/Predictions';

export default function Index({ auth }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Mon Cycle</h2>}
        >
            <Head title="Suivi du Cycle - Femina Santé" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">Suivi Menstruel</h1>
                            <p className="text-gray-500 mt-2">Analysez vos cycles et anticipez vos symptômes.</p>
                        </div>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-sm hover:bg-rose-700 hover:-translate-y-0.5 transition"
                        >
                            + Ajouter une entrée
                        </button>
                    </div>

                    <CycleStats />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <CycleCalendar />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SymptomSelector />
                                <CycleHistory />
                            </div>
                        </div>
                        <div>
                            <Predictions />
                        </div>
                    </div>
                </div>
            </div>

            <AddEntryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </AuthenticatedLayout>
    );
}
