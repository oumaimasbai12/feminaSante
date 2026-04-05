import React from 'react';
import AuthenticatedLayout from '@/Components/Layouts/AuthenticatedLayout';
import SymptomChecker from '@/Components/Diseases/SymptomChecker';
import { Head, Link } from '@inertiajs/react';

export default function SymptomCheckerPage({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Vérificateur de symptômes</h2>}
        >
            <Head title="Vérificateur de symptômes" />

            <div className="py-8">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="mb-4">
                        <Link
                            href="/diseases"
                            className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium transition-colors bg-white w-max px-4 py-2 rounded-lg shadow-sm border border-indigo-50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour au centre de ressources
                        </Link>
                    </div>

                    <SymptomChecker />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
