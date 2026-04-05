import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Search, BookOpen, Heart, Eye, Clock, Tag, ArrowRight } from 'lucide-react';

const cats = ['All','Cycle Health','Pregnancy','Nutrition','Mental Health','Fitness','Hormones','Fertility'];

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [query, setQuery] = useState('');
    const [cat, setCat] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.axios.get('/api/v1/articles').then(r=>{
            const data = Array.isArray(r.data)?r.data:(r.data.data||[]);
            setArticles(data);
        }).catch(()=>{}).finally(()=>setLoading(false));
    }, []);

    const filtered = articles.filter(a => {
        const q = query.toLowerCase();
        const matchQ = !q || a.title?.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q);
        const matchC = cat==='All' || a.category===cat;
        return matchQ && matchC;
    });

    const featured = filtered[0];
    const rest = filtered.slice(1);

    return (
        <AppLayout title='Health Articles'>
            {/* Search + filter */}
            <div className='mb-6 space-y-4'>
                <div className='relative max-w-lg'>
                    <Search size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'/>
                    <input value={query} onChange={e=>setQuery(e.target.value)} placeholder='Search articles...' className='input-field pl-11 bg-white'/>
                </div>
                <div className='flex gap-2 overflow-x-auto pb-1'>
                    {cats.map(c=>(
                        <button key={c} onClick={()=>setCat(c)} className={'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all '+(cat===c?'text-white shadow-sm':'bg-white border border-pink-100 text-gray-600 hover:border-pink-300 hover:text-pink-600')} style={cat===c?{background:'linear-gradient(135deg,#EC4899,#A855F7)'}:{}}>{c}</button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {[...Array(6)].map((_,i)=>(
                        <div key={i} className='card'>
                            <div className='skeleton h-4 rounded mb-3 w-3/4'></div>
                            <div className='skeleton h-3 rounded mb-2'></div>
                            <div className='skeleton h-3 rounded w-5/6'></div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div className='text-center py-16 card'>
                    <BookOpen size={48} className='text-pink-200 mx-auto mb-4'/>
                    <h3 className='text-lg font-bold text-gray-700 mb-2'>No articles found</h3>
                    <p className='text-gray-500 text-sm'>Try a different search or category filter.</p>
                </div>
            )}

            {!loading && featured && (
                <div className='mb-6'>
                    <Link href={'/articles/'+featured.id} className='card card-hover block group'>
                        <div className='flex flex-col md:flex-row gap-6'>
                            <div className='w-full md:w-2/5 h-40 rounded-2xl flex items-center justify-center' style={{background:'linear-gradient(135deg,#be185d,#6b21a8)'}}>
                                <BookOpen size={48} className='text-white/50'/>
                            </div>
                            <div className='flex-1'>
                                <div className='flex items-center gap-2 mb-3'>
                                    <span className='px-3 py-1 rounded-full text-xs font-bold text-pink-700 bg-pink-100'>{featured.category||'Featured'}</span>
                                    <span className='text-xs text-gray-400'>Featured Article</span>
                                </div>
                                <h2 className='text-xl font-extrabold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors leading-snug'>{featured.title}</h2>
                                <p className='text-gray-500 text-sm line-clamp-2 mb-4'>{featured.excerpt}</p>
                                <div className='flex items-center gap-4 text-xs text-gray-400'>
                                    <span className='flex items-center gap-1'><Eye size={13}/>{featured.views_count||0} views</span>
                                    <span className='flex items-center gap-1'><Heart size={13}/>{featured.likes_count||0}</span>
                                    <span className='flex items-center gap-1 text-pink-600 font-semibold'>Read more <ArrowRight size={13}/></span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {!loading && rest.length > 0 && (
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {rest.map(a=>(
                        <Link key={a.id} href={'/articles/'+a.id} className='card card-hover group block'>
                            <div className='w-full h-28 rounded-xl mb-4 flex items-center justify-center' style={{background:'linear-gradient(135deg,'+(a.category==='Pregnancy'?'#be185d,#7e22ce':'#9d174d,#4c1d95')+')'}}>
                                <BookOpen size={32} className='text-white/40'/>
                            </div>
                            <span className='px-2.5 py-1 rounded-full text-xs font-bold text-pink-700 bg-pink-100'>{a.category||'Health'}</span>
                            <h3 className='font-bold text-gray-900 mt-2 mb-2 group-hover:text-pink-600 transition-colors leading-snug line-clamp-2'>{a.title}</h3>
                            <p className='text-sm text-gray-500 line-clamp-2 mb-3'>{a.excerpt}</p>
                            <div className='flex items-center justify-between text-xs text-gray-400'>
                                <span className='flex items-center gap-1'><Eye size={12}/>{a.views_count||0}</span>
                                <span className='flex items-center gap-1'><Heart size={12}/>{a.likes_count||0}</span>
                                <span className='text-pink-600 font-semibold flex items-center gap-1'>Read <ArrowRight size={12}/></span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
