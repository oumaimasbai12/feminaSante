import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import { ChevronLeft, Save, Globe } from 'lucide-react';

export default function ArticleForm() {
    const { articleId } = usePage().props;
    const isEdit = !!articleId;
    const id = articleId;

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        title: '', excerpt: '', content: '', category_id: '',
        tags: '',
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
                    const { read_time: _readTime, ...data } = r.data;
                    setForm({
                        ...data,
                        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
                    });
                });
        }
    }, [id, isEdit]);

    const fetchWikipedia = async () => {
        if (!wikiTopic.trim()) return;
        setFetching(true);
        setMsg(null);
        try {
            const { data: res } = await window.axios.get('/api/v1/admin/wikipedia-import', {
                params: { topic: wikiTopic.trim() },
            });
            const data = res.data;
            setForm(f => ({
                ...f,
                title: data.title,
                excerpt: data.excerpt,
                content: data.content,
            }));
            setMsg({ ok: true, text: `Article "${data.title}" importé depuis Wikipédia !` });
        } catch (e) {
            const message = e.response?.status === 404
                ? 'Sujet introuvable sur Wikipédia.'
                : (e.response?.data?.message || 'Erreur lors de la récupération Wikipédia.');
            setMsg({ ok: false, text: message });
        } finally {
            setFetching(false);
            setTimeout(() => setMsg(null), 4000);
        }
    };

    const validateForm = () => {
        if (!form.title.trim()) return 'Le titre est obligatoire.';
        if (!form.category_id) return 'La catégorie est obligatoire.';
        if (!form.excerpt.trim()) return "L'extrait est obligatoire.";
        if (!form.content.trim()) return 'Le contenu est obligatoire.';
        if (!form.tags.trim()) return 'Les tags sont obligatoires.';
        return null;
    };

    const save = async () => {
        const validationError = validateForm();
        if (validationError) {
            setMsg({ ok: false, text: validationError });
            return;
        }

        setSaving(true);
        setMsg(null);
        try {
            const payload = {
                ...form,
                tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                status: 'published',
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
        <AdminLayout title={isEdit ? 'Modifier l\'article' : 'Nouvel article'}>
            <Link href="/admin/articles" className="inline-flex items-center gap-2 text-sm text-brand-primary hover:opacity-80 font-semibold mb-6 transition-opacity">
                <ChevronLeft size={18} /> Retour aux contenus
            </Link>

            {msg && (
                <div className={'mb-4 p-4 rounded-xl text-sm font-semibold ' + (msg.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200')}>
                    {msg.text}
                </div>
            )}

            {!isEdit && (
                <div className="glass-card p-5 mb-6 border-brand-border">
                    <h3 className="font-bold text-brand-ink mb-1 flex items-center gap-2 text-sm">
                        <Globe size={18} className="text-brand-primary" /> Importer depuis Wikipédia
                    </h3>
                    <p className="text-xs text-brand-muted mb-3">Pré-remplit titre, extrait et contenu à partir d&apos;un article Wikipédia.</p>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            value={wikiTopic}
                            onChange={e => setWikiTopic(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchWikipedia()}
                            placeholder="ex: Endométriose, Grossesse, Menstruation..."
                            className="input-field flex-1"
                        />
                        <button type="button" onClick={fetchWikipedia} disabled={fetching} className="btn-primary shrink-0">
                            {fetching ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Globe size={16} />}
                            Importer
                        </button>
                    </div>
                </div>
            )}

            <form
                className="glass-card p-6 space-y-5 max-w-4xl"
                noValidate
                onSubmit={e => {
                    e.preventDefault();
                    save();
                }}
            >
                <div>
                    <label className="block text-sm font-semibold text-brand-ink mb-2">Titre *</label>
                    <input
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="input-field"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-brand-ink mb-2">Catégorie *</label>
                    <select
                        value={form.category_id}
                        onChange={e => setForm({ ...form, category_id: e.target.value })}
                        className="input-field"
                        required
                    >
                        <option value="">Choisir une catégorie...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-brand-ink mb-2">Extrait *</label>
                    <textarea
                        value={form.excerpt}
                        onChange={e => setForm({ ...form, excerpt: e.target.value })}
                        rows={3}
                        className="input-field resize-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-brand-ink mb-2">Contenu *</label>
                    <textarea
                        value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })}
                        rows={15}
                        className="input-field resize-none font-mono"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-brand-ink mb-2">Tags (séparés par virgule) *</label>
                    <input
                        value={form.tags}
                        onChange={e => setForm({ ...form, tags: e.target.value })}
                        placeholder="grossesse, santé, nutrition"
                        className="input-field"
                        required
                    />
                </div>
                <button type="submit" disabled={saving} className="w-full btn-primary">
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                    {isEdit ? 'Enregistrer les modifications' : 'Créer l\'article'}
                </button>
            </form>
        </AdminLayout>
    );
}
