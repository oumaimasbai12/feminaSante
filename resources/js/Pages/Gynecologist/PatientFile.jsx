import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import GynecologistLayout from '@/Layouts/GynecologistLayout';
import GlassCard from '@/Components/UI/GlassCard';
import FilterPills from '@/Components/UI/FilterPills';
import StatTile from '@/Components/UI/StatTile';
import StatusBadge from '@/Components/UI/StatusBadge';
import ConsultationMessages from '@/Components/Appointments/ConsultationMessages';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useDeferredLoading } from '@/hooks/useDeferredLoading';
import {
    DataTable,
    DataTableToolbar,
    DataTableScroll,
    DataTableEmpty,
} from '@/Components/UI/DataTable';
import { getStoredUser } from '@/utils/auth';
import { priorityClass, priorityLabel, PRIORITY_LABELS } from '@/utils/statusBadges';
import {
    ChevronLeft,
    Heart,
    Baby,
    Moon,
    Video,
    Clock,
    Stethoscope,
    MessageCircle,
    CheckCircle2,
    AlertTriangle,
    Calendar,
    FileText,
    Droplets,
} from 'lucide-react';

const PRIORITY_OPTIONS = [
    { value: 'emergency', label: PRIORITY_LABELS.emergency },
    { value: 'follow_up', label: PRIORITY_LABELS.follow_up },
    { value: 'routine', label: PRIORITY_LABELS.routine },
];

const fmtDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('fr-FR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : '—';

const fmtTime = (iso) =>
    iso ? new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

function formatStage(stage) {
    if (!stage) return '—';
    const value = typeof stage === 'object' ? stage.value ?? stage.name : stage;
    return String(value).replace(/_/g, ' ');
}

function StatSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                    <div className="h-3 w-20 bg-brand-border/60 rounded mb-3" />
                    <div className="h-8 w-12 bg-brand-border/60 rounded" />
                </div>
            ))}
        </div>
    );
}

function PageSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-5 w-40 bg-brand-border/50 rounded" />
            <div className="glass-card p-6 h-36" />
            <StatSkeleton />
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card h-64" />
                <div className="glass-card h-64" />
            </div>
        </div>
    );
}

function FeedbackBanner({ feedback }) {
    if (!feedback) return null;

    return (
        <div
            className={`p-3 rounded-xl text-sm font-medium border flex items-center gap-2 surface-transition ${
                feedback.type === 'success'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                    : 'bg-red-50/80 border-red-200 text-red-800'
            }`}
        >
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {feedback.message}
        </div>
    );
}

function hasNoteContent(form) {
    return Object.values(form).some((v) => String(v || '').trim());
}

