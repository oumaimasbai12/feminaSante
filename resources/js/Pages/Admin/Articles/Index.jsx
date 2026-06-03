import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import {
    DataTable, DataTableToolbar, DataTableScroll, DataTableEmpty, DataTableLoading,
} from '@/Components/UI/DataTable';
import { TableActionGroup, TableActionLink, TableActionButton } from '@/Components/UI/TableActions';
import { Plus, Search, Trash2, Pencil, BookOpen, CheckCircle2 } from 'lucide-react';

const getCategoryName = (article) => article?.category?.nom || 'Santé';

export default function AdminArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [msg, setMsg] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const load = () => {
        setLoading(true);
        window.axios.get('/api/v1/articles')
            .then(r => setArticles(Array.isArray(r.data) ? r.data : (r.data.data || [])))
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const destroy = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await window.axios.delete(`/api/v1/admin/articles/${deleteTarget.id}`);
            setArticles(prev => prev.filter(a => a.id !== deleteTarget.id));
            setMsg('Article supprimé.');
            setDeleteTarget(null);
            setTimeout(() => setMsg(null), 3000);
        } finally {
            setDeleting(false);
        }
    };

    const filtered = articles.filter(a => {
        const q = query.toLowerCase();
        return !q
            || a.title?.toLowerCase().includes(q)
            || a.excerpt?.toLowerCase().includes(q)
            || getCategoryName(a).toLowerCase().includes(q);
    });

    return (
        <AdminLayout title="Contenus">
            <ConfirmDialog
                open={!!deleteTarget}
                title="Supprimer l'article"
                message={`Supprimer « ${deleteTarget?.title} » ?`}
                confirmLabel="Supprimer"
                danger
                loading={deleting}
                onConfirm={destroy}
                onCancel={() => setDeleteTarget(null)}
            />

            <p className="text-brand-muted text-sm mb-6">
                Gérez les articles affichés dans l&apos;espace patientes.
            </p>

            {msg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    {msg}
                </div>
            )}

            <DataTable>
                <DataTableToolbar>
                    <div>
                        <h3 className="font-bold text-brand-ink">Tous les articles</h3>
                        <p className="text-sm text-brand-muted">
                            {filtered.length} article{filtered.length > 1 ? 's' : ''}
                            {query ? ' (filtrés)' : ''}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                        <div className="relative flex-1 sm:min-w-[240px]">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                            <input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Titre, catégorie, extrait..."
                                className="input-field pl-9 w-full py-2.5"
                            />
                        </div>
                        <Link href="/admin/articles/create" className="btn-primary shrink-0 py-2.5 justify-center">
                            <Plus size={16} /> Nouvel article
                        </Link>
                    </div>
                </DataTableToolbar>

                {loading ? (
                    <DataTableLoading>
                        <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    </DataTableLoading>
                ) : filtered.length === 0 ? (
                    <DataTableEmpty>
                        <BookOpen size={32} className="text-brand-border mx-auto mb-2" />
                        {articles.length === 0 ? 'Aucun article publié.' : 'Aucun article ne correspond à votre recherche.'}
                    </DataTableEmpty>
                ) : (
                    <DataTableScroll>
                        <table className="fs-table">
                            <thead>
                                <tr>
                                    <th>Article</th>
                                    <th className="hidden md:table-cell">Catégorie</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(a => (
                                    <tr key={a.id}>
                                        <td>
                                            <p className="font-semibold text-brand-ink line-clamp-1">{a.title}</p>
                                            <p className="text-xs text-brand-muted line-clamp-2 mt-0.5 max-w-md">
                                                {a.excerpt || '—'}
                                            </p>
                                            <p className="text-xs text-brand-primary mt-1 md:hidden">{getCategoryName(a)}</p>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <span className="status-badge badge-completed">{getCategoryName(a)}</span>
                                        </td>
                                        <td>
                                            <TableActionGroup>
                                                <TableActionLink href={`/admin/articles/${a.id}/edit`} icon={Pencil}>
                                                    Modifier
                                                </TableActionLink>
                                                <TableActionButton icon={Trash2} danger onClick={() => setDeleteTarget(a)}>
                                                    Supprimer
                                                </TableActionButton>
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
