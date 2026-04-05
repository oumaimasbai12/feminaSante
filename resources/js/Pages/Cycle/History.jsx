import React from 'react';
import AuthenticatedLayout from '@/Components/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import CycleStats from '@/Components/Cycle/CycleStats';

export default function History({ auth }) {
    const allCycles = [
        { id: 1, start: '10 Mars 2026', end: '14 Mars 2026', length: 28, symptoms: ['Crampes', 'Fatigue'], mood: 'Stress' },
        { id: 2, start: '10 Février 2026', end: '15 Février 2026', length: 27, symptoms: ['Maux de tête'], mood: 'Calme' },
        { id: 3, start: '14 Janvier 2026', end: '19 Janvier 2026', length: 29, symptoms: [], mood: 'Énergique' },
        { id: 4, start: '16 Décembre 2025', end: '20 Décembre 2025', length: 28, symptoms: ['Ballonnements'], mood: 'Triste' },
    ];

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Historique des Cycles</h2>}
        >
            <Head title="Historique - Femina Santé" />

            <div className="py-8">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    <div className="mb-4">
                        <Link href="/cycle" className="text-rose-600 hover:text-rose-800 flex items-center font-medium bg-white w-max px-4 py-2 rounded-lg shadow-sm border border-rose-50 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Retour au tableau de bord
                        </Link>
                    </div>

                    <CycleStats />

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Tous les cycles enregistrés</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-400 text-sm uppercase tracking-wider border-b border-gray-100">
                                        <th className="pb-3 font-semibold">Période</th>
                                        <th className="pb-3 font-semibold text-center">Durée</th>
                                        <th className="pb-3 font-semibold">Symptômes Notés</th>
                                        <th className="pb-3 font-semibold">Humeur Dominante</th>
                                        <th className="pb-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allCycles.map(cycle => (
                                        <tr key={cycle.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                            <td className="py-4 font-medium text-gray-900">{cycle.start} - <br/><span className="text-gray-500 font-normal">{cycle.end}</span></td>
                                            <td className="py-4 text-center">
                                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold">
                                                    {cycle.length} jrs
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-600">{cycle.symptoms.length > 0 ? cycle.symptoms.join(', ') : '-'}</td>
                                            <td className="py-4 text-gray-600">{cycle.mood}</td>
                                            <td className="py-4 text-right">
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">Modifier</button>
                                                <button className="text-red-500 hover:text-red-700">Supprimer</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