export default function PatientFile({ userId }) {
    const { data: file, isInitialLoading, refetch: loadFile } = useApiQuery(
        `gynecologist:patient-file:${userId}`,
        () => window.axios.get(`/api/v1/gynecologist/patients/${userId}/file`).then((r) => r.data),
        { enabled: !!userId },
    );
    const showSkeleton = useDeferredLoading(isInitialLoading);
    const [priority, setPriority] = useState('routine');
    const [noteForm, setNoteForm] = useState({
        diagnostic: '',
        prescription: '',
        notes: '',
        patient_summary: '',
    });
    const [savingNote, setSavingNote] = useState(false);
    const [updatingPriority, setUpdatingPriority] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(getStoredUser()?.id);

    const showFeedback = (message, type = 'success') => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 5000);
    };

    useEffect(() => {
        setCurrentUserId(getStoredUser()?.id);
    }, []);

    useEffect(() => {
        if (file?.priority) {
            setPriority(file.priority);
        }
    }, [file?.priority]);

    const stats = useMemo(() => {
        if (!file) return null;
        const next = file.next_appointment;
        return {
            symptoms: file.symptom_timeline?.length ?? 0,
            notes: file.clinical_notes?.length ?? 0,
            appointments: file.appointments_history?.length ?? 0,
            nextLabel: next ? fmtDate(next.start_time) : '—',
        };
    }, [file]);

    const updatePriority = async (p) => {
        if (updatingPriority || p === priority) return;
        const previous = priority;
        setPriority(p);
        setUpdatingPriority(true);
        try {
            await window.axios.put(`/api/v1/gynecologist/patients/${userId}/priority`, { priority: p });
            await loadFile();
            showFeedback(`Priorité « ${priorityLabel(p)} » enregistrée.`);
        } catch (err) {
            setPriority(previous);
            showFeedback(err.response?.data?.message || 'Impossible de mettre à jour la priorité.', 'error');
        }
        setUpdatingPriority(false);
    };

    const saveNote = async (e) => {
        e.preventDefault();
        if (!hasNoteContent(noteForm)) {
            showFeedback('Renseignez au moins un champ avant d\'enregistrer.', 'error');
            return;
        }
        setSavingNote(true);
        try {
            const r = await window.axios.post('/api/v1/gynecologist/clinical-notes', {
                user_id: userId,
                appointment_id: file?.next_appointment?.id || null,
                ...noteForm,
            });
            setNoteForm({ diagnostic: '', prescription: '', notes: '', patient_summary: '' });
            await loadFile();
            showFeedback(r.data.message || 'Note clinique enregistrée.');
        } catch (err) {
            const errors = err.response?.data?.errors;
            const msg = errors
                ? Object.values(errors).flat()[0]
                : err.response?.data?.message || 'Erreur lors de l\'enregistrement.';
            showFeedback(msg, 'error');
        }
        setSavingNote(false);
    };

    if (!file) {
        if (isInitialLoading) {
            return (
                <GynecologistLayout title="Dossier patiente">
                    <Head title="Dossier patiente - FeminaSante" />
                    {showSkeleton ? <PageSkeleton /> : null}
                </GynecologistLayout>
            );
        }

        return (
            <GynecologistLayout title="Dossier patiente">
                <Head title="Dossier patiente - FeminaSante" />
                <Link
                    href="/gynecologist/patients"
                    className="inline-flex items-center gap-2 text-sm text-brand-primary font-semibold hover:opacity-80 transition-opacity mb-6"
                >
                    <ChevronLeft size={16} /> Retour aux patientes
                </Link>
                <GlassCard className="p-8 text-center">
                    <AlertTriangle size={32} className="text-brand-border mx-auto mb-3" />
                    <p className="text-brand-muted">Dossier inaccessible ou patiente introuvable.</p>
                </GlassCard>
            </GynecologistLayout>
        );
    }

    const state = file.current_state ?? {
        mode: 'none',
        label: 'Aucun suivi actif',
        detail: null,
    };
    const StateIcon = state.mode === 'pregnancy' ? Baby : state.mode === 'menopause' ? Moon : Heart;
    const nextAppt = file.next_appointment;
    const showVideo =
        file.video_call_available &&
        nextAppt?.consultation_type === 'video';

    return (
        <GynecologistLayout title={`Dossier — ${file.patient?.nom ?? 'Patiente'}`}>
            <Head title={`Dossier ${file.patient?.nom ?? 'patiente'} - FeminaSante`} />

            <div className="space-y-6">
                <Link
                    href="/gynecologist/patients"
                    className="inline-flex items-center gap-2 text-sm text-brand-primary font-semibold hover:opacity-80 transition-opacity"
                >
                    <ChevronLeft size={16} /> Retour aux patientes
                </Link>

                <FeedbackBanner feedback={feedback} />

                <GlassCard className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                        <div className="min-w-0">
                            <p className="text-brand-muted text-xs font-semibold uppercase tracking-wider mb-1">
                                Patiente
                            </p>
                            <h2 className="text-xl font-bold text-brand-ink">{file.patient.nom}</h2>
                            <p className="text-brand-muted text-sm mt-1">{file.patient.email}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-brand-muted">
                                {file.patient.age != null && <span>{file.patient.age} ans</span>}
                                {file.patient.blood_type && (
                                    <span className="inline-flex items-center gap-1">
                                        <Droplets size={14} className="text-brand-primary" />
                                        {file.patient.blood_type}
                                    </span>
                                )}
                                <span className={`status-badge ${priorityClass(priority)}`}>
                                    {priorityLabel(priority)}
                                </span>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <p className="text-xs font-semibold text-brand-muted mb-2">Priorité clinique</p>
                            <FilterPills
                                options={PRIORITY_OPTIONS}
                                value={priority}
                                onChange={updatePriority}
                                disabled={updatingPriority}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-bg border border-brand-border text-brand-ink text-sm font-semibold">
                            <StateIcon size={16} className="text-brand-primary" />
                            {state.label}
                            {state.detail ? ` — ${state.detail}` : ''}
                        </div>
                        {showVideo && (
                            <a
                                href={`https://meet.jit.si/feminasante-${nextAppt.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm"
                            >
                                <Video size={16} /> Démarrer la téléconsultation
                            </a>
                        )}
                    </div>

                    {nextAppt && (
                        <div className="mt-4 p-4 rounded-xl bg-white/42 border border-brand-border">
                            <p className="text-xs font-semibold text-brand-muted mb-2">Prochain rendez-vous</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
                                    <Calendar size={15} className="text-brand-primary" />
                                    {fmtDate(nextAppt.start_time)}
                                    {fmtTime(nextAppt.start_time) && (
                                        <span className="text-brand-muted font-normal">
                                            à {fmtTime(nextAppt.start_time)}
                                        </span>
                                    )}
                                </span>
                                <StatusBadge status={nextAppt.status} />
                                {nextAppt.consultation_type && (
                                    <span className="text-xs text-brand-muted capitalize">
                                        {nextAppt.consultation_type === 'video' ? 'Vidéo' : 'Cabinet'}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </GlassCard>

                {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatTile label="Symptômes" value={stats.symptoms} icon={Heart} />
                        <StatTile label="Notes cliniques" value={stats.notes} icon={FileText} />
                        <StatTile label="Rendez-vous" value={stats.appointments} icon={Calendar} />
                        <StatTile label="Prochain RDV" value={stats.nextLabel} icon={Clock} />
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-6">
                    <GlassCard className="p-5">
                        <h2 className="font-bold text-brand-ink mb-1 flex items-center gap-2">
                            <Clock size={18} className="text-brand-primary" />
                            Journal des symptômes
                        </h2>
                        <p className="text-xs text-brand-muted mb-4">
                            {(stats?.symptoms ?? 0) === 0
                                ? 'Aucune entrée'
                                : `${stats.symptoms} entrée${stats.symptoms > 1 ? 's' : ''} récente${stats.symptoms > 1 ? 's' : ''}`}
                        </p>
                        {file.symptom_timeline?.length === 0 ? (
                            <p className="text-sm text-brand-muted">
                                Aucun symptôme enregistré récemment. Les données apparaissent lorsque la
                                patiente suit son cycle ou sa ménopause.
                            </p>
                        ) : (
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {file.symptom_timeline.map((item, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border"
                                    >
                                        <div className="flex justify-between text-xs text-brand-muted mb-1">
                                            <span className="capitalize">{item.source}</span>
                                            <span>
                                                {item.date
                                                    ? new Date(item.date).toLocaleDateString('fr-FR')
                                                    : '—'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-brand-ink">{item.summary}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </GlassCard>

                    <GlassCard className="p-5 space-y-4">
                        <div>
                            <h2 className="font-bold text-brand-ink flex items-center gap-2">
                                <Stethoscope size={18} className="text-brand-primary" />
                                Notes cliniques
                            </h2>
                            <p className="text-xs text-brand-muted mt-1">
                                Le message patiente sera visible dans son espace après consultation.
                            </p>
                        </div>
                        <form onSubmit={saveNote} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-brand-muted mb-1">
                                    Diagnostic
                                </label>
                                <input
                                    placeholder="Ex. dysménorrhée primaire"
                                    value={noteForm.diagnostic}
                                    onChange={(e) =>
                                        setNoteForm({ ...noteForm, diagnostic: e.target.value })
                                    }
                                    className="input-field py-2.5"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-brand-muted mb-1">
                                    Prescription
                                </label>
                                <textarea
                                    placeholder="Traitement, posologie…"
                                    value={noteForm.prescription}
                                    onChange={(e) =>
                                        setNoteForm({ ...noteForm, prescription: e.target.value })
                                    }
                                    rows={2}
                                    className="input-field resize-none py-2.5"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-brand-muted mb-1">
                                    Notes internes
                                </label>
                                <textarea
                                    placeholder="Observations réservées au praticien"
                                    value={noteForm.notes}
                                    onChange={(e) => setNoteForm({ ...noteForm, notes: e.target.value })}
                                    rows={2}
                                    className="input-field resize-none py-2.5"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-brand-muted mb-1">
                                    Message pour la patiente
                                </label>
                                <textarea
                                    placeholder="Conseils, résumé de consultation…"
                                    value={noteForm.patient_summary}
                                    onChange={(e) =>
                                        setNoteForm({ ...noteForm, patient_summary: e.target.value })
                                    }
                                    rows={3}
                                    className="input-field resize-none py-2.5"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={savingNote}
                                className="w-full btn-primary text-sm disabled:opacity-50"
                            >
                                {savingNote ? 'Enregistrement…' : 'Enregistrer la note'}
                            </button>
                        </form>
                        <div className="space-y-2 max-h-48 overflow-y-auto border-t border-brand-border pt-4">
                            {file.clinical_notes?.length === 0 ? (
                                <p className="text-sm text-brand-muted text-center py-4">
                                    Aucune note enregistrée pour cette patiente.
                                </p>
                            ) : (
                                file.clinical_notes.map((n) => (
                                    <div
                                        key={n.id}
                                        className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border text-sm"
                                    >
                                        {n.diagnostic && (
                                            <p className="font-semibold text-brand-ink">{n.diagnostic}</p>
                                        )}
                                        {n.prescription && (
                                            <p className="text-brand-muted mt-1 whitespace-pre-wrap">
                                                {n.prescription}
                                            </p>
                                        )}
                                        {n.notes && (
                                            <p className="text-brand-muted mt-1 text-xs italic whitespace-pre-wrap">
                                                Note interne : {n.notes}
                                            </p>
                                        )}
                                        {n.patient_summary && (
                                            <div className="mt-2 p-2 rounded-lg bg-white/60 border border-brand-border">
                                                <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wide mb-1">
                                                    {n.shared_with_patient
                                                        ? 'Partagé avec la patiente'
                                                        : 'Message patiente'}
                                                </p>
                                                <p className="text-brand-ink whitespace-pre-wrap">
                                                    {n.patient_summary}
                                                </p>
                                            </div>
                                        )}
                                        <p className="text-xs text-brand-muted mt-2">
                                            {new Date(n.created_at).toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </GlassCard>
                </div>

                {(file.pregnancy || file.menopause?.profile || file.cycle?.latest) && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {file.pregnancy && (
                            <GlassCard className="p-5">
                                <h3 className="font-bold text-brand-ink flex items-center gap-2">
                                    <Baby size={18} className="text-brand-primary" />
                                    Grossesse
                                </h3>
                                <p className="text-sm text-brand-ink mt-2 font-semibold">
                                    Semaine {file.pregnancy.current_week}
                                </p>
                                <p className="text-sm text-brand-muted mt-1">
                                    Accouchement prévu :{' '}
                                    {file.pregnancy.due_date
                                        ? new Date(file.pregnancy.due_date).toLocaleDateString('fr-FR')
                                        : '—'}
                                </p>
                            </GlassCard>
                        )}
                        {file.menopause?.profile && (
                            <GlassCard className="p-5">
                                <h3 className="font-bold text-brand-ink flex items-center gap-2">
                                    <Moon size={18} className="text-brand-primary" />
                                    Ménopause
                                </h3>
                                <p className="text-sm text-brand-ink mt-2 font-semibold capitalize">
                                    {formatStage(file.menopause.profile.stage)}
                                </p>
                                <p className="text-sm text-brand-muted mt-1">
                                    {file.menopause.recent_logs?.length || 0} entrée
                                    {(file.menopause.recent_logs?.length || 0) > 1 ? 's' : ''} récente
                                    {(file.menopause.recent_logs?.length || 0) > 1 ? 's' : ''}
                                </p>
                            </GlassCard>
                        )}
                        {file.cycle?.latest && state.mode === 'cycle' && (
                            <GlassCard className="p-5">
                                <h3 className="font-bold text-brand-ink flex items-center gap-2">
                                    <Heart size={18} className="text-brand-primary" />
                                    Cycle menstruel
                                </h3>
                                <p className="text-sm text-brand-ink mt-2 font-semibold">
                                    Jour {file.cycle.current_day ?? '—'} du cycle
                                </p>
                                <p className="text-sm text-brand-muted mt-1">
                                    Durée moyenne : {file.cycle.average_length ?? '—'} jours
                                </p>
                            </GlassCard>
                        )}
                    </div>
                )}

                <DataTable>
                    <DataTableToolbar>
                        <div>
                            <h2 className="text-base font-bold text-brand-ink">Historique des rendez-vous</h2>
                            <p className="text-xs text-brand-muted mt-0.5">
                                {file.appointments_history?.length ?? 0} consultation
                                {(file.appointments_history?.length ?? 0) > 1 ? 's' : ''} avec cette patiente
                            </p>
                        </div>
                    </DataTableToolbar>
                    {!file.appointments_history?.length ? (
                        <DataTableEmpty>
                            <Calendar size={32} className="text-brand-border mx-auto mb-2" />
                            Aucun rendez-vous enregistré.
                        </DataTableEmpty>
                    ) : (
                        <DataTableScroll>
                            <table className="fs-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th className="hidden sm:table-cell">Motif</th>
                                        <th className="hidden md:table-cell">Type</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {file.appointments_history.map((a) => (
                                        <tr key={a.id}>
                                            <td>
                                                <p className="text-sm font-medium text-brand-ink">
                                                    {fmtDate(a.start_time)}
                                                </p>
                                                <p className="text-xs text-brand-muted">
                                                    {fmtTime(a.start_time)}
                                                </p>
                                                {a.reason && (
                                                    <p className="text-xs text-brand-muted sm:hidden mt-1 truncate max-w-[160px]">
                                                        {a.reason}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="text-brand-muted hidden sm:table-cell max-w-[180px] truncate">
                                                {a.reason || '—'}
                                            </td>
                                            <td className="text-brand-muted hidden md:table-cell capitalize">
                                                {a.consultation_type === 'video' ? 'Vidéo' : 'Cabinet'}
                                            </td>
                                            <td>
                                                <StatusBadge status={a.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </DataTableScroll>
                    )}
                </DataTable>

                <GlassCard className="p-5">
                    <h2 className="font-bold text-brand-ink mb-4 flex items-center gap-2">
                        <MessageCircle size={18} className="text-brand-primary" />
                        Messages
                    </h2>
                    <ConsultationMessages
                        apiBase={`/api/v1/gynecologist/patients/${userId}/messages`}
                        emptyLabel="Envoyez un message à cette patiente."
                        currentUserId={currentUserId}
                        onSent={() => showFeedback('Message envoyé à la patiente.')}
                    />
                </GlassCard>
            </div>
        </GynecologistLayout>
    );
}
