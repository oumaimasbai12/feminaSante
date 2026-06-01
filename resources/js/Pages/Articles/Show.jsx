import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { ArrowLeft, Heart, Eye, Share2, MessageCircle, Send, Tag, Clock, BookOpen } from 'lucide-react';

export default function ArticleShow() {
    const { id } = usePage().props;
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [sharesCount, setSharesCount] = useState(0);
    const [viewsCount, setViewsCount] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [sendingComment, setSendingComment] = useState(false);
    const [liking, setLiking] = useState(false);
    const [sharing, setSharing] = useState(false);

    // Load article
    const loadArticle = async () => {
        if (!id) return;
        try {
            const response = await window.axios.get(`/api/v1/articles/${id}`);
            const data = response.data;
            setArticle(data);
            setLiked(data.is_liked || false);
            setLikesCount(data.likes_count || 0);
            setSharesCount(data.shares_count || 0);
            setViewsCount(data.views_count || 0);
            setComments(data.comments || []);
        } catch (err) {
            console.error('Failed to load article', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticle();
    }, [id]);

    // Handle Like
    const handleLike = async () => {
        if (liking) return;
        setLiking(true);
        try {
            const response = await window.axios.post(`/api/v1/articles/${id}/like`);
            setLiked(response.data.is_liked);
            setLikesCount(response.data.likes_count);
        } catch (e) {
            console.error('Failed to like article', e);
        } finally {
            setLiking(false);
        }
    };

    // Handle Share
    const handleShare = async () => {
        if (sharing) return;
        setSharing(true);
        try {
            // First increment in DB
            await window.axios.post(`/api/v1/articles/${id}/share`);
            
            // Then use native share if available, else copy link
            if (navigator.share) {
                await navigator.share({
                    title: article?.title,
                    text: article?.excerpt,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Lien copié dans le presse-papiers !');
            }
            
            setSharesCount(prev => prev + 1);
        } catch (e) {
            console.error('Failed to share', e);
        } finally {
            setSharing(false);
        }
    };

    // Handle Send Comment
    const handleSendComment = async () => {
        if (!comment.trim() || sendingComment) return;
        setSendingComment(true);
        try {
            const response = await window.axios.post(`/api/v1/articles/${id}/comments`, {
                content: comment.trim()
            });
            
            const newComment = response.data.comment;
            setComments([...comments, newComment]);
            setComment('');
        } catch (e) {
            console.error('Failed to send comment', e);
        } finally {
            setSendingComment(false);
        }
    };

    if (loading) return (
        <AppLayout>
            <div className='flex justify-center py-20'>
                <div className='w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin'></div>
            </div>
        </AppLayout>
    );

    if (!article) return (
        <AppLayout>
            <div className='text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto'>
                <h3 className='text-lg font-bold text-slate-700'>Article not found</h3>
                <Link href='/articles' className='px-6 py-3 mt-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm inline-flex items-center gap-2'>
                    <ArrowLeft size={18} />
                    Back to Articles
                </Link>
            </div>
        </AppLayout>
    );

    return (
        <AppLayout title={article.title}>
            <div className='max-w-4xl mx-auto'>
                <Link 
                    href='/articles' 
                    className='inline-flex items-center gap-2 text-rose-700 font-semibold mb-6 hover:text-rose-800 transition-colors'
                >
                    <ArrowLeft size={18} />Retour aux articles
                </Link>
                
                <div className='bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6'>
                    <div className='w-full h-48 md:h-56 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br from-rose-500 to-rose-600'>
                        <BookOpen size={64} className='text-white/30' />
                    </div>

                    <div className='flex flex-wrap items-center gap-2 mb-4'>
                        {article.category && (
                            <span className='px-3 py-1 rounded-full text-xs font-bold text-rose-800 bg-rose-100'>
                                {article.category?.nom || article.category?.name || ''}
                            </span>
                        )}
                        {article.tags && article.tags.map && article.tags.map(t => (
                            <span key={t} className='flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700'>
                                <Tag size={10} />{t}
                            </span>
                        ))}
                    </div>

                    <h1 className='text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight'>
                        {article.title}
                    </h1>

                    {article.excerpt && (
                        <p className='text-lg text-slate-600 mb-6 leading-relaxed italic border-l-4 border-rose-300 pl-4'>
                            {article.excerpt}
                        </p>
                    )}

                    <div className='flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6 pb-6 border-b border-slate-100'>
                        <span className='flex items-center gap-1.5'>
                            <Eye size={14} />
                            {viewsCount} vues
                        </span>
                        <span className='flex items-center gap-1.5'>
                            <Heart size={14} />
                            {likesCount} likes
                        </span>
                        {article.published_at && (
                            <span className='flex items-center gap-1.5'>
                                <Clock size={14} />
                                {new Date(article.published_at).toLocaleDateString('fr', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        )}
                        {article.read_time && (
                            <span className='flex items-center gap-1.5'>
                                {article.read_time} min de lecture
                            </span>
                        )}
                    </div>

                    {article.content ? (
                        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
                    ) : (
                        <p className='text-slate-500'>Content coming soon...</p>
                    )}
                </div>

                <div className='flex gap-3 mb-6'>
                    <button 
                        onClick={handleLike}
                        disabled={liking}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                            liked 
                                ? 'border-rose-500 bg-rose-50 text-rose-800' 
                                : 'border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-700'
                        } disabled:opacity-50`}
                    >
                        <Heart size={17} className={liked ? 'fill-rose-500 text-rose-500' : ''} />
                        {liked ? 'Aimé' : 'Aimer'}
                    </button>
                    <button 
                        onClick={handleShare}
                        disabled={sharing}
                        className='flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-700 transition-all disabled:opacity-50'
                    >
                        <Share2 size={17} />Partager {sharesCount > 0 && `(${sharesCount})`}
                    </button>
                </div>

                <div className='bg-white rounded-2xl border border-slate-200 shadow-sm p-8'>
                    <h3 className='font-bold text-slate-900 mb-5 flex items-center gap-2'>
                        <MessageCircle size={20} className='text-rose-600' />
                        Commentaires ({comments.length})
                    </h3>
                    <div className='flex gap-3 mb-6'>
                        <div 
                            className='w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm bg-gradient-to-r from-rose-500 to-rose-600'
                        >
                            U
                        </div>
                        <div className='flex-1 flex gap-2'>
                            <input 
                                value={comment} 
                                onChange={e => setComment(e.target.value)} 
                                placeholder='Ajouter un commentaire...' 
                                className='flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all' 
                                onKeyDown={e => e.key === 'Enter' && handleSendComment()} 
                            />
                            <button 
                                onClick={handleSendComment}
                                disabled={!comment.trim() || sendingComment}
                                className='w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 transition-all disabled:opacity-50'
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                    {comments.length === 0 && (
                        <p className='text-center text-slate-400 text-sm py-6'>Soyez le premier à commenter !</p>
                    )}
                    {comments.map((c, i) => (
                        <div key={i} className='flex gap-3 mb-4 pb-4 border-b border-slate-100 last:border-0'>
                            <div className='w-10 h-10 rounded-full bg-rose-100 flex-shrink-0 flex items-center justify-center text-rose-700 font-bold text-sm'>
                                {c.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <div className='font-semibold text-slate-800 text-sm'>
                                    {c.user?.name || 'Utilisateur'}
                                </div>
                                <p className='text-slate-600 text-sm mt-1'>{c.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
