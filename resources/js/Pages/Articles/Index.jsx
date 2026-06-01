import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Search, BookOpen, Heart, Eye, Clock, Tag, ArrowRight, Share2 } from 'lucide-react';

const cats = ['Tous', 'Cycle menstruel', 'Grossesse', 'Ménopause', 'Santé sexuelle', 'Nutrition', 'Bien-être mental'];

const getCategoryName = (article) => article?.category?.nom || article?.category || 'Santé';

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [query, setQuery] = useState('');
    const [cat, setCat] = useState('Tous');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.axios.get('/api/v1/articles').then(r => {
            const data = Array.isArray(r.data) ? r.data : (r.data.data || []);
            setArticles(data);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const filtered = articles.filter(a => {
        const q = query.toLowerCase();
        const matchQ = !q || a.title?.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q);
        const matchC = cat === 'Tous' || getCategoryName(a) === cat;
        return matchQ && matchC;
    });

    const featured = filtered[0];
    const rest = filtered.slice(1);

    return (
        <AppLayout title='Articles de santé'>
            <div className='mb-6 space-y-4'>
                <div className='relative max-w-lg'>
                    <Search size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                    <input 
                        value={query} 
                        onChange={e => setQuery(e.target.value)} 
                        placeholder='Rechercher des articles...' 
                        className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all' 
                    />
                </div>
                <div className='flex gap-2 overflow-x-auto pb-1'>
                    {cats.map(c => (
                        <button 
                            key={c} 
                            onClick={() => setCat(c)} 
                            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                                cat === c 
                                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm' 
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-700'
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className='bg-white rounded-2xl border border-slate-200 shadow-sm p-6'>
                            <div className='w-3/4 h-4 bg-slate-100 rounded mb-3'></div>
                            <div className='h-3 bg-slate-100 rounded mb-2'></div>
                            <div className='h-3 bg-slate-100 rounded w-5/6'></div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div className='text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm'>
                    <BookOpen size={48} className='text-rose-200 mx-auto mb-4' />
                    <h3 className='text-lg font-bold text-slate-700 mb-2'>Aucun article trouvé</h3>
                    <p className='text-slate-500 text-sm'>Essayez une recherche différente.</p>
                </div>
            )}

            {!loading && featured && (
                <div className='mb-6'>
                    <Link 
                        href={'/articles/' + featured.id} 
                        className='bg-white rounded-2xl border border-slate-200 shadow-sm block group hover:shadow-md transition-all'
                    >
                        <div className='flex flex-col md:flex-row gap-6 p-6'>
                            <div className='w-full md:w-2/5 h-40 rounded-2xl flex items-center justify-center bg-gradient-to-br from-rose-500 to-rose-600'>
                                <BookOpen size={48} className='text-white/50' />
                            </div>
                            <div className='flex-1'>
                                <div className='flex items-center gap-2 mb-3'>
                                    <span className='px-3 py-1 rounded-full text-xs font-bold text-rose-800 bg-rose-100'>{getCategoryName(featured)}</span>
                                    <span className='text-xs text-slate-400'>Article vedette</span>
                                </div>
                                <h2 className='text-xl font-extrabold text-slate-900 mb-3 group-hover:text-rose-700 transition-colors leading-snug'>{featured.title}</h2>
                                <p className='text-slate-500 text-sm line-clamp-2 mb-4'>{featured.excerpt}</p>
                                <div className='flex items-center gap-4 text-xs text-slate-400'>
                                    <span className='flex items-center gap-1'><Eye size={13} />{featured.views_count || 0} vues</span>
                                    <span className='flex items-center gap-1'><Heart size={13} />{featured.likes_count || 0}</span>
                                    <span className='flex items-center gap-1'><Share2 size={13} />{featured.shares_count || 0}</span>
                                    <span className='flex items-center gap-1 text-rose-700 font-semibold'>Lire la suite <ArrowRight size={13} /></span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {!loading && rest.length > 0 && (
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {rest.map(a => (
                        <Link 
                            key={a.id} 
                            href={'/articles/' + a.id} 
                            className='bg-white rounded-2xl border border-slate-200 shadow-sm block group hover:shadow-md transition-all'
                        >
                            <div className='p-6'>
                                <div className='w-full h-28 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br from-rose-500 to-rose-600'>
                                    <BookOpen size={32} className='text-white/40' />
                                </div>
                                <span className='px-2.5 py-1 rounded-full text-xs font-bold text-rose-800 bg-rose-100'>{getCategoryName(a)}</span>
                                <h3 className='font-bold text-slate-900 mt-2 mb-2 group-hover:text-rose-700 transition-colors leading-snug line-clamp-2'>{a.title}</h3>
                                <p className='text-sm text-slate-500 line-clamp-2 mb-3'>{a.excerpt}</p>
                                <div className='flex items-center justify-between text-xs text-slate-400'>
                                    <span className='flex items-center gap-1'><Eye size={12} />{a.views_count || 0}</span>
                                    <span className='flex items-center gap-1'><Heart size={12} />{a.likes_count || 0}</span>
                                    <span className='flex items-center gap-1'><Share2 size={12} />{a.shares_count || 0}</span>
                                    <span className='text-rose-700 font-semibold flex items-center gap-1'>Lire <ArrowRight size={12} /></span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
