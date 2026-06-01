import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Common/Modal';
import { Calendar, CheckCircle2, Plus, Edit3, Activity, TrendingUp, Clock, ThermometerSun, Smile } from 'lucide-react';

export default function MenopauseDashboard({ data }) {
    const [menopause, setMenopause] = useState(data?.menopause || null);
    const [loading, setLoading] = useState(!data);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [insights, setInsights] = useState(null);
    const [symptomLogs, setSymptomLogs] = useState([]);
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

    const fetchMenopauseData = async () => {
        try {
            const response = await axios.get('/api/v1/menopauses');
            if (response.data && response.data.length > 0) {
                const mp = response.data[0];
                setMenopause(mp);
                calculateInsights(mp);
                // Fetch symptom logs
                const logsResponse = await axios.get(`/api/v1/menopauses/${mp.id}/symptom-logs`);
                setSymptomLogs(logsResponse.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching menopause data', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data && data.menopause) {
            setMenopause(data.menopause);
            calculateInsights(data.menopause);
            setSymptomLogs(data.menopause.symptom_logs || []);
            setLoading(false);
        } else {
            fetchMenopauseData();
        }
    }, [data]);

    const calculateInsights = (mp) => {
        if (!mp.symptom_logs || mp.symptom_logs.length === 0) {
            setInsights(null);
            return;
        }

        const logs = [...mp.symptom_logs].sort((a, b) => new Date(b.log_date) - new Date(a.log_date));
        const last7Days = logs.filter(log => {
            const date = new Date(log.log_date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date >= weekAgo;
        });

        const avgMood = last7Days.length > 0 
            ? Math.round(last7Days.reduce((sum, log) => sum + (log.mood_score || 5), 0) / last7Days.length)
            : 5;
        const avgSleep = last7Days.length > 0 
            ? Math.round(last7Days.reduce((sum, log) => sum + (log.sleep_quality || 5), 0) / last7Days.length)
            : 5;
        
        const hotFlashCount = last7Days.filter(log => log.hot_flashes).length;
        const nightSweatCount = last7Days.filter(log => log.night_sweats).length;
        
        const trend = last7Days.length >= 2 ? {
            mood: last7Days[0].mood_score > last7Days[1].mood_score ? 'up' : last7Days[0].mood_score < last7Days[1].mood_score ? 'down' : 'stable',
            sleep: last7Days[0].sleep_quality > last7Days[1].sleep_quality ? 'up' : last7Days[0].sleep_quality < last7Days[1].sleep_quality ? 'down' : 'stable'
        } : null;

        setInsights({
            avgMood,
            avgSleep,
            hotFlashCount,
            nightSweatCount,
            logsLast7Days: last7Days.length,
            trend
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isEditMode && menopause) {
                response = await axios.put(`/api/v1/menopauses/${menopause.id}`, formData);
            } else {
                response = await axios.post('/api/v1/menopauses', formData);
            }
            const mp = response.data.menopause || response.data;
            setMenopause(mp);
            calculateInsights(mp);
            setShowModal(false);
            setIsEditMode(false);
        } catch (error) {
            console.error('Error saving menopause data', error);
        }
    };

    const openEditModal = () => {
        setFormData({
            last_period_date: menopause.last_period_date,
            stage: menopause.stage,
            cycle_irregularity: menopause.cycle_irregularity,
            hot_flashes: menopause.hot_flashes,
            night_sweats: menopause.night_sweats,
            mood_changes: menopause.mood_changes,
            sleep_changes: menopause.sleep_changes,
            hormone_therapy: menopause.hormone_therapy,
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const stageLabels = {
        'perimenopause': 'Périménopause',
        'menopause': 'Ménopause',
        'postmenopause': 'Post-ménopause'
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    if (!menopause) {
        return (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                <div className="text-7xl mb-6">🌸</div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Commencez votre suivi</h3>
                <p className="text-slate-600 mb-6 max-w-lg mx-auto leading-relaxed">
                    Suivez vos symptômes, vos traitements et l'évolution de votre parcours pour mieux comprendre votre corps.
                </p>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm flex items-center gap-2 mx-auto"
                >
                    <Plus size={18} />
                    Configurer mon profil
                </button>

                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Mon profil Ménopause</h2>
                        <form onSubmit={handleSubmit} className="space-y-5 text-left">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Date des dernières règles</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.last_period_date}
                                    onChange={e => setFormData({ ...formData, last_period_date: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Stade actuel</label>
                                <select
                                    value={formData.stage}
                                    onChange={e => setFormData({ ...formData, stage: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                                >
                                    <option value="perimenopause">Périménopause</option>
                                    <option value="menopause">Ménopause</option>
                                    <option value="postmenopause">Post-ménopause</option>
                                </select>
                            </div>
                            <div className="space-y-3 mt-4">
                                <p className="text-sm font-semibold text-slate-700">Symptômes et informations fréquentes :</p>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.cycle_irregularity} onChange={e => setFormData({...formData, cycle_irregularity: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                    <span className="text-slate-700">Irrégularité du cycle</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.hot_flashes} onChange={e => setFormData({...formData, hot_flashes: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                    <span className="text-slate-700">Bouffées de chaleur</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.night_sweats} onChange={e => setFormData({...formData, night_sweats: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                    <span className="text-slate-700">Sueurs nocturnes</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.mood_changes} onChange={e => setFormData({...formData, mood_changes: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                    <span className="text-slate-700">Changements d'humeur</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.sleep_changes} onChange={e => setFormData({...formData, sleep_changes: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                    <span className="text-slate-700">Troubles du sommeil</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.hormone_therapy} onChange={e => setFormData({...formData, hormone_therapy: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                    <span className="text-slate-700">Sous thérapie hormonale</span>
                                </label>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => { setShowModal(false); setIsEditMode(false); }} className="px-5 py-2 text-slate-600 hover:text-slate-800 font-semibold">Annuler</button>
                                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-rose-100 font-medium mb-1">Stade Actuel</p>
                        <p className="text-2xl font-extrabold capitalize">{stageLabels[menopause.stage] || menopause.stage}</p>
                        <p className="text-sm mt-2 opacity-80">Depuis le {new Date(menopause.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
                        🌸
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-medium mb-1">Dernières Règles</p>
                        <p className="text-2xl font-bold text-slate-900">{new Date(menopause.last_period_date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                        <Calendar size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-medium mb-1">Statut</p>
                        <p className="text-2xl font-bold text-slate-900">{menopause.status === 'ongoing' ? 'En cours' : 'Terminé'}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-2xl">
                        <CheckCircle2 size={24} />
                    </div>
                </div>
            </div>

            {insights && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-slate-600">Humeur Moyenne</p>
                            {insights.trend?.mood && (
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${insights.trend.mood === 'up' ? 'bg-green-100 text-green-700' : insights.trend.mood === 'down' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                                    {insights.trend.mood === 'up' ? '↑ Améliore' : insights.trend.mood === 'down' ? '↓ Baisse' : '→ Stable'}
                                </span>
                            )}
                        </div>
                        <p className="text-3xl font-extrabold text-rose-600">{insights.avgMood}/10</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-slate-600">Qualité de Sommeil</p>
                            {insights.trend?.sleep && (
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${insights.trend.sleep === 'up' ? 'bg-green-100 text-green-700' : insights.trend.sleep === 'down' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                                    {insights.trend.sleep === 'up' ? '↑ Améliore' : insights.trend.sleep === 'down' ? '↓ Baisse' : '→ Stable'}
                                </span>
                            )}
                        </div>
                        <p className="text-3xl font-extrabold text-indigo-600">{insights.avgSleep}/10</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Bouffées Chaleur (7j)</p>
                        <p className="text-3xl font-extrabold text-orange-600">{insights.hotFlashCount}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Sueurs Nocturnes (7j)</p>
                        <p className="text-3xl font-extrabold text-indigo-600">{insights.nightSweatCount}</p>
                    </div>
                </div>
            )}

            <div className="flex justify-end">
                <button 
                    onClick={openEditModal}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-semibold text-sm"
                >
                    <Edit3 size={16} />
                    Modifier le profil
                </button>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                    <Clock size={20} className="text-rose-600" />
                    Historique des symptômes
                </h3>
                {symptomLogs.length > 0 ? (
                    <div className="space-y-4">
                        {symptomLogs.slice(0, 7).map(log => (
                            <div key={log.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold text-slate-700">
                                        {new Date(log.log_date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                        log.severity === 'mild' ? 'bg-green-100 text-green-700' : 
                                        log.severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {log.severity === 'mild' ? 'Légère' : log.severity === 'moderate' ? 'Modérée' : 'Sévère'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Smile size={16} className="text-rose-600" />
                                        <span className="text-sm text-slate-700">Humeur: {log.mood_score}/10</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-indigo-600" />
                                        <span className="text-sm text-slate-700">Sommeil: {log.sleep_quality}/10</span>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {log.hot_flashes && (
                                        <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
                                            <ThermometerSun size={12} />
                                            Bouffées de chaleur
                                        </span>
                                    )}
                                    {log.night_sweats && (
                                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1">
                                            Sueurs nocturnes
                                        </span>
                                    )}
                                    {log.mood_changes && (
                                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                                            Changements d'humeur
                                        </span>
                                    )}
                                    {log.sleep_changes && (
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                                            Troubles du sommeil
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
                        <div className="text-4xl mb-4">🌸</div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Commencez à suivre vos symptômes</h4>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            Utilisez le journal des symptômes ci-dessous pour enregistrer votre humeur, la qualité de votre sommeil et les symptômes que vous rencontrez.
                        </p>
                    </div>
                )}
            </div>

            <Modal show={showModal} onClose={() => { setShowModal(false); setIsEditMode(false); }}>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Modifier mon profil Ménopause</h2>
                    <form onSubmit={handleSubmit} className="space-y-5 text-left">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date des dernières règles</label>
                            <input
                                type="date"
                                required
                                value={formData.last_period_date}
                                onChange={e => setFormData({ ...formData, last_period_date: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Stade actuel</label>
                            <select
                                value={formData.stage}
                                onChange={e => setFormData({ ...formData, stage: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                            >
                                <option value="perimenopause">Périménopause</option>
                                <option value="menopause">Ménopause</option>
                                <option value="postmenopause">Post-ménopause</option>
                            </select>
                        </div>
                        <div className="space-y-3 mt-4">
                            <p className="text-sm font-semibold text-slate-700">Symptômes et informations fréquentes :</p>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={formData.cycle_irregularity} onChange={e => setFormData({...formData, cycle_irregularity: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                <span className="text-slate-700">Irrégularité du cycle</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={formData.hot_flashes} onChange={e => setFormData({...formData, hot_flashes: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                <span className="text-slate-700">Bouffées de chaleur</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={formData.night_sweats} onChange={e => setFormData({...formData, night_sweats: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                <span className="text-slate-700">Sueurs nocturnes</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={formData.mood_changes} onChange={e => setFormData({...formData, mood_changes: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                <span className="text-slate-700">Changements d'humeur</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={formData.sleep_changes} onChange={e => setFormData({...formData, sleep_changes: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                <span className="text-slate-700">Troubles du sommeil</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={formData.hormone_therapy} onChange={e => setFormData({...formData, hormone_therapy: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-500 w-5 h-5" />
                                <span className="text-slate-700">Sous thérapie hormonale</span>
                            </label>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => { setShowModal(false); setIsEditMode(false); }} className="px-5 py-2 text-slate-600 hover:text-slate-800 font-semibold">Annuler</button>
                            <button type="submit" className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm">Enregistrer les modifications</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
