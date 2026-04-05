import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Common/Modal';

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
        return <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-pulse h-64"></div>;
    }

    if (!menopause) {
        return (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                <p className="text-gray-500">Configurez votre profil ménopause pour gérer vos traitements.</p>
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
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Traitements et Habitudes
                </h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition"
                    title="Ajouter un traitement"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-96">
                {treatments.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        Aucun traitement ou habitude enregistré pour le moment.
                    </div>
                ) : (
                    treatments.map((treatment) => (
                        <div key={treatment.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-sm transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-900">{treatment.name}</h4>
                                    <p className="text-sm text-gray-500">{typeLabels[treatment.treatment_type]} • Depuis le {new Date(treatment.start_date).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${treatment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                    {treatment.status === 'active' ? 'Actif' : 'Arrêté'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Ajouter un traitement</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du traitement / habitude</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Yoga, THS, Vitamine D..."
                                className="w-full rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={formData.treatment_type}
                                onChange={e => setFormData({ ...formData, treatment_type: e.target.value })}
                                className="w-full rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                            >
                                {Object.entries(typeLabels).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optionnelle)</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                rows="2"
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.start_date}
                                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin (Optionnelle)</label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                    className="w-full rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <p className="text-sm font-medium text-gray-700">Ce traitement aide pour :</p>
                            <label className="flex items-center space-x-3">
                                <input type="checkbox" checked={formData.relieves_hot_flashes} onChange={e => setFormData({...formData, relieves_hot_flashes: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500" />
                                <span className="text-gray-700">Bouffées de chaleur</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input type="checkbox" checked={formData.relieves_sleep_changes} onChange={e => setFormData({...formData, relieves_sleep_changes: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500" />
                                <span className="text-gray-700">Troubles du sommeil</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input type="checkbox" checked={formData.relieves_mood_changes} onChange={e => setFormData({...formData, relieves_mood_changes: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500" />
                                <span className="text-gray-700">Changements d'humeur</span>
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optionnelles)</label>
                            <textarea
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                rows="2"
                            ></textarea>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Annuler</button>
                            <button type="submit" className="px-6 py-2 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700">Ajouter</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
