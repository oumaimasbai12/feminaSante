import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '@/Components/UI/GlassCard';
import { ArrowLeft, Tag, Clock, BookOpen, User, AlertTriangle } from 'lucide-react';

function PageSkeleton() {
    return (
        <div className="space-y-6 w-full animate-pulse">
            <div className="h-4 w-40 bg-brand-bg rounded" />
            <GlassCard className="p-8">
                <div className="w-full h-48 bg-brand-bg rounded-2xl mb-6" />
                <div className="h-8 w-3/4 bg-brand-bg rounded mb-4" />
                <div className="space-y-2">
                    <div className="h-3 bg-brand-bg rounded" />
                    <div className="h-3 bg-brand-bg rounded w-5/6" />
                    <div className="h-3 bg-brand-bg rounded w-4/6" />
                </div>
            </GlassCard>
        </div>
    );
}

export default function ArticleShow() {
    const { id } = usePage().props;
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        window.axios
            .get(`/api/v1/articles/${id}`)
            .then((response) => {
                setArticle(response.data);
                setError('');
            })
            .catch(() => {
                setArticle(null);
                setError('Impossible de charger cet article.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <AppLayout title="Article">
                <Head title="Article - FeminaSante" />
                <PageSkeleton />
            </AppLayout>
        );
    }

    if (!article) {
        return (
            <AppLayout title="Article">
                <Head title="Article - FeminaSante" />
                <GlassCard className="text-center py-16 w-full">
                    <AlertTriangle size={36} className="text-brand-border mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-brand-ink mb-2">Article introuvable</h3>
                    <p className="text-sm text-brand-muted mb-6">{error || 'Ce contenu n\'existe pas ou a été retiré.'}</p>
                    <Link href="/articles" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeft size={18} />
                        Retour aux articles
                    </Link>
                </GlassCard>
            </AppLayout>
        );
    }

    const authorName =
        article.author?.nom ||
        article.author?.name ||
        [article.author?.first_name, article.author?.last_name].filter(Boolean).join(' ') ||
        null;

    return (
        <AppLayout title={article.title}>
            <Head title={`${article.title} - FeminaSante`} />

            <div className="w-full space-y-6">
                <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 text-sm text-brand-primary font-semibold hover:opacity-80 transition-opacity"
                >
                    <ArrowLeft size={16} /> Retour aux articles
                </Link>

                <GlassCard className="p-6 sm:p-8 w-full">
                    <div className="w-full h-40 md:h-52 rounded-2xl mb-6 flex items-center justify-center bg-brand-bg border border-brand-border">
                        <BookOpen size={56} className="text-brand-primary/30" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {article.category && (
                            <span className="status-badge badge-completed">
                                {article.category?.nom || article.category?.name || 'Santé'}
                            </span>
                        )}
                        {article.tags?.map?.((t) => (
                            <span
                                key={t}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-bg border border-brand-border text-brand-muted"
                            >
                                <Tag size={10} />
                                {t}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-brand-ink mb-4 leading-tight">
                        {article.title}
                    </h1>

                    {article.excerpt && (
                        <p className="text-base md:text-lg text-brand-muted mb-6 leading-relaxed border-l-4 border-brand-primary/30 pl-4">
                            {article.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-brand-muted mb-6 pb-6 border-b border-brand-border">
                        {article.published_at && (
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {new Date(article.published_at).toLocaleDateString('fr-FR', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                        )}
                        {article.read_time && <span>{article.read_time} min de lecture</span>}
                        {authorName && (
                            <span className="flex items-center gap-1.5">
                                <User size={14} />
                                {authorName}
                            </span>
                        )}
                    </div>

                    {article.content ? (
                        <div
                            className="article-content max-w-none"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    ) : (
                        <p className="text-brand-muted">Contenu à venir…</p>
                    )}
                </GlassCard>
            </div>
        </AppLayout>
    );
}
