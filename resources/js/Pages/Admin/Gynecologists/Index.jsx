import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import {
    DataTable, DataTableToolbar, DataTableScroll, DataTableEmpty, DataTableLoading,
} from '@/Components/UI/DataTable';
import { TableActionGroup, TableActionLink, TableActionButton } from '@/Components/UI/TableActions';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

export default function AdminGynecologists() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const load = () => {
        setLoading(true);
        window.axios.get('/api/v1/admin/gynecologists')
            .then(r => setDocs(Array.isArray(r.data) ? r.data : (r.data.data || [])))
            .catch(() => setDocs([]))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await window.axios.delete(`/api/v1/admin/gynecologists/${deleteTarget.id}`);
            setDeleteTarget(null);
            load();
        } catch (e) {
            alert(e.response?.data?.message || 'Impossible de supprimer ce praticien.');
        } finally {
            setDeleting(false);
        }
    };

    const filtered = docs.filter(d => {
        const q = query.toLowerCase();
        return !q
            || d.first_name?.toLowerCase().includes(q)
            || d.last_name?.toLowerCase().includes(q)
            || d.city?.toLowerCase().includes(q)
            || d.speciality?.toLowerCase().includes(q);
    });

    return (
        <AdminLayout header={<h2 className="font-bold text-xl text-brand-ink">Praticiens</h2>}>
            <ConfirmDialog
                open={!!deleteTarget}
                title="Supprimer le praticien"
                message={`Supprimer Dr. ${deleteTarget?.first_name} ${deleteTarget?.last_name} ? Son profil et son compte de connexion seront retirés.`}
                confirmLabel="Supprimer"
                danger
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            <DataTable>
                <DataTableToolbar>
                    <div>
                        <h3 className="font-bold text-brand-ink">Tous les praticiens</h3>
                        <p className="text-sm text-brand-muted">{docs.length} praticien{docs.length > 1 ? 's' : ''} sur la plateforme</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                            <input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Rechercher..."
                                className="input-field pl-9 w-full sm:w-56 py-2.5"
                            />
                        </div>
                        <Link href="/admin/gynecologists/create" className="btn-primary shrink-0 py-2.5">
                            <Plus size={16} /> Ajouter
                        </Link>
                    </div>
                </DataTableToolbar>

                {loading ? (
                    <DataTableLoading />
                ) : filtered.length === 0 ? (
                    <DataTableEmpty>Aucun praticien.</DataTableEmpty>
                ) : (
                    <DataTableScroll>
                        <table className="fs-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th className="hidden sm:table-cell">Ville</th>
                                    <th className="hidden md:table-cell">Spécialité</th>
                                    <th>Statut</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(doc => (
                                    <tr key={doc.id}>
                                        <td>
                                            <p className="font-semibold text-brand-ink">Dr. {doc.first_name} {doc.last_name}</p>
                                            <p className="text-xs text-brand-muted sm:hidden">{doc.city}</p>
                                        </td>
                                        <td className="text-brand-muted hidden sm:table-cell">{doc.city || '—'}</td>
                                        <td className="text-brand-muted hidden md:table-cell">{doc.speciality || '—'}</td>
                                        <td>
                                            <span className={`status-badge ${doc.is_active ? 'badge-active' : 'badge-inactive'}`}>
                                                {doc.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                            <p className="text-[11px] text-brand-muted mt-1">
                                                {doc.upcoming_availabilities_count ?? 0} créneau{(doc.upcoming_availabilities_count ?? 0) > 1 ? 'x' : ''}
                                            </p>
                                        </td>
                                        <td>
                                            <TableActionGroup>
                                                <TableActionLink href={`/admin/gynecologists/${doc.id}/edit`} icon={Pencil}>Modifier</TableActionLink>
                                                <TableActionButton icon={Trash2} danger onClick={() => setDeleteTarget(doc)}>Supprimer</TableActionButton>
                                            </TableActionGroup>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </DataTableScroll>
                )}
            </DataTable>
        </AdminLayout>
    );
}
