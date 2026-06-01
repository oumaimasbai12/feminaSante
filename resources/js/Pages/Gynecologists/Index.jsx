import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Search, MapPin, Star, Phone, Video, Clock, Calendar, Award, ChevronRight } from 'lucide-react';

export default function Gynecologists() {
    const [docs, setDocs] = useState([]);
    const [query, setQuery] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.axios.get('/api/v1/gynecologists').then(r => {
            const d = Array.isArray(r.data) ? r.data : (r.data.data || []);
            setDocs(d);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const filtered = docs.filter(d => {
        const q = query.toLowerCase();
        const mq = !q || d.first_name?.toLowerCase().includes(q) || d.last_name?.toLowerCase().includes(q) || d.speciality?.toLowerCase().includes(q);
        const mc = !city || d.city?.toLowerCase().includes(city.toLowerCase());
        return mq && mc;
    });

    return (
        <AppLayout title='Trouver un gynécologue'>
            {/* Search bar */}
            <div className='mb-6 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm'>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='relative'>
                        <Search size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                        <input 
                            value={query} 
                            onChange={e => setQuery(e.target.value)} 
                            placeholder='Rechercher par nom ou spécialité...' 
                            className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all pl-11' 
                        />
                    </div>
                    <div className='relative'>
                        <MapPin size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                        <input 
                            value={city} 
                            onChange={e => setCity(e.target.value)} 
                            placeholder='Ville...' 
                            className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all pl-11' 
                        />
                    </div>
                </div>
            </div>

            {loading && (
                <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className='p-5 bg-white rounded-2xl border border-slate-200 shadow-sm'>
                            <div className='h-4 rounded mb-3 w-2/3 bg-slate-100'></div>
                            <div className='h-3 rounded mb-2 w-1/2 bg-slate-100'></div>
                            <div className='h-3 rounded w-3/4 bg-slate-100'></div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div className='text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm'>
                    <div className='text-5xl mb-4'>👩‍⚕️</div>
                    <h3 className='text-lg font-bold text-slate-900 mb-2'>Aucun gynécologue trouvé</h3>
                    <p className='text-slate-500 text-sm'>Essayez d'ajuster vos filtres.</p>
                </div>
            )}

            <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>
                {filtered.map(doc => (
                    <div key={doc.id} className='p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-shadow group'>
                        <div className='flex items-start gap-4 mb-4'>
                            <div className='w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 bg-gradient-to-br from-rose-500 to-rose-600'>
                                {(doc.first_name || 'D').charAt(0)}{(doc.last_name || 'R').charAt(0)}
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h3 className='font-bold text-slate-900 group-hover:text-rose-700 transition-colors'>Dr. {doc.first_name} {doc.last_name}</h3>
                                <p className='text-sm text-rose-700 font-medium capitalize'>{doc.speciality || 'Gynécologue'}</p>
                                {doc.city && <p className='text-xs text-slate-500 flex items-center gap-1 mt-1'><MapPin size={12} />{doc.city}</p>}
                            </div>
                        </div>
                        {/* Rating */}
                        {doc.rating && (
                            <div className='flex items-center gap-2 mb-3'>
                                <div className='flex'>{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.round(doc.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />)}</div>
                                <span className='text-sm font-semibold text-slate-700'>{doc.rating}</span>
                                <span className='text-xs text-slate-500'>({doc.avis_count || 0} reviews)</span>
                            </div>
                        )}
                        <div className='flex flex-wrap gap-2 mb-4'>
                            {doc.consultation_type && <span className='flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700'>{doc.consultation_type === 'online' ? <Video size={12} /> : <Phone size={12} />}{doc.consultation_type}</span>}
                            {doc.consultation_duration && <span className='flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700'><Clock size={12} />{doc.consultation_duration} min</span>}
                            {doc.consultation_fee && <span className='flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700'>{doc.consultation_fee} MAD</span>}
                        </div>
                        <Link href={'/gynecologists/' + doc.id} className='w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm text-sm'>
                            <Calendar size={16} /> Voir le profil & réserver
                        </Link>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
