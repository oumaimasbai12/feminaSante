import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Common/Modal';
import { Plus, Trash2 } from 'lucide-react';

export default function TreatmentManager() {
    const [menopause, setMenopause] = useState(null);
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
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
    });

    useEffect(() => {
        axios.get('/api/v1/menopauses')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setMenopause(res.data[0]);
                    return axios.get(`/api/v1/menopauses/${res.data[0].id}/treatments`);
                } else {
                    setLoading(false);
                    return Promise.reject('No menopause profile found');
                }
            })
            .then(res => {
                setTreatments(res.data);
                setLoading(false);
            })
            .catch(err => {
                if (err !== 'No menopause profile found') {
                    console.error(err);
                }
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!menopause) return;

        try {
            const response = await axios.post(`/api/v1/menopauses/${menopause.id}/treatments`, formData);
            setTreatments([response.data.treatment, ...treatments]);
            setShowModal(false);
            setFormData({
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
            });
        } catch (error) {
            console.error('Error saving treatment', error);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    if (!menopause) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <p className="text-slate-500">Configurez votre profil ménopause pour gérer vos traitements.</p>
            </div>
        );
    }

    const typeLabels = {
        medication: 'Médicament',
        therapy: 'Thérapie',
        lifestyle: 'Mode de vie',
        supplement: 'Complément',
        alternative: 'Alternative',
        monitoring: 'Suivi'
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Traitements et habitudes
                </h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm font-semibold rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm flex items-center gap-2"
                    title="Ajouter un traitement"
                >
                    <Plus size={16} />
                    Ajouter
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-96">
                {treatments.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        Aucun traitement ou habitude enregistré pour le moment.
                    </div>
                ) : (
                    treatments.map((treatment) => (
                        <div key={treatment.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-sm transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900">{treatment.name}</h4>
                                    <p className="text-sm text-slate-500">{typeLabels[treatment.treatment_type]} • Depuis le {new Date(treatment.start_date).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${treatment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                                    {treatment.status === 'active' ? 'Actif' : 'Arrêté'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Ajouter un traitement</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nom du traitement / habitude</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Yoga, THS, Vitamine D..."
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                            <select
                                value={formData.treatment_type}
                                onChange={e => setFormData({ ...formData, treatment_type: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                            >
                                {Object.entries(typeLabels).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optionnelle)</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                                rows="2"
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Date de début</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.start_date}
                                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Date de fin (Optionnelle)</label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-3 mt-4">
                            <p className="text-sm font-semibold text-slate-700">Ce traitement aide pour :</p>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={formData.relieves_hot_flashes} onChange={e => setFormData({ ...formData, relieves_hot_flashes: e.target.checked })} className="rounded text-rose-600 focus:ring-rose-500" />
                                <span className="text-slate-700">Bouffées de chaleur</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={formData.relieves_sleep_changes} onChange={e => setFormData({ ...formData, relieves_sleep_changes: e.target.checked })} className="rounded text-rose-600 focus:ring-rose-500" />
                                <span className="text-slate-700">Troubles du sommeil</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={formData.relieves_mood_changes} onChange={e => setFormData({ ...formData, relieves_mood_changes: e.target.checked })} className="rounded text-rose-600 focus:ring-rose-500" />
                                <span className="text-slate-700">Changements d'humeur</span>
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Notes (Optionnelles)</label>
                            <textarea
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                                rows="2"
                            ></textarea>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-slate-600 hover:text-slate-800 font-semibold">Annuler</button>
                            <button type="submit" className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm">Ajouter</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
