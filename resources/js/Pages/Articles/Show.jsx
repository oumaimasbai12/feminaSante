import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { ArrowLeft, Heart, Eye, Share2, MessageCircle, Send, Tag, Clock } from 'lucide-react';

export default function ArticleShow() {
    const { id } = usePage().props;
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(()=>{
        if(!id) return;
        window.axios.get('/api/v1/articles/'+id).then(r=>{
            setArticle(r.data);
        }).catch(()=>{}).finally(()=>setLoading(false));
    },[id]);

    const sendComment = async () => {
        if(!comment.trim()) return;
        try {
            const r = await window.axios.post('/api/v1/articles/'+id+'/comments', {content:comment});
            setComments([...comments, r.data]);
            setComment('');
        } catch(e) {}
    };

    if(loading) return <AppLayout><div className='flex justify-center py-20'><div className='w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin'></div></div></AppLayout>;
    if(!article) return <AppLayout><div className='text-center py-20 card max-w-lg mx-auto'><h3 className='text-xl font-bold text-gray-700'>Article not found</h3><Link href='/articles' className='btn-primary mt-4 inline-flex'>Back to Articles</Link></div></AppLayout>;

    return (
        <AppLayout title={article.title}>
            <div className='max-w-3xl mx-auto'>
                <Link href='/articles' className='inline-flex items-center gap-2 text-pink-600 font-semibold mb-6 hover:text-pink-700 transition-colors'><ArrowLeft size={18}/>Back to Articles</Link>
                <div className='card mb-6'>
                    <div className='w-full h-48 rounded-2xl mb-6 flex items-center justify-center' style={{background:'linear-gradient(135deg,#be185d,#7e22ce)'}}>
                        <div className='text-6xl text-white opacity-30'>📚</div>
                    </div>
                    <div className='flex items-center gap-3 mb-4'>
                        {article.category&&<span className='px-3 py-1 rounded-full text-xs font-bold text-pink-700 bg-pink-100'>{article.category}</span>}
                        {article.tags&&article.tags.map&&article.tags.map(t=><span key={t} className='flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700'><Tag size={10}/>{t}</span>)}
                    </div>
                    <h1 className='text-2xl lg:text-3xl font-extrabold text-gray-900 mb-4 leading-tight'>{article.title}</h1>
                    {article.excerpt&&<p className='text-lg text-gray-500 mb-6 leading-relaxed italic border-l-4 border-pink-200 pl-4'>{article.excerpt}</p>}
                    <div className='flex items-center gap-6 text-sm text-gray-400 mb-6 pb-6 border-b border-pink-50'>
                        {article.views_count!==undefined&&<span className='flex items-center gap-1.5'><Eye size={15}/>{article.views_count} views</span>}
                        {article.likes_count!==undefined&&<span className='flex items-center gap-1.5'><Heart size={15}/>{article.likes_count} likes</span>}
                        {article.publish_date&&<span className='flex items-center gap-1.5'><Clock size={15}/>{new Date(article.publish_date).toLocaleDateString('en',{month:'long',day:'numeric',year:'numeric'})}</span>}
                    </div>
                    {article.content ? (
                        <div className='prose max-w-none text-gray-700 leading-relaxed' dangerouslySetInnerHTML={{__html:article.content}}/>
                    ) : (
                        <p className='text-gray-500'>Content coming soon...</p>
                    )}
                </div>
                {/* Actions */}
                <div className='flex gap-3 mb-6'>
                    <button onClick={()=>setLiked(!liked)} className={'flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border-2 transition-all '+(liked?'border-pink-500 bg-pink-50 text-pink-700':'border-gray-200 text-gray-600 hover:border-pink-300')}>
                        <Heart size={17} className={liked?'fill-pink-500 text-pink-500':''}/>{liked?'Liked':'Like'}
                    </button>
                    <button className='flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-all'><Share2 size={17}/>Share</button>
                </div>
                {/* Comments */}
                <div className='card'>
                    <h3 className='font-bold text-gray-900 mb-5 flex items-center gap-2'><MessageCircle size={20} className='text-pink-500'/>Comments</h3>
                    <div className='flex gap-3 mb-6'>
                        <div className='w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm' style={{background:'linear-gradient(135deg,#EC4899,#A855F7)'}}>U</div>
                        <div className='flex-1 flex gap-2'>
                            <input value={comment} onChange={e=>setComment(e.target.value)} placeholder='Add a comment...' className='input-field flex-1' onKeyDown={e=>e.key==='Enter'&&sendComment()}/>
                            <button onClick={sendComment} className='w-11 h-11 rounded-xl flex items-center justify-center text-white' style={{background:'linear-gradient(135deg,#EC4899,#A855F7)'}}><Send size={16}/></button>
                        </div>
                    </div>
                    {comments.length===0&&<p className='text-center text-gray-400 text-sm py-6'>Be the first to comment!</p>}
                    {comments.map((c,i)=>(
                        <div key={i} className='flex gap-3 mb-4 pb-4 border-b border-pink-50 last:border-0'>
                            <div className='w-9 h-9 rounded-full bg-pink-100 flex-shrink-0 flex items-center justify-center text-pink-600 font-bold text-sm'>U</div>
                            <div><div className='font-semibold text-gray-800 text-sm'>User</div><p className='text-gray-600 text-sm mt-1'>{c.content}</p></div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
