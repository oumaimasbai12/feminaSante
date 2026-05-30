import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import GynecologistLayout from '@/Layouts/GynecologistLayout';
import {
    Calendar, CheckCircle, XCircle, User,
    Clock, List, Loader2, AlertCircle,
} from 'lucide-react';

const STATUS_STYLES = {
    confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pending: 'bg-amber-100  text-amber-800  border-amber-200',
    cancelled: 'bg-red-100    text-red-800    border-red-200',
    completed: 'bg-violet-100 text-violet-800 border-violet-200',
};
const STATUS_LABELS = {
    confirmed: 'Confirmé',
    pending: 'En Attente',
    cancelled: 'Annulé',
    completed: 'Terminé',
};

const fmtDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
});
const fmtTime = (iso) => new Date(iso).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
});

function StatCard({ title, value, icon, bgColor, textColor }) {
    return (
        <div className="rounded-2xl shadow-sm p-6 flex items-center space-x-4 border border-teal-100/60 bg-white/80 backdrop-blur-sm transition-all hover:scale-[1.03] hover:shadow-md duration-300">
            <div className={`p-4 rounded-2xl ${bgColor} ${textColor}`}>{icon}</div>
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">{value ?? 0}</p>
            </div>
        </div>
    );
}

function Toast({ message, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
    const colors = type === 'success'
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
        : 'bg-red-50 border-red-200 text-red-800';
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${colors}`}>
            {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message}
        </div>
    );
}

export default function Dashboard() {
    const [list, setList] = useState([]);
    const [stats, setStats] = useState({});
    const [gynName, setGynName] = useState('');
    const [pageLoading, setPageLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => setToast({ message: msg, type });

    // ── Charge les données au montage via API ──────────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) { router.visit('/login'); return; }

        window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        window.axios.get('/api/v1/gynecologist/dashboard')
            .then(res => {
                setList(res.data.appointments ?? []);
                setStats(res.data.stats ?? {});
                setGynName(res.data.gynecologist_name ?? '');
            })
            .catch(err => {
                if ([401, 403].includes(err.response?.status)) router.visit('/login');
                else showToast('Erreur lors du chargement des données.', 'error');
            })
            .finally(() => setPageLoading(false));
    }, []);

    // ── Met à jour le statut avec optimistic update + rollback ────────────────
    const updateStatus = async (id, newStatus) => {
        if (processingId) return;
        setProcessingId(id);
        const previous = list.find(a => a.id === id);

        setList(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        setStats(prev => {
            const s = { ...prev };
            s[`${previous.status}_appointments`] = Math.max(0, (s[`${previous.status}_appointments`] || 0) - 1);
            s[`${newStatus}_appointments`] = (s[`${newStatus}_appointments`] || 0) + 1;
            return s;
        });

        try {
            await window.axios.put(`/api/v1/gynecologist/appointments/${id}/status`, { status: newStatus });
            showToast('Statut mis à jour avec succès.');
        } catch (err) {
            // Rollback
            setList(prev => prev.map(a => a.id === id ? { ...a, status: previous.status } : a));
            setStats(prev => {
                const s = { ...prev };
                s[`${newStatus}_appointments`] = Math.max(0, (s[`${newStatus}_appointments`] || 0) - 1);
                s[`${previous.status}_appointments`] = (s[`${previous.status}_appointments`] || 0) + 1;
                return s;
            });
            showToast(err.response?.data?.message || 'Une erreur est survenue.', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    if (pageLoading) {
        return (
            <GynecologistLayout title="Tableau de bord">
                <Head title="Portail Gynécologue" />
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
                </div>
            </GynecologistLayout>
        );
    }

    return (
        <GynecologistLayout title="Tableau de bord">
            <Head title="Portail Gynécologue" />

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto space-y-8">

                {/* Welcome Banner */}
                <div className="p-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10 text-white">
                        <h1 className="text-3xl font-extrabold mb-2">Bonjour, Dr. {gynName} 👩‍⚕️</h1>
                        <p className="text-teal-100 text-lg">Voici un résumé de vos rendez-vous et vos patientes.</p>
                    </div>
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10" />
                    <div className="absolute bottom-0 right-32 -mb-20 w-48 h-48 rounded-full bg-white/10" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total RDV" value={stats.total_appointments}
                        icon={<Calendar className="w-7 h-7" />} bgColor="bg-blue-100" textColor="text-blue-600" />
                    <StatCard title="En Attente" value={stats.pending_appointments}
                        icon={<Clock className="w-7 h-7" />} bgColor="bg-amber-100" textColor="text-amber-600" />
                    <StatCard title="Confirmés" value={stats.confirmed_appointments}
                        icon={<CheckCircle className="w-7 h-7" />} bgColor="bg-emerald-100" textColor="text-emerald-600" />
                    <StatCard title="Terminés" value={stats.completed_appointments}
                        icon={<List className="w-7 h-7" />} bgColor="bg-violet-100" textColor="text-violet-600" />
                </div>

                {/* Table */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-teal-100/60 overflow-hidden">
                    <div className="p-6 border-b border-teal-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Gestion des Rendez-vous</h2>
                        <span className="text-sm text-gray-400">{list.length} rendez-vous</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-teal-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Patiente</th>
                                    <th className="p-4 font-semibold">Date &amp; Heure</th>
                                    <th className="p-4 font-semibold">Motif</th>
                                    <th className="p-4 font-semibold">Statut</th>
                                    <th className="p-4 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-teal-50">
                                {list.length > 0 ? list.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-teal-50/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{apt.patient_name}</p>
                                                    <p className="text-xs text-gray-400">{apt.is_first_visit ? '🟢 Première visite' : 'Suivi'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-gray-800 capitalize">{fmtDate(apt.start_time)}</p>
                                            <p className="text-sm text-gray-400 flex items-center mt-1">
                                                <Clock className="w-3.5 h-3.5 mr-1" />{fmtTime(apt.start_time)}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-gray-600 truncate max-w-xs" title={apt.reason}>{apt.reason || 'Non spécifié'}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[apt.status] ?? 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                {STATUS_LABELS[apt.status] ?? apt.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                {processingId === apt.id ? (
                                                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                                ) : (
                                                    <>
                                                        {apt.status === 'pending' && (<>
                                                            <button onClick={() => updateStatus(apt.id, 'confirmed')} title="Confirmer"
                                                                className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50 transition-all active:scale-90">
                                                                <CheckCircle className="w-6 h-6" />
                                                            </button>
                                                            <button onClick={() => updateStatus(apt.id, 'cancelled')} title="Annuler"
                                                                className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all active:scale-90">
                                                                <XCircle className="w-6 h-6" />
                                                            </button>
                                                        </>)}
                                                        {apt.status === 'confirmed' && (
                                                            <button onClick={() => updateStatus(apt.id, 'completed')}
                                                                className="text-xs bg-violet-100 text-violet-700 hover:bg-violet-200 px-3 py-1.5 rounded-lg font-medium transition-all active:scale-95">
                                                                Marquer Terminé
                                                            </button>
                                                        )}
                                                        {(apt.status === 'cancelled' || apt.status === 'completed') && (
                                                            <span className="text-xs text-gray-300 italic">—</span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center">
                                            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400 font-medium">Aucun rendez-vous trouvé.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </GynecologistLayout>
    );
}