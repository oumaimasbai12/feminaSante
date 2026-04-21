import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Components/Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import { Plus, Search, Star, MapPin, Pencil, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminGynecologists() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const { auth } = usePage().props;
    const user = auth?.user;

    const load = () => {
        setLoading(true);
        window.axios.get('/api/v1/gynecologists?all=1')
            .then(r => setDocs(Array.isArray(r.data) ? r.data : (r.data.data || [])))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const toggle = async (doc) => {
        await window.axios.put(`/api/v1/gynecologists/${doc.id}`, { is_active: !doc.is_active });
        setDocs(docs.map(d => d.id === doc.id ? { ...d, is_active: !d.is_active } : d));
    };

    const filtered = docs.filter(d => {
        const q = query.toLowerCase();
        return !q || d.first_name?.toLowerCase().includes(q) || d.last_name?.toLowerCase().includes(q) || d.city?.toLowerCase().includes(q);
    });

    return (
        <AdminLayout user={user}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900">Gynécologues</h1>
                <Link href="/admin/gynecologists/create" className="btn-primary flex items-center gap-2 text-sm">
                    <Plus size={16} /> Ajouter
                </Link>
            </div>

            <div className="card mb-5">
                <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={query} onChange={e => setQuery(e.target.value)}
                        placeholder="Rechercher par nom ou ville..." className="input-field pl-10" />
                </div>
            </div>

            {loading && <div className="text-center py-12 text-gray-400">Chargement...</div>}

            <div className="space-y-3">
                {filtered.map(doc => (
                    <div key={doc.id} className={'card flex items-center gap-4 ' + (!doc.is_active ? 'opacity-50' : '')}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#f472b6,#7c3aed)' }}>
                            {(doc.first_name || 'D').charAt(0)}{(doc.last_name || 'R').charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900">Dr. {doc.first_name} {doc.last_name}</h3>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                                <span>{doc.speciality}</span>
                                <span className="flex items-center gap-1"><MapPin size={11} />{doc.city}</span>
                                <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" />{doc.rating} ({doc.review_count})</span>
                                <span>{doc.consultation_fee} MAD</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link href={`/admin/gynecologists/${doc.id}/edit`}
                                className="p-2 rounded-xl border-2 border-gray-100 hover:border-pink-200 text-gray-500 hover:text-pink-700 transition-all">
                                <Pencil size={15} />
                            </Link>
                            <button onClick={() => toggle(doc)}
                                className={'p-2 rounded-xl border-2 transition-all ' + (doc.is_active ? 'border-green-100 text-green-600 hover:border-red-200 hover:text-red-500' : 'border-gray-100 text-gray-400 hover:border-green-200 hover:text-green-500')}>
                                {doc.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}