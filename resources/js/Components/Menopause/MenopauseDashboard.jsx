import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Common/Modal';

export default function MenopauseDashboard() {
    const [menopause, setMenopause] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        last_period_date: '',
        stage: 'perimenopause',
        cycle_irregularity: false,
        hot_flashes: false,
        night_sweats: false,
        mood_changes: false,
        sleep_changes: false,
        hormone_therapy: false,
    });

    useEffect(() => {
        fetchMenopauseData();
    }, []);

    const fetchMenopauseData = async () => {
        try {
            const response = await axios.get('/api/v1/menopauses');
            if (response.data && response.data.length > 0) {
                setMenopause(response.data[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching menopause data', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/menopauses', formData);
            setMenopause(response.data.menopause);
            setShowModal(false);
        } catch (error) {
            console.error('Error saving menopause data', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8 bg-white rounded-3xl shadow-sm border border-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (!menopause) {
        return (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Commencez votre suivi</h3>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    Suivez vos symptômes, vos traitements et l'évolution de votre parcours pour mieux comprendre votre corps.
                </p>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-700 transition"
                >
                    Configurer mon profil
                </button>

                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mon profil Ménopause</h2>
                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date des dernières règles</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.last_period_date}
                                    onChange={e => setFormData({ ...formData, last_period_date: e.target.value })}
                                    className="w-full rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stade actuel</label>
                                <select
                                    value={formData.stage}
                                    onChange={e => setFormData({ ...formData, stage: e.target.value })}
                                    className="w-full rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                >
                                    <option value="perimenopause">Périménopause</option>
                                    <option value="menopause">Ménopause</option>
                                    <option value="postmenopause">Post-ménopause</option>
                                </select>
                            </div>
                            <div className="space-y-2 mt-4">
                                <p className="text-sm font-medium text-gray-700">Symptômes et informations fréquentes :</p>
                                <label className="flex items-center space-x-3">
                                    <input type="checkbox" checked={formData.cycle_irregularity} onChange={e => setFormData({...formData, cycle_irregularity: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500" />
                                    <span className="text-gray-700">Irrégularité du cycle</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input type="checkbox" checked={formData.hot_flashes} onChange={e => setFormData({...formData, hot_flashes: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500" />
                                    <span className="text-gray-700">Bouffées de chaleur</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input type="checkbox" checked={formData.night_sweats} onChange={e => setFormData({...formData, night_sweats: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500" />
                                    <span className="text-gray-700">Sueurs nocturnes</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input type="checkbox" checked={formData.mood_changes} onChange={e => setFormData({...formData, mood_changes: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500" />
                                    <span className="text-gray-700">Changements d'humeur</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input type="checkbox" checked={formData.sleep_changes} onChange={e => setFormData({...formData, sleep_changes: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500" />
                                    <span className="text-gray-700">Troubles du sommeil</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input type="checkbox" checked={formData.hormone_therapy} onChange={e => setFormData({...formData, hormone_therapy: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500" />
                                    <span className="text-gray-700">Sous thérapie hormonale</span>
                                </label>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Annuler</button>
                                <button type="submit" className="px-6 py-2 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        );
    }

    const stageLabels = {
        'perimenopause': 'Périménopause',
        'menopause': 'Ménopause',
        'postmenopause': 'Post-ménopause'
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
                <div>
                    <p className="text-pink-100 font-medium mb-1">Stade Actuel</p>
                    <p className="text-2xl font-extrabold capitalize">{stageLabels[menopause.stage] || menopause.stage}</p>
                    <p className="text-sm mt-2 opacity-80">Depuis le {new Date(menopause.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                    🌸
                </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 font-medium mb-1">Dernières Règles</p>
                    <p className="text-2xl font-bold text-gray-900">{new Date(menopause.last_period_date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 font-medium mb-1">Statut</p>
                    <p className="text-2xl font-bold text-gray-900">{menopause.status === 'ongoing' ? 'En cours' : 'Terminé'}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl">
                    ✨
                </div>
            </div>
        </div>
    );
}
