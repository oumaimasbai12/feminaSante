import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SymptomLogger() {
    const [menopause, setMenopause] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        log_date: new Date().toISOString().split('T')[0],
        severity: 'moderate',
        sleep_quality: 5,
        mood_score: 5,
        hot_flashes: false,
        night_sweats: false,
        mood_changes: false,
        sleep_changes: false,
        symptoms: [],
    });

    useEffect(() => {
        axios.get('/api/v1/menopauses')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setMenopause(res.data[0]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!menopause) return;

        setSaving(true);
        try {
            await axios.post(`/api/v1/menopauses/${menopause.id}/symptom-logs`, formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            
            // Reset form for next entry
            setFormData({
                ...formData,
                hot_flashes: false,
                night_sweats: false,
                mood_changes: false,
                sleep_changes: false,
                symptoms: [],
            });
        } catch (error) {
            console.error('Error logging symptoms', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-pulse h-64"></div>;
    }

    if (!menopause) {
        return (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                <p className="text-gray-500">Configurez votre profil ménopause pour suivre vos symptômes.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                Journal des Symptômes
            </h3>

            {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl font-medium flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Symptômes enregistrés avec succès !
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={formData.log_date}
                            onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
                            className="w-full rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sévérité</label>
                        <select
                            value={formData.severity}
                            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                            className="w-full rounded-xl border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        >
                            <option value="mild">Légère</option>
                            <option value="moderate">Modérée</option>
                            <option value="severe">Sévère</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-sm font-bold text-gray-800">Cochez ce que vous ressentez :</p>
                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm cursor-pointer hover:border-pink-300 border border-transparent transition">
                            <input type="checkbox" checked={formData.hot_flashes} onChange={e => setFormData({...formData, hot_flashes: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500 w-5 h-5" />
                            <span className="text-gray-700 font-medium">Bouffées de chaleur</span>
                        </label>
                        <label className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm cursor-pointer hover:border-pink-300 border border-transparent transition">
                            <input type="checkbox" checked={formData.night_sweats} onChange={e => setFormData({...formData, night_sweats: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500 w-5 h-5" />
                            <span className="text-gray-700 font-medium">Sueurs nocturnes</span>
                        </label>
                        <label className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm cursor-pointer hover:border-pink-300 border border-transparent transition">
                            <input type="checkbox" checked={formData.mood_changes} onChange={e => setFormData({...formData, mood_changes: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500 w-5 h-5" />
                            <span className="text-gray-700 font-medium">Sautes d'humeur</span>
                        </label>
                        <label className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm cursor-pointer hover:border-pink-300 border border-transparent transition">
                            <input type="checkbox" checked={formData.sleep_changes} onChange={e => setFormData({...formData, sleep_changes: e.target.checked})} className="rounded text-pink-600 focus:ring-pink-500 w-5 h-5" />
                            <span className="text-gray-700 font-medium">Troubles du sommeil</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Qualité du sommeil (1-10)</label>
                        <input
                            type="range" min="1" max="10"
                            value={formData.sleep_quality}
                            onChange={(e) => setFormData({ ...formData, sleep_quality: parseInt(e.target.value) })}
                            className="w-full accent-pink-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Mauvais</span>
                            <span className="font-bold text-pink-600">{formData.sleep_quality}/10</span>
                            <span>Excellent</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Humeur générale (1-10)</label>
                        <input
                            type="range" min="1" max="10"
                            value={formData.mood_score}
                            onChange={(e) => setFormData({ ...formData, mood_score: parseInt(e.target.value) })}
                            className="w-full accent-pink-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Difficile</span>
                            <span className="font-bold text-pink-600">{formData.mood_score}/10</span>
                            <span>Excellente</span>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition disabled:opacity-50 mt-4"
                >
                    {saving ? 'Enregistrement...' : 'Enregistrer les symptômes'}
                </button>
            </form>
        </div>
    );
}
