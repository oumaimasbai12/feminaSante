import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import CycleStats from '@/Components/Cycle/CycleStats';
import { DataTable, DataTableToolbar, DataTableScroll } from '@/Components/UI/DataTable';
import { TableActionGroup, TableActionButton } from '@/Components/UI/TableActions';

export default function History() {
    const allCycles = [
        { id: 1, start: '10 Mars 2026', end: '14 Mars 2026', length: 28, symptoms: ['Crampes', 'Fatigue'], mood: 'Stress' },
        { id: 2, start: '10 Février 2026', end: '15 Février 2026', length: 27, symptoms: ['Maux de tête'], mood: 'Calme' },
        { id: 3, start: '14 Janvier 2026', end: '19 Janvier 2026', length: 29, symptoms: [], mood: 'Énergique' },
        { id: 4, start: '16 Décembre 2025', end: '20 Décembre 2025', length: 28, symptoms: ['Ballonnements'], mood: 'Triste' },
    ];

    return (
        <AppLayout title="Historique du cycle">
            <Head title="Historique - Femina Santé" />

            <div className="py-8">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <Link href="/cycle" className="text-brand-primary hover:text-brand-dark flex items-center font-medium glass-panel w-max px-4 py-2 rounded-xl border border-brand-border transition-colors">
                        <ArrowLeft size={18} className="mr-2" />
                        Retour au tableau de bord
                    </Link>

                    <CycleStats />

                    <DataTable>
                        <DataTableToolbar className="lg:flex-row lg:items-center">
                            <div>
                                <h3 className="font-bold text-brand-ink">Tous les cycles enregistrés</h3>
                                <p className="text-sm text-brand-muted">{allCycles.length} cycle{allCycles.length > 1 ? 's' : ''}</p>
                            </div>
                        </DataTableToolbar>

                        <DataTableScroll>
                            <table className="fs-table">
                                <thead>
                                    <tr>
                                        <th>Période</th>
                                        <th className="text-center">Durée</th>
                                        <th>Symptômes</th>
                                        <th>Humeur</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allCycles.map(cycle => (
                                        <tr key={cycle.id}>
                                            <td className="font-medium text-brand-ink">
                                                {cycle.start}
                                                <span className="block text-brand-muted font-normal text-xs">{cycle.end}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className="status-badge badge-completed">{cycle.length} jrs</span>
                                            </td>
                                            <td className="text-brand-muted">{cycle.symptoms.length > 0 ? cycle.symptoms.join(', ') : '—'}</td>
                                            <td className="text-brand-muted">{cycle.mood}</td>
                                            <td className="text-right">
                                                <TableActionGroup>
                                                    <TableActionButton icon={Pencil}>Modifier</TableActionButton>
                                                    <TableActionButton icon={Trash2} danger>Supprimer</TableActionButton>
                                                </TableActionGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </DataTableScroll>
                    </DataTable>
                </div>
            </div>
        </AppLayout>
    );
}
