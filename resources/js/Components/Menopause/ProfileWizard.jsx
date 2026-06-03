import React, { useEffect, useState } from 'react';
import Modal from '@/Components/Common/Modal';
import ToggleOption from '@/Components/UI/ToggleOption';
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    X,
    Moon,
    Calendar,
    Activity,
    ThermometerSun,
    Droplets,
    Heart,
    Pill,
    Sparkles,
    Loader2,
} from 'lucide-react';

const STEPS = [
    { id: 1, title: 'Informations générales', short: 'Général', icon: Calendar },
    { id: 2, title: 'Symptômes', short: 'Symptômes', icon: Activity },
    { id: 3, title: 'Traitement & notes', short: 'Traitement', icon: Pill },
];

const SYMPTOM_OPTIONS = [
    { key: 'cycle_irregularity', label: 'Irrégularité du cycle', hint: 'Cycles plus courts, longs ou imprévisibles', icon: Calendar },
    { key: 'hot_flashes', label: 'Bouffées de chaleur', hint: 'Vagues de chaleur soudaines', icon: ThermometerSun },
    { key: 'night_sweats', label: 'Sueurs nocturnes', hint: 'Transpiration la nuit', icon: Droplets },
    { key: 'mood_changes', label: 'Sautes d\'humeur', hint: 'Irritabilité, anxiété ou tristesse', icon: Heart },
    { key: 'sleep_changes', label: 'Troubles du sommeil', hint: 'Difficultés à dormir ou réveils fréquents', icon: Moon },
];

const INITIAL_FORM = {
    last_period_date: '',
    diagnosis_date: '',
    age_at_onset: '',
    symptom_history_months: '',
    cycle_irregularity: false,
    hot_flashes: false,
    night_sweats: false,
    mood_changes: false,
    sleep_changes: false,
    hormone_therapy: false,
    notes: '',
};

function buildForm(data) {
    if (!data) return { ...INITIAL_FORM };
    return {
        ...INITIAL_FORM,
        ...data,
        last_period_date: data.last_period_date?.slice?.(0, 10) || data.last_period_date || '',
        diagnosis_date: data.diagnosis_date?.slice?.(0, 10) || data.diagnosis_date || '',
        age_at_onset: data.age_at_onset ?? '',
        symptom_history_months: data.symptom_history_months ?? '',
    };
}

function sanitizePayload(form) {
    return {
        last_period_date: form.last_period_date || null,
        diagnosis_date: form.diagnosis_date || null,
        age_at_onset: form.age_at_onset !== '' ? parseInt(form.age_at_onset, 10) : null,
        symptom_history_months: form.symptom_history_months !== '' ? parseInt(form.symptom_history_months, 10) : null,
        cycle_irregularity: Boolean(form.cycle_irregularity),
        hot_flashes: Boolean(form.hot_flashes),
        night_sweats: Boolean(form.night_sweats),
        mood_changes: Boolean(form.mood_changes),
        sleep_changes: Boolean(form.sleep_changes),
        hormone_therapy: Boolean(form.hormone_therapy),
        notes: form.notes || null,
    };
}

