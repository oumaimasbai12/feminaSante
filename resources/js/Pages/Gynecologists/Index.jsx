import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Search, MapPin, Star, Phone, Video, Clock, Calendar, Award, ChevronRight } from 'lucide-react';

export default function Gynecologists() {
    const [docs, setDocs] = useState([]);
    const [query, setQuery] = useState('');
    const [city, setCity] = useState('');
    const [type, setType] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        window.axios.get('/api/v1/gynecologists').then(r=>{
            const d = Array.isArray(r.data)?r.data:(r.data.data||[]);
            setDocs(d);
        }).catch(()=>{}).finally(()=>setLoading(false));
    },[]);

    const filtered = docs.filter(d=>{
        const q = query.toLowerCase();
        const mq = !q||d.first_name?.toLowerCase().includes(q)||d.last_name?.toLowerCase().includes(q)||d.speciality?.toLowerCase().includes(q);
        const mc = !city||d.city?.toLowerCase().includes(city.toLowerCase());
        const mt = type==='all'||d.consultation_type===type;
        return mq&&mc&&mt;
    });

    return (
        <AppLayout title='Find a Gynecologist'>
            {/* Search bar */}
            <div className='card mb-6 p-5'>
                <div className='grid md:grid-cols-3 gap-4'>
                    <div className='relative md:col-span-1'>
                        <Search size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'/>
                        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder='Search by name or specialty...' className='input-field pl-11'/>
                    </div>
                    <div className='relative'>
                        <MapPin size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'/>
                        <input value={city} onChange={e=>setCity(e.target.value)} placeholder='City...' className='input-field pl-11'/>
                    </div>
                    <div className='flex gap-2'>
                        {[{v:'all',l:'All'},{v:'in_person',l:'In-person'},{v:'online',l:'Online'},{v:'both',l:'Both'}].map(t=>(
                            <button key={t.v} onClick={()=>setType(t.v)} className={'flex-1 px-3 py-3 rounded-xl text-xs font-semibold border-2 transition-all '+(type===t.v?'border-pink-500 text-pink-700 bg-pink-50':'border-gray-100 text-gray-500 hover:border-pink-200')}>{t.l}</button>
                        ))}
                    </div>
                </div>
            </div>

            {loading && (
                <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {[...Array(6)].map((_,i)=>(<div key={i} className='card'><div className='skeleton h-4 rounded mb-3 w-2/3'></div><div className='skeleton h-3 rounded mb-2 w-1/2'></div><div className='skeleton h-3 rounded w-3/4'></div></div>))}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div className='text-center py-16 card'>
                    <div className='text-5xl mb-4'>👩‍⚕️</div>
                    <h3 className='text-lg font-bold text-gray-700 mb-2'>No gynecologists found</h3>
                    <p className='text-gray-500 text-sm'>Try adjusting your search filters.</p>
                </div>
            )}

            <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>
                {filtered.map(doc=>(
                    <div key={doc.id} className='card card-hover group'>
                        <div className='flex items-start gap-4 mb-4'>
                            <div className='w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0' style={{background:'linear-gradient(135deg,#be185d,#7e22ce)'}}>
                                {(doc.first_name||'D').charAt(0)}{(doc.last_name||'R').charAt(0)}
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h3 className='font-extrabold text-gray-900 group-hover:text-pink-600 transition-colors'>Dr. {doc.first_name} {doc.last_name}</h3>
                                <p className='text-sm text-pink-600 font-medium capitalize'>{doc.speciality||'Gynecologist'}</p>
                                {doc.city && <p className='text-xs text-gray-400 flex items-center gap-1 mt-1'><MapPin size={12}/>{doc.city}</p>}
                            </div>
                        </div>
                        {/* Rating */}
                        {doc.rating && (
                            <div className='flex items-center gap-2 mb-3'>
                                <div className='flex'>{[...Array(5)].map((_,i)=><Star key={i} size={14} className={i<Math.round(doc.rating)?'text-amber-400 fill-amber-400':'text-gray-200 fill-gray-200'}/>)}</div>
                                <span className='text-sm font-semibold text-gray-700'>{doc.rating}</span>
                                <span className='text-xs text-gray-400'>({doc.reviews_count||0} reviews)</span>
                            </div>
                        )}
                        <div className='flex flex-wrap gap-2 mb-4'>
                            {doc.consultation_type && <span className='flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700'>{doc.consultation_type==='online'?<Video size={12}/>:<Phone size={12}/>}{doc.consultation_type}</span>}
                            {doc.consultation_duration && <span className='flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700'><Clock size={12}/>{doc.consultation_duration} min</span>}
                            {doc.consultation_fee && <span className='flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700'>{doc.consultation_fee} MAD</span>}
                        </div>
                        <Link href={'/appointments?gynecologist='+doc.id} className='btn-primary w-full text-sm flex items-center justify-center gap-2'>
                            <Calendar size={16}/> Book Appointment
                        </Link>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
