import React, { useState, useEffect } from 'react';
import GlassCard from '@/Components/UI/GlassCard';
import ToggleOption from '@/Components/UI/ToggleOption';
import {
    Plus,
    Pill,
    ThermometerSun,
    Moon,
    Heart,
    Loader2,
    CheckCircle2,
    X,
} from 'lucide-react';

const api = () => window.axios;

const TYPE_LABELS = {
    medication: 'Médicament',
    therapy: 'Thérapie',
    lifestyle: 'Mode de vie',
    supplement: 'Complément',
    alternative: 'Alternative',
    monitoring: 'Suivi',
};

const RELIEF_OPTIONS = [
    {
        key: 'relieves_hot_flashes',
        label: 'Bouffées de chaleur',
        hint: 'Réduit ou soulage les vagues de chaleur',
        icon: ThermometerSun,
    },
    {
        key: 'relieves_sleep_changes',
        label: 'Troubles du sommeil',
        hint: 'Améliore la qualité du sommeil',
        icon: Moon,
    },
    {
        key: 'relieves_mood_changes',
        label: "Changements d'humeur",
        hint: "Stabilise l'humeur et le moral",
        icon: Heart,
    },
];

function emptyForm() {
    return {
        name: '',
        treatment_type: 'medication',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'active',
        description: '',
        notes: '',
        relieves_hot_flashes: false,
        relieves_sleep_changes: false,
        relieves_mood_changes: false,
    };
}

