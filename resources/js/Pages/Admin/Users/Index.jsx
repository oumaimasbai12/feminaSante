import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import {
    DataTable, DataTableToolbar, DataTableScroll, DataTableEmpty, DataTableLoading, DataTablePagination,
} from '@/Components/UI/DataTable';
import { TableActionGroup, TableActionLink, TableActionButton } from '@/Components/UI/TableActions';
import { Head, Link } from '@inertiajs/react';
import { Search, Eye, Trash2 } from 'lucide-react';

export default function Index() {
    const params = new URLSearchParams(window.location.search);
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState(params.get('search') || '');
    const [page, setPage] = useState(parseInt(params.get('page') || '1', 10));
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null);

    const load = useCallback(() => {
        setLoading(true);
        const qs = new URLSearchParams({ page: String(page) });
        if (query) qs.set('search', query);

        window.axios.get(`/api/v1/admin/users?${qs}`)
            .then(r => {
                const paginated = r.data?.data || {};
                setUsers(paginated.data || []);
                setMeta({
                    current_page: paginated.current_page,
                    last_page: paginated.last_page,
                    total: paginated.total,
                });
            })
            .catch(() => { setUsers([]); setMeta({}); })
            .finally(() => setLoading(false));
    }, [page, query]);

    useEffect(load, [load]);

    const applyFilters = (e) => {
        e?.preventDefault();
        setPage(1);
        load();
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await window.axios.delete(`/api/v1/admin/users/${deleteTarget.id}`);
            setToast(`Profil de ${deleteTarget.nom} supprimé.`);
            setDeleteTarget(null);
            load();
        } catch (e) {
            setToast(e.response?.data?.message || 'Erreur lors de la suppression.');
        } finally {
            setDeleting(false);
            setTimeout(() => setToast(null), 4000);
        }
    };

    return (
        <AdminLayout header={<h2 className="font-bold text-xl text-brand-ink">Utilisatrices</h2>}>
            <Head title="Utilisatrices - Admin" />
            <ConfirmDialog
                open={!!deleteTarget}
                title="Supprimer le compte"
                message={`Supprimer définitivement le profil de ${deleteTarget?.nom} ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                danger
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
            {toast && (
                <div className="mb-4 p-4 rounded-xl bg-brand-ink text-white text-sm font-medium">{toast}</div>
            )}

            <DataTable>
                <DataTableToolbar>
                    <div>
                        <h3 className="font-bold text-brand-ink">Patientes inscrites</h3>
                        <p className="text-sm text-brand-muted">
                            {meta.total ?? 0} patiente{(meta.total ?? 0) > 1 ? 's' : ''} · Les praticiens sont gérés dans{' '}
                            <Link href="/admin/gynecologists" className="text-brand-primary hover:opacity-80 transition-opacity">Praticiens</Link>
                        </p>
                    </div>
                    <form onSubmit={applyFilters} className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Rechercher..."
                                className="input-field pl-9 w-full sm:w-56 py-2.5"
                            />
                        </div>
                        <button type="submit" className="btn-primary py-2.5">Rechercher</button>
                    </form>
                </DataTableToolbar>

                {loading ? (
                    <DataTableLoading />
                ) : users.length === 0 ? (
                    <DataTableEmpty>Aucune patiente trouvée.</DataTableEmpty>
                ) : (
                    <DataTableScroll>
                        <table className="fs-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>E-mail</th>
                                    <th>Inscription</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="font-semibold text-brand-ink">{user.nom}</td>
                                        <td className="text-brand-muted">{user.email}</td>
                                        <td className="text-brand-muted">{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                                        <td className="text-right">
                                            <TableActionGroup>
                                                <TableActionLink href={`/admin/users/${user.id}`} icon={Eye}>Voir</TableActionLink>
                                                <TableActionButton icon={Trash2} danger onClick={() => setDeleteTarget(user)}>Supprimer</TableActionButton>
                                            </TableActionGroup>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </DataTableScroll>
                )}

                {!loading && (
                    <DataTablePagination
                        page={meta.current_page || page}
                        lastPage={meta.last_page || 1}
                        onPrev={() => setPage(p => p - 1)}
                        onNext={() => setPage(p => p + 1)}
                    />
                )}
            </DataTable>
        </AdminLayout>
    );
}
