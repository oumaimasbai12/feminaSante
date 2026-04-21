import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import { Plus, Search, Trash2, Pencil, Eye, Star, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminArticles() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [msg, setMsg] = useState(null);

    const load = () => {
        setLoading(true);
        window.axios.get('/api/v1/articles')
            .then(r => setArticles(Array.isArray(r.data) ? r.data : (r.data.data || [])))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const toggleStatus = async (article) => {
        const newStatus = article.status === 'published' ? 'draft' : 'published';
        await window.axios.put(`/api/v1/admin/articles/${article.id}`, { status: newStatus });
        setArticles(articles.map(a => a.id === article.id ? { ...a, status: newStatus } : a));
    };

    const toggleFeatured = async (article) => {
        await window.axios.put(`/api/v1/admin/articles/${article.id}`, { is_featured: !article.is_featured });
        setArticles(articles.map(a => a.id === article.id ? { ...a, is_featured: !a.is_featured } : a));
    };

    const destroy = async (article) => {
        if (!confirm(`Supprimer "${article.title}" ?`)) return;
        await window.axios.delete(`/api/v1/admin/articles/${article.id}`);
        setArticles(articles.filter(a => a.id !== article.id));
        setMsg('Article supprimé.');
        setTimeout(() => setMsg(null), 3000);
    };

    const filtered = articles.filter(a => {
        const q = query.toLowerCase();
        return !q || a.title?.toLowerCase().includes(q) || a.category?.nom?.toLowerCase().includes(q);
    });

    return (
        <AdminLayout user={user}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-extrabold text-slate-800">Articles</h1>
                <Link href="/admin/articles/create" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                    <Plus size={16} /> Nouvel article
                </Link>
            </div>

            {msg && <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm font-semibold">{msg}</div>}

            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={query} onChange={e => setQuery(e.target.value)}
                        placeholder="Rechercher par titre ou catégorie..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>
            </div>

            {loading && <div className="text-center py-12 text-slate-400">Chargement...</div>}

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600">Titre</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Catégorie</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Vues</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600">Statut</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600">À la une</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(a => (
                            <tr key={a.id} className="hover:bg-slate-50 transition">
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-slate-800 line-clamp-1">{a.title}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    <span className="px-2 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-medium">
                                        {a.category?.nom || '—'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    <span className="flex items-center gap-1 text-slate-500"><Eye size={13} />{a.views_count}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => toggleStatus(a)}
                                        className={'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition ' +
                                            (a.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-600' : 'bg-amber-100 text-amber-700 hover:bg-green-50 hover:text-green-600')}>
                                        {a.status === 'published' ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                                        {a.status === 'published' ? 'Publié' : 'Brouillon'}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => toggleFeatured(a)}>
                                        <Star size={18} className={a.is_featured ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Link href={`/admin/articles/${a.id}/edit`}
                                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-pink-600 hover:border-pink-200 transition">
                                            <Pencil size={14} />
                                        </Link>
                                        <button onClick={() => destroy(a)}
                                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 transition">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-12 text-slate-400">Aucun article trouvé.</div>
                )}
            </div>
        </AdminLayout>
    );
}