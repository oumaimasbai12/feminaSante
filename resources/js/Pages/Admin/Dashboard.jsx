import React from 'react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    // Default stats if none passed
    const metrics = stats || {
        total_users: 1240,
        total_cycles_logged: 54300,
        total_pregnancies: 312,
        total_menopauses: 189
    };

    return (
        <AdminLayout
            user={auth?.user}
            header={<h2 className="font-bold text-xl text-slate-800">Tableau de bord Administrateur</h2>}
        >
            <Head title="Admin Dashboard - Femina Santé" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                    <div className="relative z-10 w-full md:w-2/3">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Centre de Contrôle 🛠️</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Bienvenue dans l'espace d'administration de Femina Santé. D'ici, vous gardez un œil sur les métriques clés de l'application et vous pouvez modérer les utilisatrices ou le contenu éducatif.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
                        <svg className="w-64 h-64 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat Card 1 */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-bold">👥</div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">+12% ce mois</span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-800">{metrics.total_users.toLocaleString()}</h4>
                        <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">Patientes inscrites</p>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 text-xl font-bold">🩸</div>
                        </div>
                        <h4 className="text-3xl font-black text-slate-800">{metrics.total_cycles_logged.toLocaleString()}</h4>
                        <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">Cycles enregistrés</p>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xl font-bold">🍼</div>
                        </div>
                        <h4 className="text-3xl font-black text-slate-800">{metrics.total_pregnancies.toLocaleString()}</h4>
                        <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">Grossesses suivies</p>
                    </div>
                    
                    {/* Stat Card 4 */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 text-xl font-bold">🍂</div>
                        </div>
                        <h4 className="text-3xl font-black text-slate-800">{metrics.total_menopauses.toLocaleString()}</h4>
                        <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">Profils ménopause</p>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
