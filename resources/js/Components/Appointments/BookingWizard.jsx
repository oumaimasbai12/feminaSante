import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle,
    MapPin, AlertCircle, Loader2,
} from 'lucide-react';
import DoctorAvailability from './DoctorAvailability';
import { isLoggedIn } from '../../utils/auth';

const STEPS = [
    { id: 1, label: 'Médecin' },
    { id: 2, label: 'Créneau' },
    { id: 3, label: 'Motif' },
    { id: 4, label: 'Confirmation' },
];

export default function BookingWizard({ doctor, onFinished }) {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [availabilityDays, setAvailabilityDays] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [availabilityError, setAvailabilityError] = useState('');
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotError, setSlotError] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [commonReasons, setCommonReasons] = useState([]);
    const [form, setForm] = useState({
        reason: '',
        notes: '',
        consultation_type: 'in_person',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [confirmed, setConfirmed] = useState(null);

    useEffect(() => {
        window.axios.get('/api/v1/gynecologists/filters')
            .then(r => setCommonReasons(r.data.common_reasons || []))
            .catch(() => setCommonReasons([
                'Consultation annuelle', 'Douleurs pelviennes', 'Suivi de grossesse', 'Contraception', 'Autre',
            ]));
    }, []);

    useEffect(() => {
        if (!doctor?.id) return;
        setLoadingAvailability(true);
        setAvailabilityError('');
        window.axios.get(`/api/v1/gynecologists/${doctor.id}/availability`)
            .then(r => setAvailabilityDays(r.data.days || []))
            .catch(e => {
                setAvailabilityDays([]);
                setAvailabilityError(e.response?.data?.message || 'Impossible de charger les disponibilités.');
            })
            .finally(() => setLoadingAvailability(false));
    }, [doctor?.id]);

    useEffect(() => {
        if (step !== 2 || !selectedDate || !doctor?.id) return;
        setLoadingSlots(true);
        setSlotError('');
        setSelectedSlot(null);
        window.axios.get(`/api/v1/gynecologists/${doctor.id}/slots`, { params: { date: selectedDate } })
            .then(r => setSlots(r.data.slots || []))
            .catch(e => {
                setSlots([]);
                setSlotError(e.response?.data?.message || 'Impossible de charger les créneaux.');
            })
            .finally(() => setLoadingSlots(false));
    }, [step, selectedDate, doctor?.id]);

    const handleSelectDate = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null);
    };

    const submit = async () => {
        if (!selectedSlot) return;
        if (!isLoggedIn()) {
            const returnTo = window.location.pathname + window.location.search;
            window.location.href = '/login?redirect=' + encodeURIComponent(returnTo);
            return;
        }
        setSubmitting(true);
        setSubmitError('');
        try {
            const r = await window.axios.post('/api/v1/appointments', {
                gynecologist_id: doctor.id,
                start_time: selectedSlot.start_time,
                end_time: selectedSlot.end_time,
                consultation_type: form.consultation_type,
                reason: form.reason,
                notes: form.notes,
            });
            setConfirmed(r.data.appointment);
            setStep(4);
            onFinished?.(r.data.appointment);
        } catch (e) {
            if (e.response?.status === 401) {
                setSubmitError('Session expirée. Reconnectez-vous pour confirmer votre rendez-vous.');
                return;
            }
            const msg = e.response?.data?.message
                || (e.response?.data?.errors ? Object.values(e.response.data.errors).flat()[0] : 'Réservation impossible.');
            setSubmitError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-border bg-white/40">
                <div className="flex items-center justify-between gap-2">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className="flex items-center gap-2 min-w-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                    step >= s.id ? 'bg-brand-primary text-white' : 'bg-brand-soft text-brand-muted'
                                }`}>
                                    {step > s.id ? '✓' : s.id}
                                </div>
                                <span className={`text-xs font-semibold hidden sm:block truncate ${step >= s.id ? 'text-brand-primary' : 'text-brand-muted'}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${step > s.id ? 'bg-brand-primary' : 'bg-brand-border'}`} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="p-6">
                {/* Step 1 — Doctor profile */}
                {step === 1 && (
                    <div className="space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                {(doctor.first_name || 'D').charAt(0)}{(doctor.last_name || 'R').charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-brand-ink">Dr. {doctor.first_name} {doctor.last_name}</h3>
                                <p className="text-sm text-brand-primary font-medium">{doctor.speciality}</p>
                                {doctor.city && (
                                    <p className="text-xs text-brand-muted flex items-center gap-1 mt-1"><MapPin size={12} />{doctor.city}</p>
                                )}
                            </div>
                        </div>
                        {doctor.bio && <p className="text-sm text-brand-muted leading-relaxed">{doctor.bio}</p>}
                        <div>
                            <p className="text-sm font-semibold text-brand-ink mb-2">Motifs de consultation courants</p>
                            <div className="flex flex-wrap gap-2">
                                {(commonReasons.length ? commonReasons : ['Consultation annuelle', 'Douleurs pelviennes']).map(r => (
                                    <span key={r} className="text-xs bg-brand-soft text-brand-primary px-3 py-1.5 rounded-full border border-brand-border">{r}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-brand-muted">
                            {doctor.consultation_duration && <span className="flex items-center gap-1"><Clock size={12} />{doctor.consultation_duration} min</span>}
                            {doctor.consultation_fee && <span>{doctor.consultation_fee} MAD</span>}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-brand-ink mb-2">Prochaines disponibilités</p>
                            <DoctorAvailability
                                days={availabilityDays}
                                loading={loadingAvailability}
                                error={availabilityError}
                                compact
                            />
                        </div>
                    </div>
                )}

                {/* Step 2 — Availability */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">Choisir une date</label>
                            <DoctorAvailability
                                days={availabilityDays}
                                loading={loadingAvailability}
                                error={availabilityError}
                                selectedDate={selectedDate}
                                onSelectDate={handleSelectDate}
                            />
                        </div>
                        {selectedDate && (
                            <>
                                {loadingSlots && (
                                    <div className="flex items-center justify-center gap-2 py-8 text-brand-muted text-sm">
                                        <Loader2 size={18} className="animate-spin" /> Chargement des créneaux...
                                    </div>
                                )}
                                {!loadingSlots && slotError && (
                                    <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
                                        <AlertCircle size={16} /> {slotError}
                                    </div>
                                )}
                                {!loadingSlots && !slotError && slots.length === 0 && (
                                    <p className="text-sm text-brand-muted text-center py-6">Aucun créneau disponible ce jour.</p>
                                )}
                                {!loadingSlots && slots.length > 0 && (
                                    <div>
                                        <p className="text-sm font-semibold text-brand-ink mb-3">Créneaux disponibles</p>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {slots.map(slot => (
                                                <button
                                                    key={slot.start_time}
                                                    type="button"
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                                                        selectedSlot?.start_time === slot.start_time
                                                            ? 'border-brand-primary bg-brand-soft text-brand-primary'
                                                            : 'border-brand-border text-brand-muted hover:border-brand-primary/40'
                                                    }`}
                                                >
                                                    {slot.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Step 3 — Request form */}
                {step === 3 && (
                    <div className="space-y-4">
                        {selectedSlot && (
                            <div className="p-4 rounded-xl bg-brand-soft border border-brand-border text-sm text-brand-primary flex items-center gap-2">
                                <Calendar size={16} />
                                {new Date(selectedSlot.start_time).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                {' à '}{selectedSlot.label}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">Motif de la consultation *</label>
                            <select
                                value={form.reason}
                                onChange={e => setForm({ ...form, reason: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Sélectionner un motif...</option>
                                {commonReasons.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">Notes complémentaires</label>
                            <textarea
                                value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                                rows={3}
                                placeholder="Symptômes, contexte médical, questions..."
                                className="input-field resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-brand-ink mb-2">Type de consultation</label>
                            <div className="flex gap-2">
                                {[{ v: 'in_person', l: 'En cabinet' }, { v: 'online', l: 'En ligne' }].map(t => (
                                    <button
                                        key={t.v}
                                        type="button"
                                        onClick={() => setForm({ ...form, consultation_type: t.v })}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 ${
                                            form.consultation_type === t.v ? 'border-brand-primary bg-brand-soft text-brand-primary' : 'border-brand-border text-brand-muted'
                                        }`}
                                    >
                                        {t.l}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {submitError && (
                            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
                                <AlertCircle size={16} /> {submitError}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4 — Confirmation */}
                {step === 4 && confirmed && (
                    <div className="text-center py-4 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                            <CheckCircle size={32} className="text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-ink">Demande envoyée !</h3>
                        <p className="text-sm text-brand-muted leading-relaxed max-w-md mx-auto">
                            Votre rendez-vous avec <strong>Dr. {doctor.first_name} {doctor.last_name}</strong> est
                            <span className="font-semibold text-amber-700"> en attente de confirmation</span> par le cabinet.
                            Vous recevrez une notification dès que le médecin aura validé.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-800 text-sm font-semibold border border-amber-200">
                            <Clock size={14} /> Statut : En attente
                        </div>
                        <p className="text-xs text-brand-muted">
                            {new Date(confirmed.start_time).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            {step < 4 && (
                <div className="px-6 py-4 border-t border-brand-border flex gap-3">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep(s => s - 1)}
                            className="btn-secondary px-4 py-3"
                        >
                            <ChevronLeft size={16} /> Retour
                        </button>
                    )}
                    {step < 3 && (
                        <button
                            type="button"
                            disabled={
                                (step === 1 && !loadingAvailability && availabilityDays.length === 0)
                                || (step === 2 && (!selectedDate || !selectedSlot))
                            }
                            onClick={() => setStep(s => s + 1)}
                            className="flex-1 btn-primary"
                        >
                            Continuer <ChevronRight size={16} />
                        </button>
                    )}
                    {step === 3 && (
                        <button
                            type="button"
                            disabled={submitting || !form.reason}
                            onClick={submit}
                            className="flex-1 btn-primary"
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                            {submitting ? 'Envoi...' : 'Confirmer la demande'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
