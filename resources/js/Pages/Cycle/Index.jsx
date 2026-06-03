import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import CycleCalendar from '@/Components/Cycle/CycleCalendar';
import AddEntryModal from '@/Components/Cycle/AddEntryModal';
import SymptomSelector from '@/Components/Cycle/SymptomSelector';
import CycleHistory from '@/Components/Cycle/CycleHistory';
import CycleStats from '@/Components/Cycle/CycleStats';
import Predictions from '@/Components/Cycle/Predictions';

export default function Index() {
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);

 return (
 <AppLayout title="Mon cycle">
 <Head title="Suivi du Cycle - Femina Santé" />

 <div className="py-8">
 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
 
 <div className="flex justify-between items-center mb-8">
 <div>
 <h1 className="text-3xl font-extrabold text-brand-ink">Suivi Menstruel</h1>
 <p className="text-brand-muted mt-2">Analysez vos cycles et anticipez vos symptômes.</p>
 </div>
 <button 
 onClick={() => setIsAddModalOpen(true)}
 className="btn-primary"
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
 </AppLayout>
 );
}
