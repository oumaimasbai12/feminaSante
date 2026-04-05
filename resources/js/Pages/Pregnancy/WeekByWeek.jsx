import React from 'react';
import AuthenticatedLayout from '@/Components/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import WeekByWeek from '@/Components/Pregnancy/WeekByWeek';

export default function WeekByWeekPage({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Développement Semaine par Semaine</h2>}
        >
            <Head title="Développement Grossesse - Femina Santé" />

            <div className="py-8">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <div className="mb-4">
                        <Link href="/pregnancy" className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium bg-white w-max px-4 py-2 rounded-lg shadow-sm border border-indigo-50 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Retour au suivi grossesse
                        </Link>
                    </div>

                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                        <WeekByWeek currentWeek={24} />
                        
                        <div className="mt-10 pt-10 border-t border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Navigation Rapide</h3>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3 text-center">
                                {[...Array(40)].map((_, i) => (
                                    <button 
                                        key={i} 
                                        className={`py-2 rounded-lg font-bold text-sm ${i+1 === 24 ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        {i+1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
