import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import { ChevronLeft, Save, Wand2, Globe } from 'lucide-react';

export default function ArticleForm() {
    const { auth, articleId } = usePage().props;
    const user = auth?.user;
    const isEdit = !!articleId;
    const id = articleId;

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

        if (isEdit && id) {
            window.axios.get(`/api/v1/articles/${id}`)
                .then(r => {
                    const data = r.data;
                    setForm({
                        ...data,
                        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
                    });
                });
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
                    `https://fr.wikipedia.org/api/rest_v1/page/mobile-sections/${encodeURIComponent(wikiTopic)}`
                );
                const fullData = await full.json();
                let content = '';
                if (fullData.lead && fullData.lead.sections) {
                    fullData.lead.sections.forEach(section => {
                        if (section.text) {
                            content += section.text;
                        }
                    });
                }
                if (fullData.remaining && fullData.remaining.sections) {
                    fullData.remaining.sections.slice(0, 6).forEach(section => {
                        if (section.text) {
                            content += `<h3 class="text-lg font-bold text-slate-900 mt-6 mb-3">${section.line}</h3>`;
                            content += section.text;
                        }
                    });
                }
                content += `<div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-6"><p><strong>⚠️ Information médicale</strong> : Cet article est fourni à titre éducatif uniquement. Il ne remplace pas l'avis d'un professionnel de santé. Source : <a href="https://fr.wikipedia.org/wiki/${encodeURIComponent(wikiTopic)}" target="_blank" class="text-amber-700 font-semibold underline">Wikipédia</a>.</p></div>`;
                
                setForm(f => ({
                    ...f,
                    title: data.title,
                    excerpt: data.extract?.slice(0, 300) + '...',
                    content: content,
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
        setSaving(true);
        setMsg(null);
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
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout user={user}>
            <Link href="/admin/articles" className="inline-flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-semibold mb-6">
                <ChevronLeft size={18} /> Retour aux articles
            </Link>

            <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                {isEdit ? 'Modifier l\'article' : 'Nouvel article'}
            </h2>

            {msg && (
                <div className={'mb-4 p-4 rounded-xl text-sm font-semibold ' + (msg.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200')}>
                    {msg.text}
                </div>
            )}

            {/* Wikipedia import */}
            {!isEdit && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                        <Globe size={18} /> Importer depuis Wikipédia
                    </h3>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input 
                            value={wikiTopic} 
                            onChange={e => setWikiTopic(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchWikipedia()}
                            placeholder="ex: Endométriose, Grossesse, Menstruation..."
                            className="flex-1 px-4 py-3 border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white" 
                        />
                        <button onClick={fetchWikipedia} disabled={fetching}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition shadow-sm">
                            {fetching ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Globe size={16} />}
                            Importer
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 max-w-4xl shadow-sm">
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Titre *</label>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition" />
                </div>

                {/* Category + Status */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Catégorie</label>
                        <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition">
                            <option value="">Choisir une catégorie...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Statut</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition">
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
                        rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition resize-none" />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Contenu</label>
                    <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                        rows={15} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition resize-none font-mono" />
                </div>

                {/* Tags + Read time */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (séparés par virgule)</label>
                        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                            placeholder="grossesse, santé, nutrition"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Temps de lecture (min)</label>
                        <input type="number" value={form.read_time} onChange={e => setForm({ ...form, read_time: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition" />
                    </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-rose-600" />
                        <span className="text-sm font-medium text-slate-700">À la une</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.is_premium} onChange={e => setForm({ ...form, is_premium: e.target.checked })} className="w-4 h-4 accent-rose-600" />
                        <span className="text-sm font-medium text-slate-700">Premium</span>
                    </label>
                </div>

                <button onClick={save} disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold py-3 rounded-xl transition shadow-sm disabled:opacity-50">
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                    {isEdit ? 'Enregistrer les modifications' : 'Créer l\'article'}
                </button>
            </div>
        </AdminLayout>
    );
}
