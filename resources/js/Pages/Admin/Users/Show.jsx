import React from 'react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, userRecord }) {
    // Mock user details since we don't have real data bound yet
    const patient = userRecord?.data || {
        id: 1,
        nom: "Marie Dupont",
        email: "marie.dupont@test.fr",
        is_admin: 0,
        settings: { notifications_active: true },
        pregnancies: [{ id: 1, current_week: 24, status: 'active' }],
        menopauses: []
    };

    return (
        <AdminLayout
            user={auth?.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href="/admin/users" className="text-slate-400 hover:text-slate-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h2 className="font-bold text-xl text-slate-800">Détails Patiente : {patient.nom}</h2>
                </div>
            }
        >
            <Head title={`Utilisateur ${patient.nom} - Admin`} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
                
                {/* Left Col: Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
                        <div className="w-24 h-24 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-4xl mb-4">
                            👤
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{patient.nom}</h3>
                        <p className="text-slate-500 mb-4">{patient.email}</p>
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-widest">Compte Actif</span>
                    </div>

                    <div className="bg-red-50 text-red-700 rounded-2xl border border-red-200 shadow-sm p-6">
                        <h4 className="font-bold mb-2">Zone Dangereuse</h4>
                        <p className="text-sm text-red-600/80 mb-4 font-medium">La suppression d'un compte entraîne l'effacement complet des historiques médicaux de façon irréversible.</p>
                        <button className="w-full py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-sm transition">
                            Supprimer ce profil
                        </button>
                    </div>
                </div>

                {/* Right Col: Usage Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Suivis Actifs</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-xl border ${patient.pregnancies.length > 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="font-bold flex items-center justify-between mb-2">
                                    <span className={patient.pregnancies.length > 0 ? 'text-indigo-900' : 'text-slate-500'}>Maternité</span>
                                    <span className="text-2xl">{patient.pregnancies.length > 0 ? '🤰' : '➖'}</span>
                                </div>
                                <p className={`text-sm font-medium ${patient.pregnancies.length > 0 ? 'text-indigo-700' : 'text-slate-400'}`}>
                                    {patient.pregnancies.length > 0 ? 'Grossesse en cours détectée.' : 'Aucun suivi actif.'}
                                </p>
                            </div>
                            
                            <div className={`p-4 rounded-xl border ${patient.menopauses.length > 0 ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="font-bold flex items-center justify-between mb-2">
                                    <span className={patient.menopauses.length > 0 ? 'text-orange-900' : 'text-slate-500'}>Ménopause</span>
                                    <span className="text-2xl">{patient.menopauses.length > 0 ? '🍂' : '➖'}</span>
                                </div>
                                <p className={`text-sm font-medium ${patient.menopauses.length > 0 ? 'text-orange-700' : 'text-slate-400'}`}>
                                    {patient.menopauses.length > 0 ? 'Protocole actif détecté.' : 'Aucun protocole déclaré.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Sécurité & RGPD</h3>
                        <div className="space-y-3 font-medium text-sm text-slate-700">
                            <div className="flex justify-between p-2 hover:bg-slate-50 rounded-lg">
                                <span className="text-slate-500">Authentification 2FA</span>
                                <span className="text-red-500 font-bold">Désactivée</span>
                            </div>
                            <div className="flex justify-between p-2 hover:bg-slate-50 rounded-lg">
                                <span className="text-slate-500">Avertissements (LogSensitiveData)</span>
                                <span>0 flag suspect</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
