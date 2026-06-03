import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '@/Components/UI/GlassCard';
import StatTile from '@/Components/UI/StatTile';
import {
    Search,
    MapPin,
    Clock,
    Calendar,
    ChevronRight,
    Stethoscope,
    Users,
    Banknote,
} from 'lucide-react';

export default function Gynecologists() {
    const [docs, setDocs] = useState([]);
    const [filters, setFilters] = useState({ cities: [], specialities: [] });
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [loading, setLoading] = useState(true);

    const loadDocs = useCallback(() => {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (city) params.city = city;
        if (speciality) params.speciality = speciality;

        window.axios
            .get('/api/v1/gynecologists', { params })
            .then((r) => setDocs(Array.isArray(r.data) ? r.data : r.data.data || []))
            .catch(() => setDocs([]))
            .finally(() => setLoading(false));
    }, [search, city, speciality]);

    useEffect(() => {
        window.axios
            .get('/api/v1/gynecologists/filters')
            .then((r) =>
                setFilters({
                    cities: r.data.cities || [],
                    specialities: r.data.specialities || [],
                }),
            )
            .catch(() => {});
    }, []);

    useEffect(() => {
        const t = setTimeout(loadDocs, search ? 300 : 0);
        return () => clearTimeout(t);
    }, [loadDocs, search, city, speciality]);

    const withFee = docs.filter((d) => d.consultation_fee != null);
    const avgFee =
        withFee.length > 0
            ? Math.round(
                  withFee.reduce((sum, d) => sum + Number(d.consultation_fee), 0) / withFee.length,
              )
            : null;
    const avgDuration =
        docs.length > 0
            ? Math.round(
                  docs.reduce((sum, d) => sum + (d.consultation_duration || 30), 0) / docs.length,
              )
            : null;

    return (
        <AppLayout title="Trouver un gynécologue">
            <Head title="Trouver un gynécologue - FeminaSante" />

            <p className="text-brand-muted text-sm mb-6">
                Consultez des gynécologues certifiés et réservez un créneau en ligne ou en cabinet.
            </p>

            {!loading && docs.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatTile label="Praticiens" value={docs.length} sub="disponibles" icon={Stethoscope} />
                    <StatTile label="Villes" value={filters.cities.length} sub="couvertes" icon={MapPin} />
                    <StatTile
                        label="Tarif moyen"
                        value={avgFee ? `${avgFee} MAD` : '—'}
                        sub="consultation"
                        icon={Banknote}
                    />
                    <StatTile
                        label="Durée moyenne"
                        value={avgDuration ? `${avgDuration} min` : '—'}
                        sub="par consultation"
                        icon={Clock}
                    />
                </div>
            )}

            <GlassCard className="p-4 mb-6">
                <div className="grid md:grid-cols-3 gap-3">
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher par nom…"
                            className="input-field pl-9 w-full"
                        />
                    </div>
                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input-field w-full"
                    >
                        <option value="">Toutes les villes</option>
                        {filters.cities.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <select
                        value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                        className="input-field w-full"
                    >
                        <option value="">Toutes les spécialités</option>
                        {filters.specialities.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
            </GlassCard>

            {loading && (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <GlassCard key={i} className="p-5 animate-pulse h-44" />
                    ))}
                </div>
            )}

            {!loading && docs.length === 0 && (
                <GlassCard className="text-center py-16 w-full">
                    <Users size={40} className="text-brand-border mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-brand-ink mb-2">Aucun gynécologue trouvé</h3>
                    <p className="text-brand-muted text-sm mb-4">
                        Modifiez vos filtres ou élargissez votre recherche.
                    </p>
                    {(search || city || speciality) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setCity('');
                                setSpeciality('');
                            }}
                            className="btn-secondary text-sm"
                        >
                            Réinitialiser les filtres
                        </button>
                    )}
                </GlassCard>
            )}

            {!loading && docs.length > 0 && (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {docs.map((doc) => (
                        <GlassCard
                            key={doc.id}
                            className="p-5 flex flex-col h-full hover:border-brand-primary/30 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 bg-brand-bg border border-brand-border text-brand-primary">
                                    {(doc.first_name || 'D').charAt(0)}
                                    {(doc.last_name || 'R').charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-brand-ink truncate">
                                        Dr. {doc.first_name} {doc.last_name}
                                    </h3>
                                    <p className="text-sm text-brand-primary">
                                        {doc.speciality || 'Gynécologue'}
                                    </p>
                                    {doc.city && (
                                        <p className="text-xs text-brand-muted flex items-center gap-1 mt-0.5">
                                            <MapPin size={11} />
                                            {doc.city}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4 text-sm">
                                <span className="flex items-center gap-1.5 text-brand-muted">
                                    <Clock size={14} />
                                    {doc.consultation_duration || 30} min
                                </span>
                                {doc.consultation_fee != null && (
                                    <span className="font-semibold text-brand-ink">
                                        {Number(doc.consultation_fee).toFixed(0)} MAD
                                    </span>
                                )}
                            </div>

                            <Link
                                href={`/gynecologists/${doc.id}?book=1`}
                                className="mt-auto btn-primary w-full text-sm inline-flex items-center justify-center gap-1"
                            >
                                <Calendar size={15} /> Réserver <ChevronRight size={14} />
                            </Link>
                        </GlassCard>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