export default function ProfileWizard({ show, onClose, onSave, initialData = null, isEdit = false }) {
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState(() => buildForm(initialData));

    useEffect(() => {
        if (show) {
            setStep(1);
            setError('');
            setForm(buildForm(initialData));
        }
    }, [show, initialData]);

    const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async () => {
        if (!form.last_period_date) {
            setError('La date des dernières règles est obligatoire.');
            setStep(1);
            return;
        }

        setSaving(true);
        setError('');
        try {
            await onSave(sanitizePayload(form));
            setStep(1);
            onClose();
        } catch (e) {
            const msg =
                e.response?.data?.message ||
                (e.response?.data?.errors && Object.values(e.response.data.errors).flat().join(' ')) ||
                "Erreur lors de l'enregistrement du profil.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const goNext = () => {
        if (step === 1 && !form.last_period_date) {
            setError('Veuillez indiquer la date de vos dernières règles.');
            return;
        }
        setError('');
        setStep(step + 1);
    };

    const selectedSymptoms = SYMPTOM_OPTIONS.filter(({ key }) => form[key]).length;

    return (
        <Modal show={show} onClose={onClose} maxWidth="3xl" solid>
            <div className="flex flex-col max-h-[min(90vh,720px)]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-brand-border bg-white shrink-0">
                    <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                                <Moon size={22} className="text-brand-primary" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg font-bold text-brand-ink leading-tight">
                                    {isEdit ? 'Modifier mon profil' : 'Configurer mon profil ménopause'}
                                </h2>
                                <p className="text-sm text-brand-muted mt-1">
                                    {STEPS[step - 1].title} — étape {step} sur {STEPS.length}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="p-2 rounded-lg text-brand-muted hover:text-brand-ink hover:bg-brand-bg transition-colors shrink-0 disabled:opacity-50"
                            aria-label="Fermer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {STEPS.map((s, i) => {
                            const Icon = s.icon;
                            const done = step > s.id;
                            const active = step === s.id;
                            return (
                                <React.Fragment key={s.id}>
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                                                done || active
                                                    ? 'bg-brand-primary text-white'
                                                    : 'bg-brand-bg text-brand-muted border border-brand-border'
                                            }`}
                                        >
                                            {done ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                                        </div>
                                        <span
                                            className={`text-xs font-semibold truncate hidden sm:block ${
                                                active ? 'text-brand-primary' : done ? 'text-brand-ink' : 'text-brand-muted'
                                            }`}
                                        >
                                            {s.short}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div
                                            className={`h-0.5 flex-1 max-w-12 rounded-full ${
                                                step > s.id ? 'bg-brand-primary' : 'bg-brand-border'
                                            }`}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
                    {error && (
                        <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div key={step} className="fs-enter-item">
                        {step === 1 && (
                            <div className="space-y-5">
                                <div className="rounded-xl border border-brand-border bg-brand-bg/50 p-4">
                                    <label htmlFor="last_period_date" className="block text-sm font-semibold text-brand-ink mb-2">
                                        Date des dernières règles <span className="text-brand-primary">*</span>
                                    </label>
                                    <input
                                        id="last_period_date"
                                        type="date"
                                        value={form.last_period_date}
                                        onChange={(e) => update('last_period_date', e.target.value)}
                                        className="input-field bg-white"
                                    />
                                    <p className="text-xs text-brand-muted mt-2 flex items-start gap-1.5">
                                        <Sparkles size={13} className="shrink-0 mt-0.5 text-brand-primary" />
                                        Sert à calculer votre stade (règle des 12 mois sans règles).
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="age_at_onset" className="block text-sm font-semibold text-brand-ink mb-2">
                                            Âge au début des symptômes
                                        </label>
                                        <input
                                            id="age_at_onset"
                                            type="number"
                                            min="35"
                                            max="65"
                                            value={form.age_at_onset}
                                            onChange={(e) => update('age_at_onset', e.target.value)}
                                            placeholder="Ex. 48"
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="symptom_history_months" className="block text-sm font-semibold text-brand-ink mb-2">
                                            Durée des symptômes (mois)
                                        </label>
                                        <input
                                            id="symptom_history_months"
                                            type="number"
                                            min="0"
                                            max="360"
                                            value={form.symptom_history_months}
                                            onChange={(e) => update('symptom_history_months', e.target.value)}
                                            placeholder="Ex. 6"
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="diagnosis_date" className="block text-sm font-semibold text-brand-ink mb-2">
                                        Date de diagnostic <span className="text-brand-muted font-normal">(optionnel)</span>
                                    </label>
                                    <input
                                        id="diagnosis_date"
                                        type="date"
                                        value={form.diagnosis_date}
                                        onChange={(e) => update('diagnosis_date', e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-semibold text-brand-ink">
                                        Symptômes que vous ressentez actuellement
                                    </p>
                                    <p className="text-xs text-brand-muted mt-1">
                                        Sélectionnez tout ce qui vous concerne — vous pourrez affiner au journal.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {SYMPTOM_OPTIONS.map(({ key, label, hint, icon }) => (
                                        <ToggleOption
                                            key={key}
                                            active={Boolean(form[key])}
                                            onClick={() => update(key, !form[key])}
                                            icon={icon}
                                            label={label}
                                            hint={hint}
                                        />
                                    ))}
                                </div>
                                {selectedSymptoms > 0 && (
                                    <p className="text-xs text-brand-primary font-medium">
                                        {selectedSymptoms}{' '}
                                        {selectedSymptoms > 1 ? 'symptômes sélectionnés' : 'symptôme sélectionné'}
                                    </p>
                                )}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-5">
                                <ToggleOption
                                    active={Boolean(form.hormone_therapy)}
                                    onClick={() => update('hormone_therapy', !form.hormone_therapy)}
                                    icon={Pill}
                                    label="Thérapie hormonale (THS)"
                                    hint="Cochez si vous suivez ou avez suivi un traitement hormonal"
                                />

                                <div>
                                    <label htmlFor="profile_notes" className="block text-sm font-semibold text-brand-ink mb-2">
                                        Notes personnelles
                                    </label>
                                    <textarea
                                        id="profile_notes"
                                        rows={4}
                                        value={form.notes}
                                        onChange={(e) => update('notes', e.target.value)}
                                        placeholder="Antécédents, traitements en cours, questions pour votre médecin…"
                                        className="input-field resize-none"
                                    />
                                </div>

                                <div className="rounded-xl border border-brand-border bg-brand-bg/50 p-4">
                                    <p className="font-semibold text-brand-ink mb-1 flex items-center gap-2">
                                        <Sparkles size={15} className="text-brand-primary" />
                                        Classification automatique
                                    </p>
                                    <p className="text-sm text-brand-muted leading-relaxed">
                                        <span className="font-medium text-brand-ink">Post-ménopause</span> si vos règles
                                        sont absentes depuis 12 mois, sinon{' '}
                                        <span className="font-medium text-brand-ink">Périménopause</span>.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-brand-border bg-brand-bg/30 shrink-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                        disabled={saving}
                        className="btn-secondary text-sm inline-flex items-center justify-center gap-1.5 py-2.5 sm:min-w-[120px] disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                        {step > 1 ? 'Précédent' : 'Annuler'}
                    </button>

                    {step < STEPS.length ? (
                        <button
                            type="button"
                            onClick={goNext}
                            className="btn-primary text-sm inline-flex items-center justify-center gap-1.5 py-2.5 sm:min-w-[120px]"
                        >
                            Suivant
                            <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={saving}
                            className="btn-primary text-sm inline-flex items-center justify-center gap-2 py-2.5 sm:min-w-[140px] disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Enregistrement…
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={16} />
                                    Terminer
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