export default function TreatmentManager({ menopauseId, onSave }) {
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        if (!menopauseId) {
            setLoading(false);
            return;
        }
        api()
            .get(`/api/v1/menopauses/${menopauseId}/treatments`)
            .then((res) => setTreatments(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [menopauseId]);

    const openForm = () => {
        setFormData(emptyForm());
        setError('');
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;
        setShowForm(false);
        setError('');
    };

    const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!menopauseId) return;

        setSaving(true);
        setError('');
        try {
            const response = await api().post(`/api/v1/menopauses/${menopauseId}/treatments`, formData);
            setTreatments([response.data.treatment, ...treatments]);
            setShowForm(false);
            setFormData(emptyForm());
            onSave?.();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(' ')) ||
                    "Impossible d'enregistrer le traitement.",
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <GlassCard className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
            </GlassCard>
        );
    }

    if (!menopauseId) {
        return (
            <GlassCard className="p-8 text-center">
                <p className="text-brand-muted">Configurez votre profil ménopause pour gérer vos traitements.</p>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-6">
            <GlassCard className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h3 className="text-base font-bold text-brand-ink flex items-center gap-2">
                            <Pill size={18} className="text-brand-primary" />
                            Traitements & habitudes
                        </h3>
                        <p className="text-sm text-brand-muted mt-1">
                            THS, médicaments, compléments ou habitudes de bien-être.
                        </p>
                    </div>
                    {!showForm && (
                        <button
                            type="button"
                            onClick={openForm}
                            className="btn-primary text-sm inline-flex items-center justify-center gap-2 shrink-0"
                        >
                            <Plus size={16} />
                            Ajouter un traitement
                        </button>
                    )}
                </div>
            </GlassCard>

            {showForm && (
                <GlassCard className="p-5 sm:p-6 fs-reveal">
                    <div className="flex items-start justify-between gap-3 mb-6">
                        <div>
                            <h3 className="text-base font-bold text-brand-ink">Ajouter un traitement</h3>
                            <p className="text-sm text-brand-muted mt-1">
                                Médicament, THS, complément ou habitude de bien-être
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={closeForm}
                            disabled={saving}
                            className="p-2 rounded-lg text-brand-muted hover:text-brand-ink hover:bg-brand-bg transition-colors shrink-0 disabled:opacity-50"
                            aria-label="Fermer le formulaire"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div className="rounded-xl border border-brand-border bg-brand-bg/50 p-4 space-y-4">
                            <div>
                                <label htmlFor="treatment_name" className="block text-sm font-semibold text-brand-ink mb-2">
                                    Nom du traitement / habitude <span className="text-brand-primary">*</span>
                                </label>
                                <input
                                    id="treatment_name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => update('name', e.target.value)}
                                    placeholder="Ex. Yoga, THS, Vitamine D…"
                                    className="input-field bg-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="treatment_type" className="block text-sm font-semibold text-brand-ink mb-2">
                                    Type
                                </label>
                                <select
                                    id="treatment_type"
                                    value={formData.treatment_type}
                                    onChange={(e) => update('treatment_type', e.target.value)}
                                    className="input-field bg-white"
                                >
                                    {Object.entries(TYPE_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="treatment_description" className="block text-sm font-semibold text-brand-ink mb-2">
                                Description <span className="text-brand-muted font-normal">(optionnel)</span>
                            </label>
                            <textarea
                                id="treatment_description"
                                value={formData.description}
                                onChange={(e) => update('description', e.target.value)}
                                className="input-field resize-none bg-white"
                                rows={2}
                                placeholder="Posologie, fréquence, contexte…"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="treatment_start" className="block text-sm font-semibold text-brand-ink mb-2">
                                    Date de début
                                </label>
                                <input
                                    id="treatment_start"
                                    type="date"
                                    lang="fr-FR"
                                    required
                                    value={formData.start_date}
                                    onChange={(e) => update('start_date', e.target.value)}
                                    className="input-field bg-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="treatment_end" className="block text-sm font-semibold text-brand-ink mb-2">
                                    Date de fin <span className="text-brand-muted font-normal">(optionnel)</span>
                                </label>
                                <input
                                    id="treatment_end"
                                    type="date"
                                    lang="fr-FR"
                                    value={formData.end_date}
                                    onChange={(e) => update('end_date', e.target.value)}
                                    className="input-field bg-white"
                                />
                                <p className="text-[11px] text-brand-muted mt-1">
                                    Laissez vide si le traitement est en cours
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-semibold text-brand-ink">Ce traitement aide pour</p>
                                <p className="text-xs text-brand-muted mt-1">
                                    Sélectionnez les symptômes concernés (optionnel)
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {RELIEF_OPTIONS.map(({ key, label, hint, icon }) => (
                                    <ToggleOption
                                        key={key}
                                        active={Boolean(formData[key])}
                                        onClick={() => update(key, !formData[key])}
                                        icon={icon}
                                        label={label}
                                        hint={hint}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="treatment_notes" className="block text-sm font-semibold text-brand-ink mb-2">
                                Notes <span className="text-brand-muted font-normal">(optionnel)</span>
                            </label>
                            <textarea
                                id="treatment_notes"
                                value={formData.notes}
                                onChange={(e) => update('notes', e.target.value)}
                                className="input-field resize-none bg-white"
                                rows={2}
                                placeholder="Remarques pour votre suivi…"
                            />
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={saving}
                                className="btn-secondary text-sm py-2.5 sm:min-w-[120px] disabled:opacity-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
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
                                        Enregistrer
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </GlassCard>
            )}

            <GlassCard className="p-5 sm:p-6">
                <h3 className="text-sm font-bold text-brand-ink mb-4">
                    Mes traitements {treatments.length > 0 && `(${treatments.length})`}
                </h3>

                {treatments.length === 0 ? (
                    <div className="text-center py-10 px-4 border border-dashed border-brand-border rounded-xl">
                        <Pill size={36} className="mx-auto text-brand-muted/40 mb-3" />
                        <p className="text-brand-ink font-semibold mb-1">Aucun traitement enregistré</p>
                        <p className="text-sm text-brand-muted mb-5">
                            Ajoutez votre THS, vos médicaments ou vos habitudes de bien-être.
                        </p>
                        {!showForm && (
                            <button
                                type="button"
                                onClick={openForm}
                                className="btn-primary text-sm inline-flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Ajouter mon premier traitement
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {treatments.map((treatment) => (
                            <div
                                key={treatment.id}
                                className="p-4 border border-brand-border rounded-xl bg-brand-bg/50 hover:bg-white transition-colors"
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-brand-ink">{treatment.name}</h4>
                                        <p className="text-sm text-brand-muted mt-0.5">
                                            {TYPE_LABELS[treatment.treatment_type] || treatment.treatment_type} ·
                                            Depuis le{' '}
                                            {new Date(treatment.start_date).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 text-xs font-bold rounded-full shrink-0 ${
                                            treatment.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-brand-bg text-brand-muted border border-brand-border'
                                        }`}
                                    >
                                        {treatment.status === 'active' ? 'Actif' : 'Arrêté'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
