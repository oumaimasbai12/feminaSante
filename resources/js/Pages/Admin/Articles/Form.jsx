import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import { ChevronLeft, Save, Wand2, Globe } from 'lucide-react';

export default function ArticleForm() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const parts = window.location.pathname.split('/');
    const isEdit = parts.includes('edit');
    const id = isEdit ? parts[parts.indexOf('edit') - 1] : null;

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        title: '', excerpt: '', content: '', category_id: '',
        tags: '', status: 'draft', is_featured: false, is_premium: false, read_time: 3,
    });
    const [saving, setSaving] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [wikiTopic, setWikiTopic] = useState('');
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        window.axios.get('/api/v1/article-categories')
            .then(r => setCategories(Array.isArray(r.data) ? r.data : (r.data.data || [])));

        if (isEdit) {
            window.axios.get(`/api/v1/articles/${id}`)
                .then(r => setForm({
                    ...r.data,
                    tags: Array.isArray(r.data.tags) ? r.data.tags.join(', ') : '',
                }));
        }
    }, [id]);

    const fetchWikipedia = async () => {
        if (!wikiTopic.trim()) return;
        setFetching(true);
        try {
            const search = await fetch(
                `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTopic)}`
            );
            const data = await search.json();
            if (data.title) {
                const full = await fetch(
                    `https://fr.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(wikiTopic)}`
                );
                const html = await full.text();
                setForm(f => ({
                    ...f,
                    title: data.title,
                    excerpt: data.extract?.slice(0, 300) + '...',
                    content: `<p class="lead">${data.extract}</p>\n\n<div class="disclaimer bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6"><p><strong>⚠️ Information médicale</strong> : Cet article est fourni à titre éducatif uniquement. Il ne remplace pas l'avis d'un professionnel de santé. Source : <a href="https://fr.wikipedia.org/wiki/${encodeURIComponent(wikiTopic)}" target="_blank">Wikipédia</a>.</p></div>`,
                    read_time: Math.ceil((data.extract?.split(' ').length || 100) / 200),
                }));
                setMsg({ ok: true, text: `Article "${data.title}" importé depuis Wikipédia !` });
            } else {
                setMsg({ ok: false, text: 'Sujet introuvable sur Wikipédia.' });
            }
        } catch {
            setMsg({ ok: false, text: 'Erreur lors de la récupération Wikipédia.' });
        } finally {
            setFetching(false);
            setTimeout(() => setMsg(null), 4000);
        }
    };

    const save = async () => {
        setSaving(true); setMsg(null);
        try {
            const payload = {
                ...form,
                tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            };
            if (isEdit) {
                await window.axios.put(`/api/v1/admin/articles/${id}`, payload);
                setMsg({ ok: true, text: 'Article mis à jour !' });
            } else {
                await window.axios.post('/api/v1/articles', payload);
                setMsg({ ok: true, text: 'Article créé !' });
                setTimeout(() => router.visit('/admin/articles'), 1200);
            }
        } catch (e) {
            const errors = e.response?.data?.errors;
            const first = errors ? Object.values(errors)[0][0] : (e.response?.data?.message || 'Erreur.');
            setMsg({ ok: false, text: first });
        } finally { setSaving(false); }
    };

    return (
        <AdminLayout user={user}>
            <Link href="/admin/articles" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-semibold mb-6">
                <ChevronLeft size={18} /> Retour aux articles
            </Link>

            <h2 className="text-xl font-extrabold text-slate-800 mb-6">
                {isEdit ? 'Modifier l\'article' : 'Nouvel article'}
            </h2>

            {msg && (
                <div className={'mb-4 p-4 rounded-lg text-sm font-semibold ' + (msg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                    {msg.text}
                </div>
            )}

            {/* Wikipedia import */}
            {!isEdit && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                        <Globe size={18} /> Importer depuis Wikipédia
                    </h3>
                    <div className="flex gap-3">
                        <input value={wikiTopic} onChange={e => setWikiTopic(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchWikipedia()}
                            placeholder="ex: Endométriose, Grossesse, Menstruation..."
                            className="flex-1 px-4 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white" />
                        <button onClick={fetchWikipedia} disabled={fetching}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                            {fetching ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Globe size={16} />}
                            Importer
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 max-w-4xl">
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Titre *</label>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>

                {/* Category + Status */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Catégorie</label>
                        <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300">
                            <option value="">Choisir une catégorie...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Statut</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300">
                            <option value="draft">Brouillon</option>
                            <option value="published">Publié</option>
                            <option value="archived">Archivé</option>
                        </select>
                    </div>
                </div>

                {/* Excerpt */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Extrait</label>
                    <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
                        rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Contenu</label>
                    <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                        rows={12} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none font-mono" />
                </div>

                {/* Tags + Read time */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (séparés par virgule)</label>
                        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                            placeholder="grossesse, santé, nutrition"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Temps de lecture (min)</label>
                        <input type="number" value={form.read_time} onChange={e => setForm({ ...form, read_time: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                    </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
                        <span className="text-sm font-medium text-slate-700">À la une</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.is_premium} onChange={e => setForm({ ...form, is_premium: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
                        <span className="text-sm font-medium text-slate-700">Premium</span>
                    </label>
                </div>

                <button onClick={save} disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition">
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                    {isEdit ? 'Enregistrer les modifications' : 'Créer l\'article'}
                </button>
            </div>
        </AdminLayout>
    );
}