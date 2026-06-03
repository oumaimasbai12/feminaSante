import React, { useState } from 'react';
import { CheckCircle2, BookOpen } from 'lucide-react';
import GlassCard from '@/Components/UI/GlassCard';

const api = () => window.axios;

export default function SymptomLogger({ menopauseId, symptomCatalog = [], onSave }) {
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        log_date: new Date().toISOString().split('T')[0],
        severity: 'moderate',
        sleep_quality: 5,
        mood_score: 5,
        stress_level: 5,
        caffeine_cups: 0,
        exercise_minutes: 0,
        alcohol_units: 0,
        hot_flashes: false,
        night_sweats: false,
        mood_changes: false,
        sleep_changes: false,
        notes: '',
        selectedSymptoms: [],
    });

    const toggleCatalogSymptom = (symptomId) => {
        setFormData(prev => {
            const exists = prev.selectedSymptoms.find(s => s.symptom_id === symptomId);
            if (exists) {
                return { ...prev, selectedSymptoms: prev.selectedSymptoms.filter(s => s.symptom_id !== symptomId) };
            }
            return { ...prev, selectedSymptoms: [...prev.selectedSymptoms, { symptom_id: symptomId, intensity: 2 }] };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!menopauseId) return;

        setSaving(true);
        setError('');
        try {
            const payload = {
                log_date: formData.log_date,
                severity: formData.severity,
                sleep_quality: formData.sleep_quality,
                mood_score: formData.mood_score,
                stress_level: formData.stress_level,
                caffeine_cups: formData.caffeine_cups,
                exercise_minutes: formData.exercise_minutes,
                alcohol_units: formData.alcohol_units,
                hot_flashes: formData.hot_flashes,
                night_sweats: formData.night_sweats,
                mood_changes: formData.mood_changes,
                sleep_changes: formData.sleep_changes,
                notes: formData.notes || null,
                catalog_symptoms: formData.selectedSymptoms,
            };

            await api().post(`/api/v1/menopauses/${menopauseId}/symptom-logs`, payload);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            if (onSave) onSave();

            setFormData(prev => ({
                ...prev,
                hot_flashes: false,
                night_sweats: false,
                mood_changes: false,
                sleep_changes: false,
                selectedSymptoms: [],
                notes: '',
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
            console.error('Error logging symptoms', err);
        } finally {
            setSaving(false);
        }
    };

    if (!menopauseId) {
        return (
            <GlassCard className="p-8 text-center">
                <p className="text-brand-muted">Configurez votre profil ménopause pour suivre vos symptômes.</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-5 sm:p-6">
            <h3 className="text-base font-bold text-brand-ink mb-1 flex items-center gap-2">
                <BookOpen size={18} className="text-brand-primary" />
                Journal des symptômes
            </h3>
            <p className="text-sm text-brand-muted mb-6">
                Notez chaque jour votre humeur, sommeil et facteurs de mode de vie.
            </p>

            {success && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl font-semibold flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Symptômes enregistrés avec succès !
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-2">Date</label>
                        <input
                            type="date"
                            value={formData.log_date}
                            onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-2">Sévérité globale</label>
                        <select
                            value={formData.severity}
                            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                            className="input-field"
                        >
                            <option value="mild">Légère</option>
                            <option value="moderate">Modérée</option>
                            <option value="severe">Sévère</option>
                        </select>
                    </div>
                </div>

                {symptomCatalog.length > 0 && (
                    <div className="space-y-3 bg-brand-bg/60 p-5 rounded-2xl border border-brand-border">
                        <p className="text-sm font-semibold text-brand-ink">Symptômes du jour (catalogue) :</p>
                        <div className="grid grid-cols-2 gap-2">
                            {symptomCatalog.map(symptom => (
                                <label key={symptom.id} className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-brand-border cursor-pointer hover:border-brand-primary/40 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedSymptoms.some(s => s.symptom_id === symptom.id)}
                                        onChange={() => toggleCatalogSymptom(symptom.id)}
                                        className="rounded text-brand-primary focus:ring-brand-primary/30"
                                    />
                                    <span className="text-brand-ink">{symptom.name_fr}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-3 bg-brand-bg/60 p-5 rounded-2xl border border-brand-border">
                    <p className="text-sm font-semibold text-brand-ink">Facteurs de mode de vie :</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SliderField label="Niveau de stress" value={formData.stress_level} onChange={v => setFormData({ ...formData, stress_level: v })} min={1} max={10} low="Faible" high="Élevé" />
                        <SliderField label="Qualité du sommeil" value={formData.sleep_quality} onChange={v => setFormData({ ...formData, sleep_quality: v })} min={1} max={10} low="Mauvais" high="Excellent" />
                        <SliderField label="Humeur générale" value={formData.mood_score} onChange={v => setFormData({ ...formData, mood_score: v })} min={1} max={10} low="Difficile" high="Excellente" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <NumberField label="Café (tasses)" value={formData.caffeine_cups} onChange={v => setFormData({ ...formData, caffeine_cups: v })} max={20} />
                        <NumberField label="Exercice (min)" value={formData.exercise_minutes} onChange={v => setFormData({ ...formData, exercise_minutes: v })} max={600} />
                        <NumberField label="Alcool (unités)" value={formData.alcohol_units} onChange={v => setFormData({ ...formData, alcohol_units: v })} max={20} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-ink mb-2">Notes</label>
                    <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        className="input-field resize-none"
                        placeholder="Observations du jour..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full btn-primary disabled:opacity-50"
                >
                    {saving ? 'Enregistrement...' : 'Enregistrer les symptômes'}
                </button>
            </form>
        </GlassCard>
    );
}

function SliderField({ label, value, onChange, min, max, low, high }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-brand-ink mb-2">{label} ({value}/{max})</label>
            <input type="range" min={min} max={max} value={value} onChange={e => onChange(parseInt(e.target.value, 10))} className="w-full accent-brand-primary" />
            <div className="flex justify-between text-xs text-brand-muted mt-1"><span>{low}</span><span>{high}</span></div>
        </div>
    );
}

function NumberField({ label, value, onChange, max }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-brand-ink mb-1">{label}</label>
            <input type="number" min={0} max={max} value={value} onChange={e => onChange(parseInt(e.target.value, 10) || 0)} className="input-field py-2" />
        </div>
    );
}
