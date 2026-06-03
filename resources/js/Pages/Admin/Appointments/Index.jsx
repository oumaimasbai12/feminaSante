import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import StatusBadge from '@/Components/UI/StatusBadge';
import {
    DataTable, DataTableToolbar, DataTableScroll, DataTableEmpty, DataTableLoading, DataTablePagination,
} from '@/Components/UI/DataTable';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';

export default function AppointmentsIndex() {
    const params = new URLSearchParams(window.location.search);
    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState(params.get('status') || '');
    const [page, setPage] = useState(1);

    const load = useCallback(() => {
        setLoading(true);
        const qs = new URLSearchParams({ page: String(page) });
        if (query) qs.set('search', query);
        if (status) qs.set('status', status);

        window.axios.get(`/api/v1/admin/appointments?${qs}`)
            .then(r => {
                const paginated = r.data?.data || {};
                setItems(paginated.data || []);
                setMeta({
                    current_page: paginated.current_page,
                    last_page: paginated.last_page,
                    total: paginated.total,
                });
            })
            .catch(() => { setItems([]); setMeta({}); })
            .finally(() => setLoading(false));
    }, [page, query, status]);

    useEffect(load, [load]);

    return (
        <AdminLayout header={<h2 className="font-bold text-xl text-brand-ink">Rendez-vous</h2>}>
            <Head title="Rendez-vous - Admin" />

            <DataTable>
                <DataTableToolbar>
                    <div>
                        <h3 className="font-bold text-brand-ink">Tous les rendez-vous</h3>
                        <p className="text-sm text-brand-muted">{meta.total ?? 0} rendez-vous sur la plateforme</p>
                    </div>
                    <form onSubmit={e => { e.preventDefault(); setPage(1); load(); }} className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Patiente, médecin, motif..."
                                className="input-field pl-9 w-full sm:w-56 py-2.5" />
                        </div>
                        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
                            className="input-field py-2.5 sm:w-40">
                            <option value="">Tous statuts</option>
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmés</option>
                            <option value="completed">Terminés</option>
                            <option value="cancelled">Annulés</option>
                        </select>
                        <button type="submit" className="btn-primary py-2.5">Rechercher</button>
                    </form>
                </DataTableToolbar>

                {loading ? (
                    <DataTableLoading />
                ) : items.length === 0 ? (
                    <DataTableEmpty>Aucun rendez-vous trouvé.</DataTableEmpty>
                ) : (
                    <DataTableScroll>
                        <table className="fs-table">
                            <thead>
                                <tr>
                                    <th>Patiente</th>
                                    <th>Praticien</th>
                                    <th>Date</th>
                                    <th>Motif</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(a => (
                                    <tr key={a.id}>
                                        <td>
                                            {a.user ? (
                                                <Link href={`/admin/users/${a.user.id}`} className="font-semibold text-brand-ink hover:text-brand-primary transition-colors">
                                                    {a.user.nom}
                                                </Link>
                                            ) : '—'}
                                            <p className="text-xs text-brand-muted">{a.user?.email}</p>
                                        </td>
                                        <td className="text-brand-ink">
                                            {a.gynecologist ? `Dr. ${a.gynecologist.first_name} ${a.gynecologist.last_name}` : '—'}
                                            {a.gynecologist?.city && <p className="text-xs text-brand-muted">{a.gynecologist.city}</p>}
                                        </td>
                                        <td className="text-brand-muted whitespace-nowrap">
                                            {new Date(a.start_time).toLocaleDateString('fr-FR')}
                                            <p className="text-xs text-brand-muted">{new Date(a.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="text-brand-muted max-w-[160px] truncate">{a.reason || '—'}</td>
                                        <td>
                                            <StatusBadge status={a.status} />
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
