import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
    MapPin, Phone, Mail, Star, Clock, Calendar, ChevronLeft,
    Video, User, Globe, Award, CheckCircle, AlertCircle, XCircle, Heart
} from 'lucide-react';

const STATUS = {
    pending: { l: 'En attente', c: 'bg-amber-100 text-amber-700', icon: AlertCircle },
    confirmed: { l: 'Confirmé', c: 'bg-green-100 text-green-700', icon: CheckCircle },
    cancelled: { l: 'Annulé', c: 'bg-red-100 text-red-700', icon: XCircle },
    completed: { l: 'Terminé', c: 'bg-gray-100 text-gray-600', icon: CheckCircle },
};

export default function GynecologistShow() {
    const id = window.location.pathname.split('/').pop();

    const [doc, setDoc] = useState(null);
    const [slots, setSlots] = useState([]);
    const [myAppts, setMyAppts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('profil');

    // booking form
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [form, setForm] = useState({ consultation_type: 'in_person', reason: '', notes: '', is_first_visit: false });
    const [booking, setBooking] = useState(false);
    const [bookMsg, setBookMsg] = useState(null);

    // review form
    const [reviewForm, setReviewForm] = useState({ rating: 5, review: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewMsg, setReviewMsg] = useState(null);

    useEffect(() => {
        Promise.all([
            window.axios.get(`/api/v1/gynecologists/${id}`),
            window.axios.get(`/api/v1/availabilities?gynecologist_id=${id}`).catch(() => ({ data: [] })),
            window.axios.get('/api/v1/appointments').catch(() => ({ data: [] })),
        ]).then(([g, a, appts]) => {
            setDoc(g.data);
            const avail = Array.isArray(a.data) ? a.data : (a.data.data || []);
            // only future slots
            setSlots(avail.filter(s => new Date(s.date) >= new Date().setHours(0, 0, 0, 0)));
            const all = Array.isArray(appts.data) ? appts.data : (appts.data.data || []);
            const forThis = all.filter(a => a.gynecologist_id === parseInt(id));
            setMyAppts(forThis);
            // reviews = completed appointments with a rating
            setReviews(forThis.filter(a => a.status === 'completed' && a.rating));
        }).catch(() => { }).finally(() => setLoading(false));
    }, [id]);

    const book = async () => {
        if (!selectedSlot) return;
        setBooking(true); setBookMsg(null);
        try {
            const start = new Date(`${selectedSlot.date}T${selectedSlot.start_time}`);
            const end = new Date(`${selectedSlot.date}T${selectedSlot.end_time}`);
            const r = await window.axios.post('/api/v1/appointments', {
                gynecologist_id: parseInt(id),
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                consultation_type: form.consultation_type,
                reason: form.reason,
                notes: form.notes,
                is_first_visit: form.is_first_visit,
            });
            setMyAppts([r.data.appointment, ...myAppts]);
            setBookMsg({ ok: true, text: 'Rendez-vous réservé avec succès !' });
            setSelectedSlot(null);
            setTab('rdv');
        } catch (e) {
            setBookMsg({ ok: false, text: e.response?.data?.message || 'Erreur lors de la réservation.' });
        } finally { setBooking(false); }
    };

    const submitReview = async (apptId) => {
        setSubmittingReview(true); setReviewMsg(null);
        try {
            await window.axios.put(`/api/v1/appointments/${apptId}`, {
                rating: reviewForm.rating,
                review: reviewForm.review,
            });
            setReviewMsg({ ok: true, text: 'Avis soumis, merci !' });
            setReviews(prev => [...prev, { ...reviewForm, id: apptId }]);
        } catch (e) {
            setReviewMsg({ ok: false, text: 'Erreur lors de la soumission.' });
        } finally { setSubmittingReview(false); }
    };

    const completedUnreviewed = myAppts.filter(
        a => a.status === 'completed' && !a.rating
    );

    if (loading) return (
        <AppLayout title="Chargement...">
            <div className="flex justify-center py-24">
                <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
            </div>
        </AppLayout>
    );

    if (!doc) return (
        <AppLayout title="Introuvable">
            <div className="text-center py-24 card">
                <p className="text-gray-500">Gynécologue introuvable.</p>
                <Link href="/gynecologists" className="btn-primary mt-4 inline-block">Retour</Link>
            </div>
        </AppLayout>
    );

    const tabs = [
        { k: 'profil', l: 'Profil' },
        { k: 'rdv', l: `Mes RDV (${myAppts.length})` },
        { k: 'reserver', l: '📅 Réserver' },
        { k: 'avis', l: `Avis (${reviews.length})` },
    ];

    return (
        <AppLayout title={`Dr. ${doc.first_name} ${doc.last_name}`}>
            {/* Back */}
            <Link href="/gynecologists" className="inline-flex items-center gap-2 text-sm text-pink-600 hover:text-pink-800 font-semibold mb-6 group">
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour à la liste
            </Link>

            {/* Hero card */}
            <div className="card mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white font-bold text-3xl flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#f472b6,#7c3aed)' }}>
                        {(doc.first_name || 'D').charAt(0)}{(doc.last_name || 'R').charAt(0)}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-extrabold text-gray-900">Dr. {doc.first_name} {doc.last_name}</h1>
                        <p className="text-pink-700 font-semibold mt-1">{doc.speciality}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                            {doc.city && <span className="flex items-center gap-1"><MapPin size={14} />{doc.adress}, {doc.city}</span>}
                            {doc.phone && <span className="flex items-center gap-1"><Phone size={14} />{doc.phone}</span>}
                            {doc.email && <span className="flex items-center gap-1"><Mail size={14} />{doc.email}</span>}
                        </div>
                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-3">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={i < Math.round(doc.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                                ))}
                            </div>
                            <span className="font-bold text-gray-700">{doc.rating}</span>
                            <span className="text-gray-400 text-xs">({doc.review_count} avis)</span>
                        </div>
                    </div>
                    {/* Quick info pills */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                        {doc.consultation_fee && (
                            <div className="px-4 py-2 rounded-2xl bg-green-50 text-green-700 font-bold text-center">
                                {doc.consultation_fee} MAD
                            </div>
                        )}
                        {doc.consultation_duration && (
                            <div className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-700 font-semibold text-sm flex items-center gap-2">
                                <Clock size={14} />{doc.consultation_duration} min
                            </div>
                        )}
                        <button onClick={() => setTab('reserver')} className="btn-primary text-sm">
                            Prendre RDV
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-pink-50 mb-6 flex-wrap">
                {tabs.map(t => (
                    <button key={t.k} onClick={() => setTab(t.k)}
                        className={'flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ' +
                            (tab === t.k ? 'text-white' : 'text-gray-500 hover:text-pink-700')}
                        style={tab === t.k ? { background: 'linear-gradient(135deg,#f472b6,#ffb6c1)' } : {}}>
                        {t.l}
                    </button>
                ))}
            </div>

            {/* ── PROFIL ── */}
            {tab === 'profil' && (
                <div className="space-y-4">
                    {doc.bio && (
                        <div className="card">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Award size={18} className="text-pink-500" />À propos</h3>
                            <p className="text-gray-600 leading-relaxed">{doc.bio}</p>
                        </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                        {doc.languages_spoken?.length > 0 && (
                            <div className="card">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Globe size={18} className="text-pink-500" />Langues parlées</h3>
                                <div className="flex flex-wrap gap-2">
                                    {doc.languages_spoken.map(l => (
                                        <span key={l} className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-sm font-medium">{l}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {doc.consultation_type?.length > 0 && (
                            <div className="card">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Video size={18} className="text-pink-500" />Types de consultation</h3>
                                <div className="flex flex-wrap gap-2">
                                    {doc.consultation_type.map(t => (
                                        <span key={t} className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-sm font-medium capitalize">
                                            {t === 'in_person' ? 'En cabinet' : t === 'online' ? 'En ligne' : t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── MES RDV ── */}
            {tab === 'rdv' && (
                <div className="space-y-4">
                    {myAppts.length === 0 && (
                        <div className="card text-center py-12">
                            <Calendar size={40} className="text-pink-200 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun rendez-vous avec ce médecin.</p>
                            <button onClick={() => setTab('reserver')} className="btn-primary mt-4">Réserver maintenant</button>
                        </div>
                    )}
                    {myAppts.map(a => {
                        const s = STATUS[a.status] || STATUS.pending;
                        const SI = s.icon;
                        return (
                            <div key={a.id} className="card flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1"><Calendar size={14} />{new Date(a.start_time).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} />{new Date(a.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    {a.reason && <p className="text-gray-400 text-sm mt-1">{a.reason}</p>}
                                </div>
                                <span className={'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ' + s.c}>
                                    <SI size={13} />{s.l}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── RÉSERVER ── */}
            {tab === 'reserver' && (
                <div className="space-y-4">
                    {bookMsg && (
                        <div className={'p-4 rounded-2xl text-sm font-semibold ' + (bookMsg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                            {bookMsg.text}
                        </div>
                    )}

                    {slots.length === 0 ? (
                        <div className="card text-center py-12">
                            <Calendar size={40} className="text-pink-200 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun créneau disponible pour le moment.</p>
                        </div>
                    ) : (
                        <div className="card">
                            <h3 className="font-bold text-gray-900 mb-4">Choisir un créneau</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                                {slots.map(s => (
                                    <button key={s.id} onClick={() => setSelectedSlot(s)}
                                        className={'p-3 rounded-2xl border-2 text-sm font-medium transition-all text-left ' +
                                            (selectedSlot?.id === s.id
                                                ? 'border-pink-500 bg-pink-50 text-pink-700'
                                                : 'border-gray-100 hover:border-pink-200 text-gray-600')}>
                                        <div className="font-semibold">{new Date(s.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                                        <div className="text-xs mt-0.5">{s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}</div>
                                    </button>
                                ))}
                            </div>

                            {selectedSlot && (
                                <div className="border-t border-gray-100 pt-5 space-y-4">
                                    <h4 className="font-semibold text-gray-800">Détails du rendez-vous</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type de consultation</label>
                                            <select value={form.consultation_type} onChange={e => setForm({ ...form, consultation_type: e.target.value })} className="input-field">
                                                <option value="in_person">En cabinet</option>
                                                <option value="online">En ligne</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-3 pt-6">
                                            <input type="checkbox" id="first" checked={form.is_first_visit} onChange={e => setForm({ ...form, is_first_visit: e.target.checked })} className="w-4 h-4 accent-pink-600" />
                                            <label htmlFor="first" className="text-sm font-medium text-gray-700">Première consultation</label>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Motif de consultation</label>
                                            <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="ex. Suivi annuel, grossesse..." className="input-field" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes supplémentaires</label>
                                            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="input-field resize-none" />
                                        </div>
                                    </div>
                                    <button onClick={book} disabled={booking} className="btn-primary w-full flex items-center justify-center gap-2">
                                        {booking ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Calendar size={16} />}
                                        Confirmer le rendez-vous
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ── AVIS ── */}
            {tab === 'avis' && (
                <div className="space-y-4">
                    {/* Leave a review for completed unreviewed appointments */}
                    {completedUnreviewed.map(appt => (
                        <div key={appt.id} className="card border-2 border-pink-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Heart size={18} className="text-pink-500" />Laisser un avis</h3>
                            {reviewMsg && (
                                <div className={'mb-3 p-3 rounded-xl text-sm font-semibold ' + (reviewMsg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                                    {reviewMsg.text}
                                </div>
                            )}
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                                        <Star size={28} className={n <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                                    </button>
                                ))}
                            </div>
                            <textarea value={reviewForm.review} onChange={e => setReviewForm({ ...reviewForm, review: e.target.value })}
                                rows={3} placeholder="Partagez votre expérience..." className="input-field resize-none mb-4" />
                            <button onClick={() => submitReview(appt.id)} disabled={submittingReview} className="btn-primary">
                                {submittingReview ? 'Envoi...' : 'Soumettre l\'avis'}
                            </button>
                        </div>
                    ))}

                    {/* Existing reviews */}
                    {reviews.length === 0 && completedUnreviewed.length === 0 && (
                        <div className="card text-center py-12">
                            <Star size={40} className="text-amber-200 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun avis pour le moment.</p>
                            <p className="text-gray-400 text-sm mt-1">Les avis apparaissent après une consultation terminée.</p>
                        </div>
                    )}

                    {reviews.map((r, i) => (
                        <div key={i} className="card">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, j) => <Star key={j} size={14} className={j < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />)}
                                </div>
                                <span className="text-xs text-gray-400">{new Date(r.created_at || Date.now()).toLocaleDateString('fr-FR')}</span>
                            </div>
                            {r.review && <p className="text-gray-600 text-sm">{r.review}</p>}
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}