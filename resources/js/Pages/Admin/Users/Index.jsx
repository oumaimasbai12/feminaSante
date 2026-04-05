import React from 'react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, users }) {
    // Scaffold fallback if no real users provided by inertia prop
    const mockUsers = [
        { id: 1, nom: "Marie Dupont", email: "marie.dupont@test.fr", is_admin: 0, created_at: "2026-01-10T14:30:00Z" },
        { id: 2, nom: "Sophie Lemaire", email: "sophie.L@test.fr", is_admin: 0, created_at: "2026-02-15T09:12:00Z" },
        { id: 3, nom: "Administratrice", email: "admin@femina.fr", is_admin: 1, created_at: "2025-11-20T10:00:00Z" },
    ];

    const dataList = users?.data ? users.data : mockUsers;

    return (
        <AdminLayout
            user={auth?.user}
            header={<h2 className="font-bold text-xl text-slate-800">Gestion des Utilisatrices</h2>}
        >
            <Head title="Utilisatrices - Admin" />

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Base de données membres</h3>
                        <p className="text-sm text-slate-500 mt-1">Liste complète des utilisatrices de la plateforme.</p>
                    </div>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Rechercher (nom, email)..." className="rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm w-64" />
                        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition">Chercher</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 uppercase tracking-wider">Nom complet</th>
                                <th className="px-6 py-4 uppercase tracking-wider">Adresse E-mail</th>
                                <th className="px-6 py-4 uppercase tracking-wider">Rôle</th>
                                <th className="px-6 py-4 uppercase tracking-wider">Date d'inscription</th>
                                <th className="px-6 py-4 align-middle text-right uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {dataList.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-bold text-slate-900">{user.nom}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold leading-none ${user.is_admin ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                                            {user.is_admin ? 'Admin' : 'Patiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-900 font-semibold mr-4">Consulter</Link>
                                        {!user.is_admin && (
                                            <button className="text-red-500 hover:text-red-700 font-semibold">Bannir / Suppr.</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-sm text-slate-500">
                    Pagination ou "Charge plus de résultats" viendra ici via Inertia Links.
                </div>
            </div>
        </AdminLayout>
    );
}
