import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '@/Components/UI/GlassCard';
import StatTile from '@/Components/UI/StatTile';
import { Search, BookOpen, ArrowRight, Tag, Sparkles } from 'lucide-react';

const getCategoryName = (article) =>
    article?.category?.nom || article?.category?.name || article?.category || 'Santé';

function ArticleThumb({ large = false }) {
    return (
        <div
            className={`flex items-center justify-center bg-brand-bg border border-brand-border shrink-0 ${
                large ? 'w-full md:w-2/5 h-40 rounded-2xl' : 'w-full h-28 rounded-xl mb-4'
            }`}
        >
            <BookOpen size={large ? 40 : 28} className="text-brand-primary/35" />
        </div>
    );
}

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [query, setQuery] = useState('');
    const [cat, setCat] = useState('Tous');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.axios
            .get('/api/v1/articles')
            .then((r) => {
                const data = Array.isArray(r.data) ? r.data : r.data.data || [];
                setArticles(data);
            })
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    }, []);

    const published = useMemo(
        () => articles.filter((a) => !a.status || a.status === 'published'),
        [articles],
    );

    const categories = useMemo(() => {
        const names = [...new Set(published.map(getCategoryName).filter(Boolean))];
        return ['Tous', ...names.sort((a, b) => a.localeCompare(b, 'fr'))];
    }, [published]);

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        return published.filter((a) => {
            const matchQ =
                !q ||
                a.title?.toLowerCase().includes(q) ||
                a.excerpt?.toLowerCase().includes(q) ||
                getCategoryName(a).toLowerCase().includes(q);
            const matchC = cat === 'Tous' || getCategoryName(a) === cat;
            return matchQ && matchC;
        });
    }, [published, query, cat]);

    const featured = useMemo(() => {
        const fromFiltered = filtered.find((a) => a.is_featured);
        if (fromFiltered) return fromFiltered;
        if (cat !== 'Tous' || query.trim()) return filtered[0] || null;
        return published.find((a) => a.is_featured) || filtered[0] || null;
    }, [filtered, published, cat, query]);

    const rest = useMemo(
        () => filtered.filter((a) => a.id !== featured?.id),
        [filtered, featured],
    );

    const formatDate = (iso) => {
        if (!iso) return null;
        return new Date(iso).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout title="Articles de santé">
            <Head title="Articles de santé - FeminaSante" />

            <p className="text-brand-muted text-sm mb-6">
                Conseils et informations rédigés par des professionnels de santé — cycle, grossesse,
                ménopause et bien-être.
            </p>

            {!loading && published.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatTile label="Articles" value={published.length} sub="publiés" icon={BookOpen} />
                    <StatTile label="Catégories" value={categories.length - 1} sub="thématiques" icon={Tag} />
                    <StatTile
                        label="Résultats"
                        value={filtered.length}
                        sub={query || cat !== 'Tous' ? 'filtre actif' : 'affichés'}
                        icon={Search}
                    />
                    <StatTile
                        label="À la une"
                        value={published.some((a) => a.is_featured) ? '1' : '—'}
                        sub="article vedette"
                        icon={Sparkles}
                    />
                </div>
            )}

            <div className="mb-6 space-y-4">
                <div className="relative w-full">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
                    />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher par titre, résumé ou catégorie…"
                        className="input-field pl-11 w-full"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {categories.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setCat(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${
                                cat === c
                                    ? 'bg-brand-soft text-brand-primary border-brand-primary/25'
                                    : 'glass-card text-brand-muted border-transparent hover:text-brand-primary hover:border-brand-primary/20'
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <GlassCard key={i} className="p-6 animate-pulse">
                            <div className="w-full h-28 bg-brand-bg rounded-xl mb-4" />
                            <div className="w-3/4 h-4 bg-brand-bg rounded mb-3" />
                            <div className="h-3 bg-brand-bg rounded mb-2" />
                            <div className="h-3 bg-brand-bg rounded w-5/6" />
                        </GlassCard>
                    ))}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <GlassCard className="text-center py-16 w-full">
                    <BookOpen size={40} className="text-brand-border mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-brand-ink mb-2">Aucun article trouvé</h3>
                    <p className="text-brand-muted text-sm mb-4">
                        {published.length === 0
                            ? 'Aucun article publié pour le moment.'
                            : 'Essayez une autre recherche ou catégorie.'}
                    </p>
                    {(query || cat !== 'Tous') && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setCat('Tous');
                            }}
                            className="btn-secondary text-sm"
                        >
                            Réinitialiser les filtres
                        </button>
                    )}
                </GlassCard>
            )}

            {!loading && featured && (
                <div className="mb-6">
                    <Link
                        href={`/articles/${featured.id}`}
                        className="glass-card block group hover:border-brand-primary/30 transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row gap-6 p-6">
                            <ArticleThumb large />
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="status-badge badge-completed">
                                        {getCategoryName(featured)}
                                    </span>
                                    {featured.is_featured && (
                                        <span className="text-xs font-semibold text-brand-primary flex items-center gap-1">
                                            <Sparkles size={12} /> À la une
                                        </span>
                                    )}
                                    {featured.published_at && (
                                        <span className="text-xs text-brand-muted">
                                            {formatDate(featured.published_at)}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-brand-ink mb-3 group-hover:text-brand-primary transition-colors leading-snug">
                                    {featured.title}
                                </h2>
                                <p className="text-brand-muted text-sm line-clamp-3 mb-4">
                                    {featured.excerpt}
                                </p>
                                <span className="inline-flex items-center gap-1 text-sm text-brand-primary font-semibold">
                                    Lire l&apos;article <ArrowRight size={14} />
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {!loading && rest.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rest.map((a) => (
                        <Link
                            key={a.id}
                            href={`/articles/${a.id}`}
                            className="glass-card block group hover:border-brand-primary/30 transition-all duration-300 h-full"
                        >
                            <div className="p-5 flex flex-col h-full">
                                <ArticleThumb />
                                <span className="status-badge badge-inactive w-fit">
                                    {getCategoryName(a)}
                                </span>
                                <h3 className="font-bold text-brand-ink mt-2 mb-2 group-hover:text-brand-primary transition-colors leading-snug line-clamp-2 text-sm">
                                    {a.title}
                                </h3>
                                <p className="text-sm text-brand-muted line-clamp-2 mb-3 flex-1">
                                    {a.excerpt}
                                </p>
                                <div className="flex items-center justify-between text-xs mt-auto pt-2 border-t border-brand-border">
                                    {a.published_at ? (
                                        <span className="text-brand-muted">{formatDate(a.published_at)}</span>
                                    ) : (
                                        <span />
                                    )}
                                    <span className="text-brand-primary font-semibold flex items-center gap-1">
                                        Lire <ArrowRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
